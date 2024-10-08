import OpenAI from "openai";
import type { NextApiRequest, NextApiResponse } from "next";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ message: "Message is required" });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are Circadia AI, a wellness assistant specializing in health, sleep, mental well-being, and nutrition. Provide helpful and accurate information to users' questions in these areas. Try keeping your responses concise and to the point.",
        },
        { role: "user", content: message },
      ],
    });

    const aiResponse = response.choices[0].message.content;
    res.status(200).json({ message: aiResponse });
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    res
      .status(500)
      .json({ message: "An error occurred while processing your request." });
  }
}
