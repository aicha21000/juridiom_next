"use client";
import React from 'react';
import Link from 'next/link';
import { useTheme } from '../context/ThemeContext';
import { Article } from '@/lib/blog';

interface BlogListProps {
    articles: Article[];
}

const BlogList: React.FC<BlogListProps> = ({ articles }) => {
    const { isDarkMode } = useTheme();

    return (
        <div className={`min-h-screen ${isDarkMode ? "bg-gray-950 text-gray-100" : "bg-gray-50 text-gray-900"} transition-colors duration-300`}>
            {/* Hero Section */}
            <div className={`py-16 ${isDarkMode ? "bg-gray-900" : "bg-white"} border-b ${isDarkMode ? "border-gray-800" : "border-gray-200"}`}>
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
                        Le <span className="text-red-600">Blog</span>
                    </h1>
                    <p className={`text-xl max-w-2xl mx-auto ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                        Actualités, conseils et guides sur la traduction certifiée et les démarches administratives.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-16">
                {articles.length === 0 ? (
                    <div className="text-center py-20">
                        <h2 className="text-2xl font-bold opacity-50">Aucun article disponible pour le moment.</h2>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {articles.map((article) => (
                            <article key={article.slug} className={`flex flex-col rounded-2xl overflow-hidden shadow-lg border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}>

                                {article.imageUrl && (
                                    <div className="h-48 overflow-hidden">
                                        <img
                                            src={article.imageUrl}
                                            alt={article.title}
                                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                        />
                                    </div>
                                )}

                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="text-sm text-red-600 font-semibold mb-2">
                                        {new Date(article.date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </div>
                                    <h2 className="text-xl font-bold mb-3 leading-tight line-clamp-2">
                                        <Link href={`/blog/${article.slug}`} className="hover:text-red-600 transition-colors">
                                            {article.title}
                                        </Link>
                                    </h2>
                                    <p className={`text-sm mb-4 line-clamp-3 flex-1 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                                        {article.summary}
                                    </p>
                                    <Link href={`/blog/${article.slug}`} className="inline-block font-semibold text-red-600 hover:text-red-700 transition-colors mt-auto">
                                        Lire l'article →
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlogList;
