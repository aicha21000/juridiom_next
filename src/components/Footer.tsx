"use client";
import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-100 text-sm">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
        <div>
          <h3 className="text-white font-semibold mb-3">Traduction en Arabe</h3>
          <p className="text-gray-200">Traductrice assermentée arabe-français à Dijon – Traduction certifiée près la Cour d'Appel de Dijon.</p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Liens</h4>
          <ul className="space-y-2">
            <li><Link className="text-gray-200 hover:text-white transition-colors" href="/services">Services</Link></li>
            <li><Link className="text-gray-200 hover:text-white transition-colors" href="/traducteur-assermente-dijon">Traduction à Dijon</Link></li>
            <li><Link className="text-gray-200 hover:text-white transition-colors" href="/traducteur-assermente-longvic">Bureau de Longvic</Link></li>
            <li><Link className="text-gray-200 hover:text-white transition-colors" href="/blog">Blog</Link></li>
            <li><Link className="text-gray-200 hover:text-white transition-colors" href="/contact">Contact</Link></li>
          </ul>
        </div>
        {/* Bloc 1 séparé : Bureau d'accueil */}
        <div>
          <h4 className="text-white font-semibold mb-3">Bureau d'accueil (Sur RDV)</h4>
          <p className="text-gray-200 leading-relaxed text-sm">
            Centre d'Affaires Regus Longvic<br />
            8 Chemin De La Noue<br />
            21600 Longvic<br />
            <span className="text-gray-400 text-xs italic">Réception &amp; dépôt de vos documents officiels</span>
          </p>
          <div className="mt-2 text-sm">
            <Link href="/traducteur-assermente-longvic" className="text-red-400 hover:text-red-300 text-xs font-semibold block mb-2">
              Page dédiée Longvic →
            </Link>
            <a className="text-gray-200 hover:text-white transition-colors block" href="tel:+33669151216">+33 6 69 15 12 16</a>
            <a className="text-gray-200 hover:text-white transition-colors block" href="mailto:contact@traductionenarabe.fr">contact@traductionenarabe.fr</a>
          </div>
        </div>
        {/* Bloc 2 séparé : Siège social */}
        <div>
          <h4 className="text-white font-semibold mb-3">Siège social</h4>
          <p className="text-gray-200 leading-relaxed text-sm">
            10 Avenue Jean Baptiste Greuze<br />
            21000 Dijon<br />
            <span className="text-gray-400 text-xs italic">Siège administratif – Dépôt de documents possible</span>
          </p>
          <Link href="/traducteur-assermente-dijon" className="text-red-400 hover:text-red-300 text-xs font-semibold block mt-2">
            Page dédiée Dijon →
          </Link>
        </div>
        <div>
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
