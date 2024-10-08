"use client";

import React, { useState, useEffect, useRef } from "react";
import Layout from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
}

const AskAI = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() === "") return;

    const newMessage: Message = {
      id: Date.now(),
      text: input,
      sender: "user",
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ask-ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch");
      }

      const data = await response.json();
      const aiResponse: Message = {
        id: Date.now(),
        text: data.message,
        sender: "ai",
      };
      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      const errorMessage: Message = {
        id: Date.now(),
        text: "I'm sorry, I couldn't process your request at the moment. Please try again later.",
        sender: "ai",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col h-full bg-gradient-to-b from-[#F3E8FF] to-white -m-4">
        <h1 className="text-4xl font-bold text-center my-6 text-[#7B2CBF]">
          ✨ Ask Circadia AI ✨
        </h1>
        <div className="flex-1 overflow-y-auto pb-24 px-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-4 ${
                message.sender === "user" ? "text-right" : "text-left"
              }`}
            >
              <div
                className={`inline-block max-w-[80%] p-3 rounded-2xl ${
                  message.sender === "user"
                    ? "bg-[#7B2CBF] text-white"
                    : "bg-white text-[#7B2CBF] shadow-md"
                }`}
              >
                {message.sender === "ai" && (
                  <div className="flex items-center mb-2">
                    <img
                      src="/logo.svg"
                      alt="Circadia AI"
                      className="w-6 h-6 mr-2"
                    />
                    <span className="font-semibold">Circadia AI</span>
                  </div>
                )}
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  className="markdown-content"
                >
                  {message.text}
                </ReactMarkdown>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="text-left mb-4">
              <div className="inline-block max-w-[80%] p-3 rounded-2xl bg-white text-[#7B2CBF] shadow-md">
                <div className="flex items-center">
                  <img
                    src="/logo.svg"
                    alt="Circadia AI"
                    className="w-6 h-6 mr-2"
                  />
                  <span className="font-semibold">
                    Circadia AI is thinking...
                  </span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="fixed bottom-20 left-0 right-0 p-4 bg-transparent">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center space-x-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 h-12 rounded-full border-2 border-[#7B2CBF] bg-white text-[#7B2CBF] placeholder-[#7B2CBF] focus:ring-2 focus:ring-[#9D4EDD]"
            />
            <Button
              type="submit"
              className="bg-[#7B2CBF] hover:bg-[#9D4EDD] rounded-full w-12 h-12 flex items-center justify-center"
              disabled={isLoading}
            >
              <Send className="w-6 h-6 text-white" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AskAI;
