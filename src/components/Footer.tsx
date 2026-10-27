"use client";
import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-100 text-sm">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-3">
          <h3 className="text-white font-semibold mb-3">Traduction en Arabe</h3>
          <p className="text-gray-200">Traductrice assermentée arabe-français à Dijon – Traduction certifiée près la Cour d'Appel de Dijon.</p>
        </div>
        <div className="lg:col-span-2">
          <h4 className="text-white font-semibold mb-3">Liens</h4>
          <ul className="space-y-2">
            <li><Link className="text-gray-200 hover:text-white transition-colors" href="/services">Services</Link></li>
            <li><Link className="text-gray-200 hover:text-white transition-colors" href="/blog">Blog</Link></li>
            <li><Link className="text-gray-200 hover:text-white transition-colors" href="/traduction-arabe-dijon">Traduction à Dijon</Link></li>
            <li><Link className="text-gray-200 hover:text-white transition-colors" href="/contact">Contact</Link></li>
          </ul>
        </div>
        {/* Bloc coordonnées unifié tel que recommandé pour le SEO local */}
        <div className="lg:col-span-5">
          <h4 className="text-white font-semibold mb-3">Aicha Salhi – Traductrice Assermentée Arabe</h4>
          <ul className="space-y-2 text-gray-200 text-sm leading-relaxed">
            <li>
              <span className="text-gray-300 font-semibold">• Bureau d'accueil (Sur RDV) :</span> Centre d'Affaires Regus Longvic, 8 Chemin De La Noue, 21600 Longvic
            </li>
            <li>
              <span className="text-gray-300 font-semibold">• Siège social :</span> 10 Avenue Jean Baptiste Greuze, 21000 Dijon
            </li>
            <li className="pt-1">
              <span className="text-gray-300 font-semibold">• Téléphone :</span> <a className="text-gray-200 hover:text-white transition-colors" href="tel:+33669151216">+33 6 69 15 12 16</a>
              {" "}| <span className="text-gray-300 font-semibold">Email :</span>{" "}
              <a className="text-gray-200 hover:text-white transition-colors" href="mailto:contact@traductionenarabe.fr">contact@traductionenarabe.fr</a>
            </li>
          </ul>
        </div>
        <div className="lg:col-span-2">
          <h4 className="text-white font-semibold mb-3">Suivez-nous</h4>
          <div className="flex gap-4">
            <a href="https://www.linkedin.com/in/aicha-salhi-1a7bb21a?trk" className="text-gray-200 hover:text-white transition-colors">LinkedIn</a>
            <a href="https://twitter.com/aicha-salhi" className="text-gray-200 hover:text-white transition-colors">Twitter</a>
            <a href="https://www.facebook.com/aicha.salhi.502256" className="text-gray-200 hover:text-white transition-colors">Facebook</a>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto py-6 px-6 sm:px-8 flex flex-col md:flex-row items-center justify-between text-gray-200 gap-4">
          <p className="text-center md:text-left">© 2025 Traduction en Arabe – Aicha Salhi</p>
          <div className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-2 text-xs sm:text-sm">
            <Link className="text-gray-200 hover:text-white transition-colors" href="/legal">Mentions légales</Link>
            <Link className="text-gray-200 hover:text-white transition-colors" href="/cgu">CGU</Link>
            <Link className="text-gray-200 hover:text-white transition-colors" href="/cookies">Cookies</Link>
            <Link className="text-gray-200 hover:text-white transition-colors" href="/securite-ssl">Sécurité & SSL</Link>
            <Link className="text-gray-200 hover:text-white transition-colors" href="/rgpd">RGPD & Confidentialité</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
