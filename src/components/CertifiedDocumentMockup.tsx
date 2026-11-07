"use client";
import React from "react";
import Image from "next/image";
import sealDocImg from "../assets/sceau_officiel_reel.jpg";

interface CertifiedDocumentMockupProps {
  className?: string;
}

const CertifiedDocumentMockup: React.FC<CertifiedDocumentMockupProps> = ({ className = "" }) => {
  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      {/* Cadre naturel et sobre de la photographie du document */}
      <div className="relative rounded-2xl overflow-hidden shadow-xl border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <Image
            src={sealDocImg}
            alt="Exemple de document avec tampon officiel et signature"
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 480px"
            priority
          />
        </div>
      </div>
      <p className="mt-3 text-center text-xs opacity-70">
        Exemple de document certifié avec sceau officiel et signature manuscrite.
      </p>
    </div>
  );
};

export default CertifiedDocumentMockup;
