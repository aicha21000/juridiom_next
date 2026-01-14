"use client";
import React from 'react';
import Link from 'next/link';
import { useTheme } from '../context/ThemeContext';
import { Article } from '@/lib/blog';
import ReactMarkdown from 'react-markdown';
import { FaArrowLeft, FaFacebook, FaLinkedin, FaTwitter } from 'react-icons/fa';

interface BlogPostProps {
    article: Article;
}

const BlogPost: React.FC<BlogPostProps> = ({ article }) => {
    const { isDarkMode } = useTheme();

    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

    return (
        <div className={`min-h-screen ${isDarkMode ? "bg-gray-950 text-gray-100" : "bg-gray-50 text-gray-900"} transition-colors duration-300 pb-20`}>

            {/* Header Image or Gradient */}
            <div className={`h-64 md:h-80 w-full relative overflow-hidden ${isDarkMode ? "bg-gray-900" : "bg-gray-200"}`}>
                {article.imageUrl ? (
                    <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-gradient-to-r from-red-600 to-orange-600 opacity-90" />
                )}
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
                    <div className="max-w-4xl mx-auto">
                        <Link href="/blog" className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors">
                            <FaArrowLeft className="mr-2" /> Retour au blog
                        </Link>
                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 leading-tight">
                            {article.title}
                        </h1>
                        <div className="flex items-center text-white/90 text-sm md:text-base">
                            <span>Par {article.author}</span>
                            <span className="mx-2">•</span>
                            <span>{new Date(article.date).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-12">
                <div className={`prose lg:prose-xl max-w-none ${isDarkMode ? "prose-invert" : ""}`}>
                    <ReactMarkdown>{article.content}</ReactMarkdown>
                </div>

                {/* Share Section */}
                <div className={`mt-16 pt-8 border-t ${isDarkMode ? "border-gray-800" : "border-gray-200"}`}>
                    <h3 className="text-xl font-bold mb-4">Partager cet article</h3>
                    <div className="flex gap-4">
                        <a
                            href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                        >
                            <FaFacebook />
                        </a>
                        <a
                            href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 rounded-full bg-blue-700 text-white hover:bg-blue-800 transition-colors"
                        >
                            <FaLinkedin />
                        </a>
                        <a
                            href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${article.title}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 rounded-full bg-sky-500 text-white hover:bg-sky-600 transition-colors"
                        >
                            <FaTwitter />
                        </a>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default BlogPost;
