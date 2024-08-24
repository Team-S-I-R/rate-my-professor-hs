'use client'

import Image from "next/image";
import Header from "../rate-components/header";
import staticgif from '../asset/static.gif';
import { motion } from "framer-motion";
import { useState } from "react";
import rehypeRaw from 'rehype-raw';
import ReactMarkdown from 'react-markdown';
import { scrapeDataFromWeb } from "../actions";

export default function Chat() {
  const [scrapeUrl, setScrapeUrl] = useState("");
  const [mode, setMode] = useState("text");
  
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

  const handleScrape = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await scrapeDataFromWeb(scrapeUrl);
      if (result.success) {
        setScrapeUrl('');
        setMessages((prevMessages) => [
          ...prevMessages,
          { role: "user", content: message },
          { role: "assistant", content: result.message }
        ]);
        sendMessage();
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to scrape and store data');
    }
  };

  return (
    <main className="w-screen h-screen bg-white flex flex-col items-center justify-center">
      <div className="absolute z-10 top-0 w-full">
        <Header className="text-black"/>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-[90vw] max-w-[600px] h-[80vh] bg-white rounded-xl overflow-hidden flex flex-col"
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
                <ReactMarkdown rehypePlugins={[rehypeRaw]}>{message.content}</ReactMarkdown>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t">
          {mode === "text" && (
            <>
              <div className="flex flex-col gap-2">
                <p className="underline">Select a Mode</p>
                <div className="flex gap-2">
                  <button className="bg-blue-800 px-4 rounded-lg text-white p-2" onClick={() => setMode("text")}>Text</button>
                  <button className="bg-blue-800 px-4 rounded-lg text-white p-2" onClick={() => setMode("url")}>URL</button>
                </div>
              </div>
              <textarea
                className="w-full p-2 border rounded text-gray-800" 
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
            </>
          )}

          {mode === "url" && (
            <>
              <div className="flex flex-col gap-2">
                <p className="underline">Select a Mode</p>
                <div className="flex gap-2">
                  <button className="bg-blue-800 px-4 rounded-lg text-white p-2" onClick={() => setMode("text")}>Text</button>
                  <button className="bg-blue-800 px-4 rounded-lg text-white p-2" onClick={() => setMode("url")}>URL</button>
                </div>
              </div>
              <form onSubmit={handleScrape} className="flex">
                <input
                  type="text"
                  value={scrapeUrl}
                  onChange={(e) => setScrapeUrl(e.target.value)}
                  placeholder="Enter RateMyProfessor URL"
                  className="w-full p-2 border rounded text-gray-800"
                />
                <button type="submit" className="bg-black hover:bg-gray-800 px-4 rounded-lg text-white p-2">Scrape</button>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </main>
  );
}