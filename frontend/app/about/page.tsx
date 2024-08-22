'use client';

import React from 'react';
import Header from '../rate-components/header';
import { motion } from "framer-motion";

export default function About() {
  return (
    <main className="w-screen bg-neutral-900 bg-opacity-80 min-h-screen overflow-y-auto">
      <Header />

      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-16"
      >
        <h1 className="text-4xl font-bold text-white text-center mb-8">About Us</h1>
        <p className="text-lg text-white text-center mb-12">
          We are a passionate team dedicated to creating the best AI-powered professor rating system for students. Our project started development recently and aims to provide accurate and helpful information to students seeking the right professors for their courses.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {['Shaurya Bisht', 'Itwela Ibomu', 'Rehan Mohideen'].map((name, index) => (
            <motion.div 
              key={name}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white bg-opacity-10 rounded-lg p-6 text-center"
            >
              <div className="w-32 h-32 mx-auto mb-4 bg-gray-300 rounded-full"></div>
              <h2 className="text-xl font-semibold text-white mb-2">{name}</h2>
              <p className="text-white italic mb-2">Developer</p>
              <p className="text-white">Passionate about creating innovative solutions for students.</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </main>
  );
}