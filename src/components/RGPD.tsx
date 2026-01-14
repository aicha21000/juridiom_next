import React from 'react';

const RGPD: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-red-600 mb-6">RGPD & Confidentialité</h1>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Cette politique explique comment nous traitons vos données conformément au RGPD.
        </p>
        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-2">Responsable du traitement</h2>
            <p className="text-gray-700 dark:text-gray-300">Traduction en Arabe – Aicha Salhi, 4 bis Avenue Champollion, 21000 Dijon.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2">Finalités et base légale</h2>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
              <li>Gestion des demandes de devis et des prestations (exécution d'un contrat).</li>
              <li>Facturation et obligations légales (obligations légales).</li>
              <li>Communication client (intérêt légitime).</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2">Durées de conservation</h2>
            <p className="text-gray-700 dark:text-gray-300">Données de contact: 3 ans. Pièces et documents: durée nécessaire à la prestation puis suppression.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2">Vos droits</h2>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
              <li>Accès, rectification, effacement, limitation, opposition, portabilité.</li>
              <li>Contact: <a href="mailto:contact@traductionenarabe.fr" className="text-red-600">contact@traductionenarabe.fr</a></li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2">Cookies</h2>
            <p className="text-gray-700 dark:text-gray-300">Bandeau de consentement, cookies nécessaires au fonctionnement et mesure d'audience anonymisée.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default RGPD;
