import React from 'react';

const SSL: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-red-600 mb-6">Sécurité & SSL</h1>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Nous protégeons vos documents et données personnelles grâce à un chiffrement SSL/TLS (HTTPS) sur l'ensemble du site et aux bonnes pratiques de sécurité côté serveur et stockage.
        </p>
        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-2">Chiffrement en transit</h2>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
              <li>Certificat SSL actif (HTTPS) et HSTS recommandé.</li>
              <li>API appelée via HTTPS (standard pour Next.js).</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2">Stockage & accès</h2>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
              <li>Fichiers clients stockés de façon temporaire (nettoyage régulier).</li>
              <li>Accès restreints côté administration et suppression à la demande.</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2">Bonnes pratiques</h2>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
              <li>Sanitization des contenus, mots de passe hashés, vérification d'authentification.</li>
              <li>Mises à jour régulières et surveillance d'erreurs.</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SSL;
