"use client";
import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-100 text-sm">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <h3 className="text-white font-semibold mb-3">Traduction en Arabe</h3>
          <p className="text-gray-200">Traductrice professionnelle à Dijon – Traduction certifiée.</p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Liens</h4>
          <ul className="space-y-2">
            <li><Link className="text-gray-200 hover:text-white transition-colors" href="/services">Services</Link></li>
            <li><Link className="text-gray-200 hover:text-white transition-colors" href="/blog">Blog</Link></li>
            <li><Link className="text-gray-200 hover:text-white transition-colors" href="/traduction-arabe-dijon">Traduction à Dijon</Link></li>
            <li><Link className="text-gray-200 hover:text-white transition-colors" href="/contact">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Coordonnées</h4>
          <ul className="space-y-2 text-gray-200">
            <li>10 avenue Jean-Baptiste Greuze, 21000 Dijon</li>
            <li><a className="text-gray-200 hover:text-white transition-colors" href="tel:+33669151216">+33 6 69 15 12 16</a></li>
            <li><a className="text-gray-200 hover:text-white transition-colors" href="mailto:contact@traductionenarabe.fr">contact@traductionenarabe.fr</a></li>
          </ul>
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
