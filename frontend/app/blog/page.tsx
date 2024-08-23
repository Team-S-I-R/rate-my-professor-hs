'use client';

import React from 'react';
import Header from '../rate-components/header';
import { motion } from 'framer-motion';
import Link from 'next/link';

const blogPosts = [
  {
    slug: "professor",
    title: "Professor",
    excerpt: "yap ...",
    date: "March 14, 2024",
  },
  {
    slug: "learning",
    title: "Learning",
    excerpt: "yap ...",
    date: "March 14, 2023",
  },
  {
    slug: "courses",
    title: "Courses",
    excerpt: "yap ...",
    date: "March 14, 2022",
  },
];

export default function Blog() {
  return (
    <main className="w-screen bg-white text-black min-h-screen overflow-y-auto">
      <Header />
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-16"
      >
        <h1 className="text-4xl font-bold text-center mb-8">Blog & Resources</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogPosts.map((post, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-100 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
              <p className="text-sm text-gray-500 mb-2">{post.date}</p>
              <p>{post.excerpt}</p>
              <Link href={`/blog/${post.slug}`} className="text-blue-500 hover:underline mt-4 block">Read more!!!</Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </main>
  );
}