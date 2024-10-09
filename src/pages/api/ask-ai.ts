import { OpenAIStream, StreamingTextResponse } from "ai";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const config = {
  runtime: "edge",
};

export default async function handler(req: Request) {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const { messages } = await req.json();

  if (!messages) {
    return new Response("Messages are required", { status: 400 });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are Circadia AI, a wellness assistant specializing in health, sleep, mental well-being, and nutrition. Provide helpful and accurate information to users' questions in these areas. Try keeping your responses concise and to the point.",
        },
        ...messages,
      ],
      stream: true,
    });

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    return new Response("An error occurred while processing your request.", {
      status: 500,
    });
  }
}
