import { GoogleGenAI } from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export async function getCuratorResponse(message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]) {
  if (!import.meta.env.VITE_GEMINI_API_KEY) {
    return "Куратор временно недоступен. (API Key missing)";
  }

  try {
    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: "Вы — Куратор Лаборатории Самости, мудрый юнгианский аналитик. Вы помогаете пользователю пройти путь индивидуации. Вы знаете всё о Тени, Персоне, Анимусе и Самости. Ваш тон — глубокий, поддерживающий, но профессиональный. Вы отвечаете на вопросы о процессе, помогаете интерпретировать сложные моменты и даете напутствия. Отвечайте на русском языке.",
      },
      history: history,
    });

    const result = await chat.sendMessage({ message });
    return result.text || "Я задумался над вашим вопросом...";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "Связь с Куратором прервалась, попробуйте позже.";
  }
}

export async function getJungianAnalysis(content: string, type: string) {
  if (!import.meta.env.VITE_GEMINI_API_KEY) {
    return "Куратор временно недоступен. (API Key missing)";
  }

  const prompts: Record<string, string> = {
    'oracle': `Вы — Алхимический Оракул. Проанализируйте этот символ или образ. Что он говорит о текущем состоянии психики пользователя? Дайте глубокую, символическую интерпретацию.
    Образ: "${content}"`,
    'imagination': `Вы — Куратор курса. Пользователь выполнил практику активного воображения. Дай краткую поддерживающую обратную связь и укажи на один важный психологический аспект в его ответе: "${content}"`,
    'mirror': `Вы — юнгианский аналитик. Проанализируйте эту запись о проекции (Зеркало). Какие паттерны или движения души здесь видны?
    Запись: "${content}"`,
    'diary': `Вы — юнгианский аналитик. Проанализируйте эту дневниковую запись. Какие паттерны или движения души здесь видны?
    Запись: "${content}"`
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompts[type] || `Проанализируйте эту запись с точки зрения юнгианской психологии: "${content}"`,
      config: {
        systemInstruction: "Вы — Куратор Дерева Самости, мудрый и современный юнгианский аналитик. Ваш тон — интеллектуальный, эстетичный, эмпатичный. Вы помогаете женщинам 35-45 лет в процессе самопознания. Отвечайте на русском языке. Используйте термины: архетип, проекция, индивидуация, но объясняйте их доступно.",
      },
    });

    return response.text || "Мысли пока не оформились в слова.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "В галерее сейчас технический перерыв, попробуйте позже.";
  }
}
