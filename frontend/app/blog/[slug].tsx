'use client';
import React from 'react';
import Header from '../rate-components/header';
import { motion } from 'framer-motion';

type BlogPostType = {
  title: string;
  content: string;
  date: string;
};

type BlogContentType = {
  [key: string]: BlogPostType;
};
const blogContent: BlogContentType = {
  "professor": {
    title: "Professor",
    content: "yap ...",
    date: "March 14, 2024",
  },
  "learning": {
    title: "learning",
    content: "yap ...",
    date: "March 14, 2023",
  },
  "courses": {
    title: "Courses",
    content: "yap ...",
    date: "March 14, 2022",
  },
};

type BlogPostProps = {
  params: {
    slug: string;
  };
};
export default function BlogPost({ params }: BlogPostProps) {
  const { slug } = params;
  const post = blogContent[slug];

  if (!post) {
    return <div>post not found, so sad</div>;
  }

  return (
    <main className="w-screen bg-white text-black min-h-screen overflow-y-auto">
      <Header/>
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-8">{post.title}</h1>
        <p className="text-sm text-gray-500 mb-4">{post.date}</p>
        <p>{post.content}</p>
      </motion.div>
    </main>
  );
}