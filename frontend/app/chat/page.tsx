'use client'

import Image from "next/image";
import Header from "../rate-components/header";
import staticgif from '../asset/static.gif'
import { motion } from "framer-motion";
import { useState } from "react";

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello, I'm the Rate My Professor support assistant. How can I help you today?",
    }
  ]);

  const [message, setMessage] = useState("");

  const sendMessage = async () => {
    if (message.trim() === "") return;
  
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: message },
      { role: "assistant", content: '' }
    ]);
  
    setMessage("");
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([...messages, { role: "user", content: message }]),
    });
  
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
  
    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        setMessages((prevMessages) => {
          const lastMessage = prevMessages[prevMessages.length - 1];
          const updatedMessages = prevMessages.slice(0, -1);
          return [
            ...updatedMessages,
            { ...lastMessage, content: lastMessage.content + text }
          ];
        });
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <main className="w-screen h-screen bg-neutral-900 bg-opacity-80 flex flex-col items-center justify-center">
      <div className="absolute z-10 top-0 w-full">
        <Header/>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-[90vw] max-w-[500px] h-[75vh] bg-white rounded-xl overflow-hidden flex flex-col"
      >
        <div className="flex-grow overflow-y-auto p-4">
          {messages.map((message: any, index: any) => (
            <div
              key={index}
              className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"} mb-4`}
            >
              <div 
                className={`max-w-[70%] p-3 rounded-lg ${
                  message.role === "assistant" 
                    ? "bg-blue-100 text-blue-800" 
                    : "bg-green-100 text-green-800"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t">
          <textarea
            className="w-full p-2 border rounded"
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button 
            onClick={sendMessage}
            className="mt-2 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition duration-300"
          >
            Send
          </button>
        </div>
      </motion.div>
    </main>
  );
}