"use client";
import Link from 'next/link';
import React from 'react';

const Dijon: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <section className="relative overflow-hidden bg-gradient-to-br from-red-50 to-white dark:from-gray-900 dark:to-black py-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-red-600 mb-4">Traduction arabe à Dijon</h1>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Traductrice professionnelle à Dijon. Traductions certifiées, délais rapides, légalisation et remise des documents sécurisée.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link href="/services" className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700">Demander un devis</Link>
            <Link href="/contact" className="px-6 py-3 border-2 border-red-600 text-red-600 rounded-xl hover:bg-red-50">Contact</Link>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow">
          <h3 className="text-xl font-semibold text-red-600 mb-2">Assermentation</h3>
          <p className="text-gray-600 dark:text-gray-300">Traductions officielles acceptées par les autorités françaises.</p>
        </div>
        <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow">
          <h3 className="text-xl font-semibold text-red-600 mb-2">Délais rapides</h3>
          <p className="text-gray-600 dark:text-gray-300">Traitement prioritaire de vos documents à Dijon.</p>
        </div>
        <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow">
          <h3 className="text-xl font-semibold text-red-600 mb-2">Légalisation</h3>
          <p className="text-gray-600 dark:text-gray-300">Accompagnement pour apostille/légalisation si nécessaire.</p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-20">
        <h2 className="text-2xl font-bold mb-4">Coordonnées</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2 text-gray-700 dark:text-gray-300">
            <p><strong>Adresse:</strong> 4 Avenue Champollion, 21000 Dijon</p>
            <p><strong>Téléphone:</strong> <a href="tel:+33669151216" className="text-red-600">+33 6 69 15 12 16</a></p>
            <p><strong>Email:</strong> <a href="mailto:contact@traductionenarabe.fr" className="text-red-600">contact@traductionenarabe.fr</a></p>
          </div>
          <div>
            <iframe title="Localisation Dijon" className="w-full h-64 rounded-xl border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={process.env.NEXT_PUBLIC_MAPS_URL_DIJON || ""}></iframe>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dijon;
