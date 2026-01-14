"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Cookies from 'js-cookie';

const CookieBanner: React.FC = () => {
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        const cookieConsent = Cookies.get('cookieConsent');
        // Si aucun consentement, créer automatiquement le consentement pour les cookies essentiels
        if (!cookieConsent) {
            Cookies.set('cookieConsent', 'essential', { expires: 365 });
        }

        // Afficher la bannière seulement si l'utilisateur n'a pas encore choisi pour les cookies non essentiels
        if (cookieConsent !== 'all') {
            setShowBanner(true);
        }
    }, []);

    const handleAcceptNonEssential = () => {
        Cookies.set('cookieConsent', 'all', { expires: 365 });
        setShowBanner(false);
    };

    if (!showBanner) return null;

    return (
        <div
            className="fixed bottom-0 left-0 right-0 bg-gray-900/95 text-white z-50 border-t border-gray-700"
            role="region"
            aria-label="Bannière de consentement aux cookies"
        >
            <div className="max-w-7xl mx-auto px-3 py-2 flex items-center justify-between gap-3">
                <p className="m-0 text-xs leading-snug text-gray-200">
                    Cookies essentiels (panier, connexion) déjà actifs. Cliquez sur OK pour activer les cookies optionnels.
                    <Link href="/cookies" className="ml-2 underline text-gray-300 hover:text-white">En savoir plus</Link>
                </p>
                <button
                    onClick={handleAcceptNonEssential}
                    className="shrink-0 underline text-gray-300 hover:text-white px-2 py-1 rounded text-xs"
                    aria-label="Accepter les cookies optionnels"
                >
                    OK
                </button>
            </div>
        </div>
    );
};

export default CookieBanner; 