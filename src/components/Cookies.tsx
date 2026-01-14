import React from 'react';

const Cookies: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-6">
        <h1 className="text-3xl font-bold text-red-600">Politique de cookies</h1>
        <section>
          <h2 className="text-xl font-semibold mb-2">Qu'est-ce qu'un cookie ?</h2>
          <p className="text-gray-700 dark:text-gray-300">Un cookie est un fichier texte stocké sur votre appareil pour améliorer votre expérience.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">Types de cookies utilisés</h2>
          <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
            <li><strong>Cookies essentiels :</strong> Fonctionnement du site (panier, session, authentification, thème). Créés automatiquement pour assurer le bon fonctionnement.</li>
            <li><strong>Cookies optionnels :</strong> Analytics, marketing, préférences avancées. Nécessitent votre consentement explicite.</li>
          </ul>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">Gestion du consentement</h2>
          <p className="text-gray-700 dark:text-gray-300">
            Les cookies essentiels sont créés automatiquement pour assurer le bon fonctionnement du site.
            Vous pouvez choisir d'accepter ou refuser les cookies optionnels via la bannière de cookies.
            Vos choix peuvent être modifiés à tout moment.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Cookies;
