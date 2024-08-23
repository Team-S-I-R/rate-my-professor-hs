'use client'

import Image from "next/image";
import Header from "./rate-components/header";
import staticgif from './asset/static.gif'
import { motion } from "framer-motion";
import { useState } from "react";
import rehypeRaw from 'rehype-raw';
import ReactMarkdown from 'react-markdown'
import { scrapeDataFromWeb } from "./actions";


export default function Home() {

  const [scrapeUrl, setScrapeUrl] = useState("");
  const [mode, setMode] = useState("text");
  
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hello, I'm the Rate My Professor support assistant. 
      How can I help you today? 
      We have a nice feature where you
      can copy a rate my professor link and I'll show you some stats on 
      that professor!`
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
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement >) => {
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
    <main className="w-screen bg-neutral-900  h-screen overflow-y-scroll no-scrollbar ">

      <div className="absolute z-10 top-0 w-full">
        <Header/>
      </div>

      <div className="w-full h-full">
        <div className="w-full h-full flex flex-col place-items-center place-content-center">
          <motion.div 
          initial={{ opacity: 0, y: 200 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5 }}
          className="w-full flex place-content-center place-items-center relative h-full rounded-xl">
                  
          <img src={staticgif.src} alt="" className="w-full opacity-20 absolute h-full rounded-xl object-cover" />
          
          {/* outside of white box */}
          <div className="w-max z-10 relative">
              
              <motion.div 
              initial={{ opacity: 0, y: 200 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 3.5 }}
              className="flex flex-col gap-3 p-5 rounded-xl w-full h-[700px] bg-white">

              {message.includes("http") && mode === "text" && (
                <motion.div 
                initial={{ opacity: 0, y: 200 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5 }}
                className="absolute bg-white p-4 z-[-1]  top-[-10%] text-orange-600 font-bold rounded-xl right-0"> <p>Please use the url mode </p></motion.div>
              )}
                
                {/* hello */}
                <div className="w-full h-full gap-3 flex flex-col overflow-y-scroll no-scrollbar">
                  {messages.map((message: any, index: any) => (
                    <div
                      key={index}
                      className={`flex flex-col w-full ${message.role === "assistant" ? "place-items-end place-content-end" : "place-items-start place-content-start"}`}>
                      
                        <div 
                          className={`text-sm flex max-w-[900px] ${message.role === "assistant" ? "place-self-start text-white bg-neutral-800 px-6 rounded-lg" : "place-self-end text-orange-100 bg-orange-600 px-6 rounded-lg"}`}
                          // dangerouslySetInnerHTML={{ __html: message.content }}
                        >
                          <ReactMarkdown rehypePlugins={[rehypeRaw]} className="my-8 prose-md">{message.content}</ReactMarkdown>
                        </div>

                    </div>
                  ))}
                </div>
              

                {mode === "text" && (
                 <>
                <div className="flex flex-col gap-2">
                  <p className="underline">Select a Mode</p>
                    {/* type message */}
                    <div className={` text-neutral-800 w-max flex gap-2 rounded-lg text-white place-content-center place-items-center`}>
                      <button className="bg-orange-400 px-4 rounded-lg text-white p-2" onClick={() => setMode("text")}>Text</button>
                        |
                      <button className="bg-neutral-800 text-white opacity-50 hover:opacity-100  rounded-lg px-4 p-2" onClick={() => setMode("url")}>URL</button>
                    </div>
                </div>

                  <div className="w-full h-16 flex">
                      <input
                      className="w-full p-2 focus:outline-none"
                      placeholder="Type your message here..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      />
                      <button className="bg-orange-500 hover:bg-orange-400 px-4 rounded-lg text-white p-2" onClick={sendMessage} disabled={message.includes("www.")}>Send</button>
                  </div>
                 </>
                 )}

                 {mode === "url" && (
                  <>
                {/* url mode */}
                <div className="flex flex-col gap-2">
                  <p className="underline">Select a Mode</p>
                    <div className={` text-neutral-800 w-max flex gap-2 rounded-lg text-white place-content-center place-items-center`}>
                        <button className="bg-neutral-800 text-white opacity-50 hover:opacity-100  rounded-lg px-4 p-2" onClick={() => setMode("text")}>Text</button>
                        |
                        <button className="bg-orange-400 px-4 rounded-lg text-white p-2" onClick={() => setMode("url")}>URL</button>
                    </div>
                </div>
                <form onSubmit={handleScrape} className="h-16 w-full justify-between flex">
                  <input
                    type="text"
                    value={scrapeUrl}
                    onChange={(e) => setScrapeUrl(e.target.value)}
                    placeholder="Enter RateMyProfessor URL"
                    className="w-full p-2 focus:outline-none"
                  />
                  <button type="submit" className="bg-orange-500 hover:bg-orange-400  px-4 rounded-lg text-white p-2">Send</button>
              </form>
                  </>
                  )}

              
              </motion.div>
          
          </div>
          
          </motion.div>
        </div>
      </div>
    </main>
  );
}