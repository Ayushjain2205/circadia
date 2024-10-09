"use client";

import React, { useState, useEffect, useRef } from "react";
import Layout from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useChat } from "ai/react";

interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
}

const AskAI = () => {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: "/api/ask-ai", // Specify the correct API route
    });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check if the last message is from the assistant and incomplete
  const isStreaming =
    messages.length > 0 &&
    messages[messages.length - 1].role === "assistant" &&
    !messages[messages.length - 1].content.trim().endsWith(".");

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
                message.role === "user" ? "text-right" : "text-left"
              }`}
            >
              <div
                className={`inline-block max-w-[80%] p-3 rounded-2xl ${
                  message.role === "user"
                    ? "bg-[#7B2CBF] text-white"
                    : "bg-white text-[#7B2CBF] shadow-md"
                }`}
              >
                {message.role === "assistant" && (
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
                  {message.content}
                </ReactMarkdown>
              </div>
            </div>
          ))}
          {isLoading && !isStreaming && (
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
          <form onSubmit={handleSubmit} className="flex items-center space-x-2">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Ask me anything..."
              className="flex-1 h-12 rounded-full border-2 border-[#7B2CBF] bg-white text-[#7B2CBF] placeholder-[#7B2CBF] focus:ring-2 focus:ring-[#9D4EDD]"
            />
            <Button
              type="submit"
              className="bg-[#7B2CBF] hover:bg-[#9D4EDD] rounded-full w-12 h-12 flex items-center justify-center"
              disabled={isLoading}
            >
              <Send className="w-8 h-8 text-white" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AskAI;
