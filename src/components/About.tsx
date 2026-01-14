"use client";
import React, { useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import Cookies from "js-cookie";
import Link from 'next/link';
import {
  FaUniversity,
  FaGlobeAfrica,
  FaHandshake,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaCheckCircle
} from 'react-icons/fa';

const APropos: React.FC = () => {
  const { isDarkMode, setDarkMode } = useTheme();

  useEffect(() => {
    const savedMode = Cookies.get('darkMode')
    if (savedMode) {
      setDarkMode(savedMode === 'true');
    }
  }, [setDarkMode]);

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-gray-950 text-gray-100" : "bg-gray-50 text-gray-900"} transition-colors duration-300`}>

      {/* Hero Section */}
      <div className={`py-16 ${isDarkMode ? "bg-gray-900" : "bg-white"} border-b ${isDarkMode ? "border-gray-800" : "border-gray-200"}`}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
            À Propos de <span className="text-red-600">Aicha Salhi</span>
          </h1>
          <p className={`text-xl ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            Traductrice-interprète assermentée près la Cour d'appel de Dijon
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16 space-y-16">

        {/* Bio Section */}
        <section className={`p-8 md:p-12 rounded-3xl shadow-xl border ${isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"} relative overflow-hidden`}>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-6">Mon Parcours</h2>
            <div className="space-y-6 text-lg leading-relaxed opacity-90">
              <p>
                Depuis 2017, j'accompagne particuliers, entreprises et institutions dans leurs besoins linguistiques, en garantissant des traductions précises et conformes aux exigences légales.
              </p>
              <p>
                <FaUniversity className="inline mr-2 text-red-600" />
                Titulaire d'un <strong>Master en traduction de l'Université de Strasbourg</strong>, je maîtrise plusieurs combinaisons linguistiques :
                <span className="font-semibold text-red-600 mx-1">Français ↔ Arabe</span>,
                <span className="font-semibold text-red-600 mx-1">Espagnol ↔ Arabe</span> et
                <span className="font-semibold text-red-600 mx-1">Anglais → Arabe</span>.
              </p>
              <p>
                Cette polyvalence me permet de répondre à une large gamme de demandes, qu'il s'agisse de documents juridiques, techniques, médicaux ou commerciaux.
              </p>
            </div>
          </div>
          {/* Decorative bg icon */}
          <FaGlobeAfrica className={`absolute -bottom-10 -right-10 text-9xl opacity-5 ${isDarkMode ? "text-white" : "text-black"}`} />
        </section>

        {/* Values Section */}
        <section>
          <h2 className="text-3xl font-bold mb-8 text-center">Mes Engagements</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: FaHandshake, title: "Confiance", desc: "Relation privilégiée avec chaque client." },
              { icon: FaCheckCircle, title: "Précision", desc: "Rigueur terminologique et respect du sens." },
              { icon: FaGlobeAfrica, title: "Expertise", desc: "Savoir-faire reconnu par la Cour d'appel." }
            ].map((item, idx) => (
              <div key={idx} className={`p-6 rounded-2xl text-center shadow-md border hover:shadow-lg transition-shadow ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
                <item.icon className="mx-auto text-4xl mb-4 text-red-600" />
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className={`opacity-80 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Coordonnées & Map split */}
        <section className="grid md:grid-cols-2 gap-8 items-stretch">

          {/* Contact Info Card */}
          <div className={`p-8 rounded-3xl shadow-lg border flex flex-col justify-center ${isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}>
            <h3 className="text-2xl font-bold mb-8">Coordonnées</h3>
            <ul className="space-y-6">
              <li className="flex items-start">
                <div className={`p-3 rounded-full mr-4 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400`}>
                  <FaMapMarkerAlt />
                </div>
                <div>
                  <span className="block text-sm font-semibold opacity-70 mb-1">Adresse</span>
                  <span className="text-lg">10 avenue Jean-Baptiste Greuze<br />21000 Dijon</span>
                </div>
              </li>
              <li className="flex items-center">
                <div className={`p-3 rounded-full mr-4 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400`}>
                  <FaPhoneAlt />
                </div>
                <div>
                  <span className="block text-sm font-semibold opacity-70 mb-1">Téléphone</span>
                  <a href="tel:+33669151216" className="text-lg hover:text-red-600 transition-colors">+33 6 69 15 12 16</a>
                </div>
              </li>
              <li className="flex items-center">
                <div className={`p-3 rounded-full mr-4 bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400`}>
                  <FaEnvelope />
                </div>
                <div>
                  <span className="block text-sm font-semibold opacity-70 mb-1">Email</span>
                  <Link href="/contact" className="text-lg hover:text-red-600 transition-colors">Contactez-moi</Link>
                </div>
              </li>
            </ul>
          </div>

          {/* Map Card */}
          <div className={`rounded-3xl shadow-lg border overflow-hidden ${isDarkMode ? "border-gray-800" : "border-gray-200"}`}>
            <iframe
              src={process.env.NEXT_PUBLIC_MAPS_URL || ""}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '300px' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Localisation de Aicha Salhi"
              className="grayscale hover:grayscale-0 transition-all duration-500 w-full h-full"
            ></iframe>
          </div>

        </section>

      </div>
    </div>
  );
};

export default APropos;
