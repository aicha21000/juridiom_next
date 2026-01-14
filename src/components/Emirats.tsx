"use client";
import React, { useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import Image from "next/image";
import uae from '../assets/UAE.webp';
import administratif from '../assets/administratif.webp';
import entreprise from '../assets/entreprise.webp';
import facture from '../assets/facture.webp';
import Link from "next/link";
import Cookies from "js-cookie";

const LegalisationService = () => {
  const { isDarkMode, setDarkMode } = useTheme();

  useEffect(() => {
    const savedMode = Cookies.get("darkMode");
    if (savedMode) {
      setDarkMode(savedMode === "true");
    }
  }, [setDarkMode]);

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"} px-6`}>
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Section d'introduction */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-500">
            Simplifiez vos démarches de légalisation pour les Émirats Arabes Unis
          </h1>
          <p className={`text-lg mt-4 max-w-2xl mx-auto ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
            Notre service complet prend en charge la traduction et la légalisation de vos documents officiels, vous évitant ainsi les déplacements et les démarches complexes.
          </p>
          <div className="mt-8">
            <Image src={uae} alt="Drapeau des Émirats arabes unis" className="mx-auto w-32" />
          </div>
        </div>

        <div className="mt-16">
          <h2 className={`text-3xl font-semibold text-center ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>
            Notre Processus en 4 Étapes Simples
          </h2>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">

            <div className={`bg-${isDarkMode ? 'gray-800' : 'white'} p-6 rounded-lg shadow-lg text-center`}>
              <div className="h-24 w-24 mx-auto mb-4 flex items-center justify-center bg-red-500 text-white text-3xl font-bold rounded-full">
                1
              </div>
              <h3 className="text-xl font-semibold text-red-500">Traduction</h3>
              <p className={`text-sm mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-700"}`}>
                Traduction certifiée de vos documents administratifs, comme passeports, actes de naissance, actes de mariage, effectuée par un traducteur assermenté.
              </p>
            </div>

            <div className={`bg-${isDarkMode ? 'gray-800' : 'white'} p-6 rounded-lg shadow-lg text-center`}>
              <div className="h-24 w-24 mx-auto mb-4 flex items-center justify-center bg-red-500 text-white text-3xl font-bold rounded-full">
                2
              </div>
              <h3 className="text-xl font-semibold text-red-500">Légalisation Mairie</h3>
              <p className={`text-sm mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-700"}`}>
                Authentification de vos documents auprès de la Mairie compétente pour garantir leur validité officielle.
              </p>
            </div>

            <div className={`bg-${isDarkMode ? 'gray-800' : 'white'} p-6 rounded-lg shadow-lg text-center`}>
              <div className="h-24 w-24 mx-auto mb-4 flex items-center justify-center bg-red-500 text-white text-3xl font-bold rounded-full">
                3
              </div>
              <h3 className="text-xl font-semibold text-red-500">Légalisation Ministère</h3>
              <p className={`text-sm mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-700"}`}>
                Validation de l'authenticité de vos documents par le Ministère des Affaires Étrangères français.
              </p>
            </div>

            <div className={`bg-${isDarkMode ? 'gray-800' : 'white'} p-6 rounded-lg shadow-lg text-center`}>
              <div className="h-24 w-24 mx-auto mb-4 flex items-center justify-center bg-red-500 text-white text-3xl font-bold rounded-full">
                4
              </div>
              <h3 className="text-xl font-semibold text-red-500">Légalisation Ambassade</h3>
              <p className={`text-sm mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-700"}`}>
                Finalisation de la procédure avec la légalisation de vos documents auprès de l'Ambassade des Émirats Arabes Unis.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <h2 className={`text-3xl font-semibold text-center ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>
            Nos Tarifs Clairs et Transparents
          </h2>
          <p className={`text-lg mt-4 text-center ${isDarkMode ? "text-gray-400" : "text-gray-700"}`}>
            Découvrez nos tarifs pour chaque service. Voici quelques exemples des coûts associés à nos services de traduction et de légalisation.
          </p>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">

            <div className={`bg-${isDarkMode ? 'gray-800' : 'white'} p-6 rounded-lg shadow-lg text-center`}>
              <h3 className="text-xl font-semibold text-red-500 h-[50px]">Documents Administratifs</h3>
              <div className="mt-4">
                <Image
                  src={administratif}
                  alt="Document Passeport"
                  className="mx-auto w-32"
                />
              </div>
              <p className={`text-lg mt-4 ${isDarkMode ? "text-gray-400" : "text-gray-700"}`}>Traduction: <strong>30,00 €</strong></p>
              <p className={`text-lg mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-700"}`}>Légalisation Mairie: <strong>20,00 €</strong></p>
              <p className={`text-lg mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-700"}`}>Légalisation Ministère: <strong>50,00 €</strong></p>
              <p className={`text-lg mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-700"}`}>Légalisation Ambassade: <strong>80,00 €</strong></p>
            </div>

            <div className={`bg-${isDarkMode ? 'gray-800' : 'white'} p-6 rounded-lg shadow-lg text-center`}>
              <h3 className="text-xl font-semibold text-red-500 h-[50px]">Documents Commerciaux</h3>
              <div className="mt-4">
                <Image
                  src={entreprise}
                  alt="Document entreprise"
                  className="mx-auto w-32 rounded-xl"
                />
              </div>
              <p className={`text-lg mt-4 ${isDarkMode ? "text-gray-400" : "text-gray-700"}`}>Traduction: <strong>30,00 €</strong></p>
              <p className={`text-lg mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-700"}`}>Légalisation Mairie: <strong>30,00 €</strong></p>
              <p className={`text-lg mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-700"}`}>Légalisation Ministère: <strong>60,00 €</strong></p>
              <p className={`text-lg mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-700"}`}>Légalisation Ambassade: <strong>650,00 €</strong></p>
            </div>

            <div className={`bg-${isDarkMode ? 'gray-800' : 'white'} p-6 rounded-lg shadow-lg text-center`}>
              <h3 className="text-xl font-semibold text-red-500 h-[50px]">Factures</h3>
              <div className="mt-4">
                <Image
                  src={facture}
                  alt="Facture"
                  className="mx-auto w-32 rounded-xl"
                />
              </div>
              <p className={`text-lg mt-4 ${isDarkMode ? "text-gray-400" : "text-gray-700"}`}>Traduction: <strong>15,00 €</strong></p>
              <p className={`text-lg mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-700"}`}>Légalisation Mairie: <strong>25,00 €</strong></p>
              <p className={`text-lg mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-700"}`}>Légalisation Ministère: <strong>50,00 €</strong></p>
              <p className={`text-lg mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-700"}`}>Légalisation Ambassade: <strong>80,00 €</strong></p>
            </div>
          </div>

          <div className="mt-16">
            <h2 className={`text-3xl font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Nous Contacter</h2>
            <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-800'} mt-4`}>
              Commencez votre projet aujourd'hui et obtenez un devis.
            </p>
            <button className="mt-6 px-6 py-3 bg-red-600 text-white rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 hover:bg-red-700">
              <Link href="/devis" className="block w-full h-full text-center">
                Obtenez un devis maintenant
              </Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalisationService;
