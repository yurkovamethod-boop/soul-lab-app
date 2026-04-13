// Используем прокси на Cloudflare Workers для обхода блокировок без ВПН.
const PROXY_URL = "https://gemini-proxy.yurkovezzz.workers.dev";

export async function getCuratorResponse(message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]) {
  const API_KEY = process.env.GEMINI_API_KEY;
  
  if (!API_KEY) {
    console.error("GEMINI_API_KEY is missing in the environment!");
    return "Ошибка: API ключ не найден. Проверьте настройки GitHub Secrets.";
  }

  try {
    const contents = history.concat([{ role: 'user', parts: [{ text: message }] }]);
    
    console.log("Calling proxy:", PROXY_URL);
    const response = await fetch(`${PROXY_URL}/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents,
        systemInstruction: {
          parts: [{ text: "Вы — ИИ-Куратор пути индивидуации, мудрый юнгианский аналитик. Вы сопровождаете женщин 35–45 лет в прохождении курса по аналитической психологии Юнга. Вы знаете теорию индивидуации, Тени, Персоны, Анимы/Анимуса и Самости. Ваш тон — тёплый, глубокий, поддерживающий, психологически грамотный. Вы говорите языком жизни, а не учебника. Вы отвечаете на вопросы о пути, помогаете интерпретировать сложные моменты, поддерживаете в трудных местах. Задавайте вопросы и расширяйте перспективу. Обращайтесь к пользователю строго на «Вы» во множественном числе. Отвечайте на русском языке." }]
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Proxy Error Details:", response.status, errorData);
      throw new Error(`Ошибка прокси: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Я задумался над вашим вопросом...";
  } catch (error) {
    console.error("Proxy Curator Error:", error);
    return `Связь с ИИ-Куратором прервалась (Код: ${error instanceof Error ? error.message : 'Unknown'})`;
  }
}

export async function getJungianAnalysis(content: string, type: string) {
  const API_KEY = process.env.GEMINI_API_KEY;
  
  if (!API_KEY) {
    return "Ошибка: API ключ не найден.";
  }

