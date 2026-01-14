"use client";
import React, { useState, useEffect } from 'react';
import { myGoogleReviews } from '../data/myGoogleReviews';
import { useTheme } from '../context/ThemeContext';
import Image from 'next/image';
import google from '../assets/google_reviews.svg';

interface GoogleReview {
    name: string;
    text: string | null;
    stars: number;
    reviewerPhotoUrl: string;
    publishAt: string;
}

const GoogleReviews: React.FC = () => {
    const { isDarkMode } = useTheme();
    const [currentGroup, setCurrentGroup] = useState(0);
    const reviewsPerGroup = 3;
    const totalGroups = Math.ceil(myGoogleReviews.length / reviewsPerGroup);

    // Fonction pour passer au groupe suivant
    const nextGroup = () => {
        setCurrentGroup((prev) => (prev + 1) % totalGroups);
    };

    // Fonction pour passer au groupe précédent
    const prevGroup = () => {
        setCurrentGroup((prev) => (prev - 1 + totalGroups) % totalGroups);
    };

    // Auto-rotation toutes les 5 secondes
    useEffect(() => {
        const interval = setInterval(nextGroup, 5000);
        return () => clearInterval(interval);
    }, []);

    // Calculer les avis à afficher pour le groupe actuel
    const startIndex = currentGroup * reviewsPerGroup;
    const currentReviews = myGoogleReviews.slice(startIndex, startIndex + reviewsPerGroup);

    return (
        <section
            className="py-16 px-4 sm:px-6 lg:px-8"
            aria-label="Avis Google"
        >
            <div className="flex items-center justify-center mb-12">
                <Image
                    src={google}
                    alt="Logo Google"
                    width={90}
                    height={24}
                    className="h-8 sm:h-10 mr-4"
                />
                <h2 className={`text-2xl sm:text-3xl font-semibold ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>
                    Avis Google
                </h2>
            </div>

            <div className="relative max-w-7xl mx-auto">
                {/* Boutons de navigation */}
                <button
                    onClick={prevGroup}
                    className={`absolute -left-4 sm:-left-8 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
                        } shadow-lg hover:bg-yellow-400 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                    aria-label="Voir les avis précédents"
                >
                    <span className="text-xl">←</span>
                </button>
                <button
                    onClick={nextGroup}
                    className={`absolute -right-4 sm:-right-8 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
                        } shadow-lg hover:bg-yellow-400 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                    aria-label="Voir les avis suivants"
                >
                    <span className="text-xl">→</span>
                </button>

                {/* Grille d'avis */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {currentReviews.map((review: GoogleReview, index: number) => (
                        <article
                            key={index}
                            className={`p-6 sm:p-8 rounded-xl ${isDarkMode ? "bg-gray-800" : "bg-white"
                                } shadow-lg transition-all duration-500 transform hover:scale-105 min-h-[300px] flex flex-col`}
                            aria-label={`Avis de ${review.name}`}
                        >
                            <div className="flex items-center mb-6">
                                <div className="text-yellow-400 text-2xl sm:text-3xl" aria-label={`${review.stars} étoiles sur 5`}>
                                    {'★'.repeat(review.stars) + '☆'.repeat(5 - review.stars)}
                                </div>
                                <span className={`ml-3 text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                                    Google
                                </span>
                            </div>
                            <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} mb-6 text-base sm:text-lg flex-grow line-clamp-4`}>
                                {review.text || "Avis sans commentaire"}
                            </p>
                            <div className="flex items-center mt-auto">
                                <Image
                                    src={review.reviewerPhotoUrl}
                                    alt={`Photo de ${review.name}`}
                                    className="w-12 h-12 rounded-full mr-4"
                                    width={48}
                                    height={48}
                                />
                                <div>
                                    <p className={`font-semibold text-base sm:text-lg ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>
                                        {review.name}
                                    </p>
                                    <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                                        {review.publishAt}
                                    </p>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                {/* Points de navigation */}
                <div
                    className="flex justify-center mt-10 space-x-1.5"
                    role="tablist"
                    aria-label="Navigation entre les groupes d'avis"
                >
                    {Array.from({ length: totalGroups }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentGroup(index)}
                            className={`w-3 h-3 p-4 rounded-full cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-yellow-400 ${currentGroup === index
                                ? "bg-yellow-400 scale-110"
                                : isDarkMode
                                    ? "bg-gray-600"
                                    : "bg-gray-300"
                                }`}
                            role="tab"
                            aria-selected={currentGroup === index}
                            aria-label={`Groupe d'avis ${index + 1} sur ${totalGroups}`}
                        />
                    ))}
                </div>
            </div>

            <div className="mt-12 text-center">
                <a
                    href="https://g.page/r/CapRbq126IqpEBI/review"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center px-6 py-3 border-2 border-red-600 ${isDarkMode ? "text-white" : "text-red-600"
                        } rounded-lg hover:text-black hover:bg-red-50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-600`}
                    aria-label="Voir tous les avis sur Google"
                >
                    <span className="mr-2">Voir tous les avis sur</span>
                    <Image
                        src={google}
                        alt="Logo Google"
                        width={90}
                        height={24}
                        className="h-6"
                    />
                </a>
            </div>
        </section>
    );
};

export default GoogleReviews;
