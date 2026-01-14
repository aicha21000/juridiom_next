import React from 'react';

const CGU: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-6">
        <h1 className="text-3xl font-bold text-red-600">Conditions Générales d'Utilisation</h1>
        <section>
          <h2 className="text-xl font-semibold mb-2">Objet</h2>
          <p className="text-gray-700 dark:text-gray-300">Les présentes CGU encadrent l'utilisation du site et des services de traduction proposés.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">Accès au service</h2>
          <p className="text-gray-700 dark:text-gray-300">Le site est accessible 7j/7 dans la mesure du possible. Des interruptions peuvent survenir pour maintenance.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">Responsabilités</h2>
          <p className="text-gray-700 dark:text-gray-300">Vous êtes responsable des contenus transmis. Nous mettons en œuvre les moyens raisonnables pour assurer la qualité du service.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">Propriété intellectuelle</h2>
          <p className="text-gray-700 dark:text-gray-300">Les contenus et marques sont protégés. Toute reproduction non autorisée est interdite.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">Droit applicable</h2>
          <p className="text-gray-700 dark:text-gray-300">Droit français. Tribunal compétent de Dijon en cas de litige.</p>
        </section>
      </div>
    </div>
  );
};

export default CGU;
