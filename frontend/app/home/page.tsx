'use client'

import Link from "next/link";
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <main className="w-screen h-screen bg-white text-black flex flex-col items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-6xl font-bold mb-4">Professor Atlas</h1>
        <p className="text-xl">Your AI-powered professor rating assistant</p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex space-x-6"
      >
        <Link href="/chat">
          <button className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition duration-300">
            AI Rate My Professor
          </button>
        </Link>
        <Link href="/about">
          <button className="px-6 py-3 bg-white text-black border-2 border-black rounded-lg hover:bg-gray-100 transition duration-300">
            About Us
          </button>
        </Link>
      </motion.div>
    </main>
  );
}