'use client'

import Image from "next/image";
import Header from "./rate-components/header";
import staticgif from './asset/static.gif'
import { motion } from "framer-motion";
import { useState } from "react";

export default function Home() {
  
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello, I'm the Rate My Professor support assistant. How can I help you today?",
    }
  ]);

  const [message, setMessage] = useState("");
  const sendMessage = async () => {
    setMessages((messages: any) => [
      ...messages,
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
    }).then(async (res: any) => {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      let result = "";
      return reader.read().then(function processText({ done, value }: any) {
        if (done) {
          return result;
        }
        const text = decoder.decode(value || new Uint8Array(), { stream: true });
        setMessages((messages: any) => {
          let lastMessage = messages[messages.length - 1];  
          let otherMessages = messages.slice(0, messages.length - 1);
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text }
          ]
        });

        return reader.read().then(processText);
      });
    });

  }

  return (
    <main className="w-screen bg-neutral-900 bg-opacity-80 h-screen overflow-y-scroll no-scrollbar ">

      <div className="absolute z-10 top-0 w-full">
        <Header/>
      </div>

      <div className="w-full h-full">
        <div className="w-full h-full flex flex-col place-items-center place-content-center">
          <motion.div 
          initial={{ opacity: 0, y: 200 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5 }}
          className="w-[90vw] flex place-content-center place-items-center relative h-[75vh] bg-white rounded-xl">
                  
          <img src={staticgif.src} alt="" className="w-[90vw] absolute h-[75vh] rounded-xl object-cover" />
          
          {/* outside of white box */}
          <div className="w-max z-10 relative">
              
              <div className="flex flex-col p-5 rounded-xl w-[500px] h-[300px] bg-white">
                
                {/* hello */}
                <div className="w-full h-full flex flex-col max-h-[500px] overflow-y-scroll no-scrollbar">
                  {messages.map((message: any, index: any) => (
                    <div
                      key={index}
                      className={`flex flex-col ${message.role === "assistant" ? "items-end" : "items-start"}`}>
                      <div className={`text-sm ${message.role === "assistant" ? "text-black" : "text-orange-500"}`}>  
                        {message.content}
                      </div>
                    </div>
                  ))}
                </div>
              
                {/* type message */}
                <div className="w-full h-16 flex">
                    <textarea
                    className="w-full"
                    placeholder="Type your message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    />
                    <button onClick={sendMessage}>Send</button>
                </div>
              
              </div>
          
          </div>
          
          </motion.div>
        </div>
      </div>
    </main>
  );
}
