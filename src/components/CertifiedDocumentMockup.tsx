"use client";
import React from "react";
import Image from "next/image";
import sealDocImg from "../assets/sceau_officiel_reel.jpg";

interface CertifiedDocumentMockupProps {
  className?: string;
}

const CertifiedDocumentMockup: React.FC<CertifiedDocumentMockupProps> = ({ className = "" }) => {
  return (
    <div className={`flex flex-col items-center w-full max-w-md mx-auto ${className}`}>
      {/* Cadre du document certifié officiel */}
      <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-all duration-300 hover:shadow-red-500/10">
        {/* Bandeau d'en-tête officiel */}
        <div className="px-4 py-2.5 bg-gradient-to-r from-red-800 via-red-700 to-red-900 text-white flex items-center justify-between text-xs font-bold tracking-wide">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>EXEMPLAIRE OFFICIEL CERTIFIÉ CONFORME</span>
          </div>
          <span className="text-[11px] opacity-90 font-medium">Cour d&apos;Appel</span>
        </div>

        {/* Visuel Réel du Document avec Sceau & Signature */}
        <div className="relative aspect-[4/3] w-full bg-gray-100 dark:bg-gray-900 overflow-hidden">
          <Image
            src={sealDocImg}
            alt="Exemplaire réel de traduction certifiée avec tampon officiel de la Cour d'Appel de Dijon et signature manuscrite"
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 480px"
            priority
          />
          {/* Badge officiel de certification en surimpression discrète */}
          <div className="absolute bottom-3 left-3 right-3 bg-black/60 backdrop-blur-md text-white text-[11px] px-3 py-1.5 rounded-lg flex items-center justify-between border border-white/20">
            <span className="flex items-center gap-1.5 font-medium">
              <span>⚖️</span>
              <span>Sceau officiel &amp; signature originaux</span>
            </span>
            <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">Ne Varietur</span>
          </div>
        </div>

        {/* Pied de carte avec garanties d'authenticité */}
        <div className="p-4 bg-gray-50 dark:bg-gray-900/80 border-t border-gray-100 dark:border-gray-800">
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
              <span className="text-emerald-500 font-bold">✓</span>
              <span>Tampon encreur officiel</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
              <span className="text-emerald-500 font-bold">✓</span>
              <span>Signature manuscrite</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
              <span className="text-emerald-500 font-bold">✓</span>
              <span>Numéro de répertoire unique</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
              <span className="text-emerald-500 font-bold">✓</span>
              <span>Valable à vie en France</span>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-3 text-center text-xs text-gray-500 dark:text-gray-400">
        Aperçu réel de votre document certifié conforme, reconnu par toutes les préfectures et ministères français.
      </p>
    </div>
  );
};

export default CertifiedDocumentMockup;
