import express from "express";
import { generateResponse } from "../services/groq.js";

const router = express.Router();

// 🟢 General Chat
router.post("/", async (req, res) => {
  const { message, language = "Hindi" } = req.body;

 const prompt = `
You are a friendly financial advisor helping beginners in India.

User message: ${message}

Reply STRICTLY in ${language}.

Instructions:
- Speak like you are talking to a first-time investor sitting in front of you in a friendly and simple way
- Use very simple language
- Avoid financial jargon or explain it simply if needed
- Do NOT follow any fixed format
- Do NOT always give examples or advice unless it feels natural
- Keep response short (3–4 lines)
- Avoid repeating same style every time

Goal:
Make the user clearly understand in the easiest possible way.
`;

  const reply = await generateResponse(prompt);

  res.json({ reply });
});

// 🟢 FD Explanation
router.post("/explain-fd", async (req, res) => {
  const { bank, interest, tenure, language = "Hindi" } = req.body;

  const prompt = `
Explain this Fixed Deposit in ${language}:

Bank: ${bank}
Interest: ${interest} per year
Tenure: ${tenure}

Rules:
- Very simple language
- Example with ₹10,000
- Max 4 lines
`;

  const reply = await generateResponse(prompt);

  res.json({ reply });
});

// 🟢 Fake Booking
router.post("/book-fd", (req, res) => {
  const { amount, tenure } = req.body;

  res.json({
    message: "FD booked successfully 🎉",
    details: {
      amount,
      tenure,
      status: "CONFIRMED",
    },
  });
});

export default router;