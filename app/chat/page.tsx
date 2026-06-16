"use client";
import ReactMarkdown from "react-markdown";

import { useState } from "react";

type Message = {
  role: "assistant" | "user";
  content: string;
};

export default function ChatPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi, I'm your AI Health Assistant. Tell me what's bothering you, and I'll provide educational guidance on possible next steps.",
    },
  ]);

  const [input, setInput] = useState("");
  function handleClear() {
    setMessages([
      {
        role: "assistant",
        content:
          "Hi, I'm your AI Health Assistant. Tell me what's bothering you, and I'll provide educational guidance on possible next steps.",
      },
    ]);
    setInput("");
  }
  async function handleSend() {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const data = await response.json();

      const aiReply: Message = {
        role: "assistant",
        content: data.reply,
      };

      setMessages((prev) => [...prev, aiReply]);
    } catch (error) {
      const errorReply: Message = {
        role: "assistant",
        content: "Sorry, something went wrong. Please try again.",
      };
      setMessages((prev) => [...prev, errorReply]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white px-6 py-4 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">ZARO AI Health Assistant</h1>
          <p className="text-sm text-gray-600">Educational symptom guidance</p>
        </div>

        <button
          onClick={handleClear}
          className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
          New Chat
        </button>
      </header>

      {/* Messages */}
      <section className="flex-1 overflow-y-auto px-6 py-6">
        <div className="mx-auto max-w-3xl space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-xl px-4 py-3 shadow ${
                  message.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-800"
                }`}
              >
                <p className="mb-1 text-sm font-semibold">
                  {message.role === "user" ? "You" : "Assistant"}
                </p>

                <div className="prose prose-sm max-w-none ">
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-xl bg-white px-4 py-3 shadow">
                <p className="mb-1 text-sm font-semibold">Zaro Assistant</p>
                <div className="flex gap-1">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]"></span>
                  <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]"></span>
                  <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Input */}
      <footer className="border-t bg-white px-6 py-4">
        <div className="mx-auto max-w-3xl">
          <div className="flex gap-3">
            <input
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
              type="text"
              placeholder="Type your symptoms here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              onClick={handleSend}
              disabled={isLoading}
              className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              Send
            </button>
          </div>

          <p className="mt-3 text-xs text-gray-500">
            This assistant provides educational information only and is not a
            substitute for professional medical advice, diagnosis, or treatment.
          </p>
        </div>
      </footer>
    </main>
  );
}
