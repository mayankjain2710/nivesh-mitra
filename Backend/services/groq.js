import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const generateResponse = async (prompt) => {
  const models = [
    "llama-3.3-70b-versatile",
    "llama-3.1-8b-instant"
  ];

  for (let model of models) {
    try {
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are a simple financial advisor for beginners in India.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        model: model,
        temperature: 0.7,
      });

      return chatCompletion.choices[0]?.message?.content || "No response";
    } catch (error) {
      console.log(`Model ${model} failed:`, error.message);
    }
  }

  return "All models failed. Try again.";
};