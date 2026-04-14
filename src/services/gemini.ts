// Используем прокси на Cloudflare Workers для обхода блокировок без ВПН.
const PROXY_URL = "https://gemini-proxy.yurkovezzz.workers.dev";

export async function getCuratorResponse(message: string, history: { role: 'user' | 'model'; parts: { text: string }[] }[]) {
  try {
    const systemPrompt = "ИНСТРУКЦИЯ: Вы — ИИ-Куратор пути индивидуации, мудрый юнгианский аналитик. Сопровождайте женщин 35–45 лет. Тон тёплый, глубокий. Обращайтесь на «Вы». Отвечайте на русском.\n\n";
    
    // Добавляем инструкцию к самому первому сообщению или к текущему
    const contents = history.length === 0 
      ? [{ role: 'user', parts: [{ text: systemPrompt + message }] }]
      : history.concat([{ role: 'user', parts: [{ text: message }] }]);
    
    // Ключ больше не передаем, прокси сам его подставит из своих настроек
    const response = await fetch(PROXY_URL, {
      method: "POST",
      mode: "cors",
      credentials: "omit",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents }),
    });

    const resultText = await response.text();

    if (!response.ok) {
      console.error("Proxy Error Details:", response.status, resultText);
      throw new Error(resultText || `Статус ${response.status}`);
    }

    const data = JSON.parse(resultText);
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Я задумался над вашим вопросом...";
  } catch (error) {
    console.error("Proxy Curator Error:", error);
    const msg = error instanceof Error ? error.message : 'Неизвестно';
    return `[ВЕРСИЯ 13] Ошибка: ${msg}.`;
  }
}

export async function getJungianAnalysis(content: string, type: string) {
  try {
    const systemPrompt = "ВЫ — ЮНГИАНСКИЙ АНАЛИТИК. Дайте глубокую обратную связь на запись пользователя. Обращайтесь на «Вы». Тон эмпатичный.\n\n";
    
    const prompts: Record<string, string> = {
      'reflection': `Рефлексия: "${content}"`,
      'projection': `Работа с проекциями: "${content}"`,
      'dreams': `Анализ сна: "${content}"`,
      'imagination': `Активное воображение: "${content}"`
    };

    const response = await fetch(PROXY_URL, {
      method: "POST",
      mode: "cors",
      credentials: "omit",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: systemPrompt + (prompts[type] || content) }] }]
      }),
    });

    const resultText = await response.text();

    if (!response.ok) {
      throw new Error(resultText || `Статус ${response.status}`);
    }

    const data = JSON.parse(resultText);
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Мысли пока не оформились в слова.";
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Неизвестно';
    return `[ВЕРСИЯ 13] Ошибка анализа: ${msg}.`;
  }
}
