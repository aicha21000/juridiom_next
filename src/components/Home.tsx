"use client";
import React, { useEffect, useRef, useState, lazy, Suspense } from "react";
import { useTheme } from "../context/ThemeContext";
import Link from "next/link";
import Image from "next/image";
import Cookies from "js-cookie";
import { ensureEssentialConsent } from "../utils/cookieUtils";
import {
  FaUserTie,
  FaClock,
  FaUserSecret,
  FaFileContract,
  FaBriefcase,
  FaArrowRight,
  FaCheckCircle,
  FaQuoteRight,
  FaTag
} from "react-icons/fa";

// Images imports remain the same
import CNI from "../assets/CNI_France.webp";
import jugement from "../assets/jugement_divorce.webp";
import casier from "../assets/casier.webp";
import certificat from "../assets/certificat_travail.webp";
import diplome from "../assets/diplome_tunisie.webp";
import passeport from "../assets/passeport_francais.webp";
import decompte from "../assets/decompte.webp";
import ordonnance from "../assets/ordonnance.webp";
import acteNaissance from "../assets/acte_naissance_maroc.webp";
import assurance from "../assets/attestation_assurance.webp";
import permis from "../assets/permis_conduire.webp";
import acteNaissanceLiban from "../assets/acte_naissance_liban.webp";

const GoogleReviews = lazy(() => import('./GoogleReviews'));
import CertifiedDocumentMockup from "./CertifiedDocumentMockup";

// Section paresseuse avec skeleton pour améliorer la FCP
function LazySection({ children, minHeight = 400 }: { children: React.ReactNode; minHeight?: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            io.disconnect();
          }
        });
      },
      { root: null, rootMargin: '200px 0px', threshold: 0.01 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref}>
      {isVisible ? (
        children
      ) : (
        <div style={{ minHeight }} className="animate-pulse bg-gradient-to-b from-gray-100 to-white dark:from-gray-800 dark:to-gray-900 rounded-xl" />
      )}
    </div>
  );
}

const Home = () => {
  const { isDarkMode, setDarkMode } = useTheme();
  const [isDesktop, setIsDesktop] = useState<boolean>(true);
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);

  const handleOrderClick = () => {
    ensureEssentialConsent();
  };

  useEffect(() => {
    const savedMode = Cookies.get("darkMode");
    if (savedMode) {
      setDarkMode(savedMode === "true");
    }
  }, [setDarkMode]);

  useEffect(() => {
    const mq = window.matchMedia && window.matchMedia('(min-width: 768px)');
    const update = () => setIsDesktop(!!(mq && mq.matches));
    update();
    if (mq && (mq as any).addEventListener) {
      (mq as any).addEventListener('change', update);
      return () => (mq as any).removeEventListener('change', update);
    } else if (mq && (mq as any).addListener) {
      (mq as any).addListener(update);
      return () => (mq as any).removeListener(update);
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            el.classList.add("visible");
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.15 }
    );

    sectionsRef.current.forEach((el) => {
      if (el) {
        if (!el.classList.contains("reveal")) el.classList.add("reveal");
        observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-gray-950 text-gray-100" : "bg-gray-50 text-gray-900"} transition-colors duration-300 font-sans`}>

      {/* Modern Hero Section */}
      <section
        ref={(el) => { sectionsRef.current[0] = el }}
        className="reveal relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          {/* Abstract Background Shapes */}
          <div className={`absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full blur-[120px] opacity-20 ${isDarkMode ? "bg-red-900" : "bg-red-200"} animate-pulse`} />
          <div className={`absolute top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full blur-[100px] opacity-20 ${isDarkMode ? "bg-blue-900" : "bg-blue-100"}`} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800">
              ✨ Traductrice Assermentée près la Cour d'Appel de Dijon
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-bold bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-300 dark:border-amber-700 shadow-sm">
              ⚡ Délai habituel : 24h à 48h
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            Traductrice Assermentée Arabe <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">à Dijon – Aicha Salhi</span>
          </h1>
          <h2 className={`text-2xl md:text-3xl font-medium mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            Vos traductions certifiées à Dijon et Longvic – Traductrice officielle sur la métropole dijonnaise
          </h2>
          <p className={`text-lg md:text-xl max-w-3xl mx-auto mb-4 leading-relaxed ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            Des traductions précises et reconnues pour vos documents officiels, juridiques et commerciaux.
            Délai habituel de 24 à 48 heures, confidentialité et excellence linguistique garanties.
          </p>
          <p className={`text-base max-w-3xl mx-auto mb-6 leading-relaxed ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>
            Mon bureau d'accueil principal est situé au Centre d'Affaires Regus à Longvic, idéalement positionné pour recevoir les clients de Dijon et de toute la métropole dijonnaise.
          </p>


          {/* Mention discrète des tarifs et dégressivité dans le Hero */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2 px-4 py-2 mb-8 rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200/80 dark:border-gray-800 shadow-xs text-xs sm:text-sm">
            <span className="inline-flex items-center gap-1 font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-0.5 rounded-full text-xs border border-emerald-200 dark:border-emerald-800">
              🚗 Permis &amp; ⚖️ Casier : 25 €
            </span>
            <span className="text-gray-300 dark:text-gray-700">•</span>
            <span className="text-gray-600 dark:text-gray-300 font-medium">Autres dès 30 €/p</span>
            <span className="text-gray-300 dark:text-gray-700">•</span>
            <span className="text-gray-500 dark:text-gray-400 text-xs">
              📉 Dégressif jusqu'à 20 €
            </span>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/services"
              onClick={handleOrderClick}
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-red-600 to-red-700 rounded-full shadow-lg hover:from-red-700 hover:to-red-800 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group"
            >
              Calculer mon devis gratuit
              <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/contact"
              className={`inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-full border-2 transition-all duration-300 ${isDarkMode ? "border-gray-700 text-gray-300 hover:bg-gray-800 hover:border-gray-600" : "border-gray-200 text-gray-700 hover:bg-white hover:border-gray-300 hover:shadow-md"}`}
            >
              Me contacter
            </Link>
          </div>
        </div>
      </section>

      {/* 🏛️ Bandeau d'administrations — Conformité institutionnelle */}
      <div className={`py-6 border-y ${isDarkMode ? "bg-gray-900/70 border-gray-800" : "bg-white border-gray-200"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 text-center lg:text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center text-lg font-extrabold flex-shrink-0">
                ✓
              </div>
              <div>
                <p className="font-extrabold text-sm sm:text-base">Traductions reconnues par les institutions françaises</p>
                <p className="text-xs opacity-70">Experte judiciaire inscrite près la Cour d&apos;Appel de Dijon – traductions certifiées conformes</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-semibold">
              <span className="px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700">🏛️ Préfectures &amp; ANTS</span>
              <span className="px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700">💍 Mairies (Mariage &amp; État civil)</span>
              <span className="px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700">🎓 Universités &amp; Campus France</span>
              <span className="px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700">🌍 Ambassades &amp; Consulats</span>
              <span className="px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700">⚖️ Tribunaux, Notaires, OFII</span>
            </div>
          </div>
        </div>
      </div>

      {/* 🎯 Grille des Documents Types (Identification immédiate) */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400 mb-3">
              Tarifs Forfaitaires Clairs
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
              Quel document souhaitez-vous faire traduire ?
            </h2>
            <p className="text-base opacity-75">
              Sélectionnez votre document pour une traduction certifiée conforme par une traductrice assermentée officielle.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Permis de conduire */}
            <div className={`p-6 rounded-2xl border transition-all duration-300 hover:shadow-xl relative flex flex-col justify-between ${isDarkMode ? "bg-gray-900 border-gray-800 hover:border-emerald-600" : "bg-white border-gray-200 hover:border-emerald-500"}`}>
              <span className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase bg-emerald-600 text-white shadow-sm">
                Forfait 25 €
              </span>
              <div>
                <div className="text-4xl mb-3">🚗</div>
                <h3 className="text-lg font-bold mb-1">Permis de Conduire</h3>
                <p className="text-xs opacity-70 mb-4">Pour l&apos;échange de permis étranger auprès de l&apos;ANTS et des préfectures.</p>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">25 €</span>
                <Link href="/services" className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1">
                  Commander en 1 clic →
                </Link>
              </div>
            </div>

            {/* Casier judiciaire */}
            <div className={`p-6 rounded-2xl border transition-all duration-300 hover:shadow-xl relative flex flex-col justify-between ${isDarkMode ? "bg-gray-900 border-gray-800 hover:border-emerald-600" : "bg-white border-gray-200 hover:border-emerald-500"}`}>
              <span className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase bg-emerald-600 text-white shadow-sm">
                Forfait 25 €
              </span>
              <div>
                <div className="text-4xl mb-3">⚖️</div>
                <h3 className="text-lg font-bold mb-1">Casier Judiciaire</h3>
                <p className="text-xs opacity-70 mb-4">Bulletin n°3 officiel pour naturalisation, emploi ou démarches consulaires.</p>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">25 €</span>
                <Link href="/services" className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1">
                  Commander en 1 clic →
                </Link>
              </div>
            </div>

            {/* Acte de naissance / État civil */}
            <div className={`p-6 rounded-2xl border transition-all duration-300 hover:shadow-xl flex flex-col justify-between ${isDarkMode ? "bg-gray-900 border-gray-800 hover:border-red-600" : "bg-white border-gray-200 hover:border-red-500"}`}>
              <div>
                <div className="text-4xl mb-3">📜</div>
                <h3 className="text-lg font-bold mb-1">Acte d&apos;État Civil</h3>
                <p className="text-xs opacity-70 mb-4">Acte de naissance, acte de mariage, certificat de célibat, livret de famille.</p>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                <div>
                  <span className="text-xs opacity-60 block">Dès</span>
                  <span className="text-2xl font-black text-red-600 dark:text-red-400">30 € <span className="text-xs font-normal">/ page</span></span>
                </div>
                <Link href="/services" className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1">
                  Calculer le devis →
                </Link>
              </div>
            </div>

            {/* Diplôme & Relevé de notes */}
            <div className={`p-6 rounded-2xl border transition-all duration-300 hover:shadow-xl flex flex-col justify-between ${isDarkMode ? "bg-gray-900 border-gray-800 hover:border-red-600" : "bg-white border-gray-200 hover:border-red-500"}`}>
              <div>
                <div className="text-4xl mb-3">🎓</div>
                <h3 className="text-lg font-bold mb-1">Diplôme &amp; Relevé de Notes</h3>
                <p className="text-xs opacity-70 mb-4">Pour Campus France, universités françaises, équivalences et ordres professionnels.</p>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                <div>
                  <span className="text-xs opacity-60 block">Dès</span>
                  <span className="text-2xl font-black text-red-600 dark:text-red-400">30 € <span className="text-xs font-normal">/ page</span></span>
                </div>
                <Link href="/services" className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1">
                  Calculer le devis →
                </Link>
              </div>
            </div>

            {/* Jugement de divorce */}
            <div className={`p-6 rounded-2xl border transition-all duration-300 hover:shadow-xl flex flex-col justify-between ${isDarkMode ? "bg-gray-900 border-gray-800 hover:border-red-600" : "bg-white border-gray-200 hover:border-red-500"}`}>
              <div>
                <div className="text-4xl mb-3">📑</div>
                <h3 className="text-lg font-bold mb-1">Jugement de Divorce &amp; Notarié</h3>
                <p className="text-xs opacity-70 mb-4">Décisions de justice, successions, actes de kafala, procurations notariées.</p>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                <div>
                  <span className="text-xs opacity-60 block">Tarif dégressif</span>
                  <span className="text-2xl font-black text-red-600 dark:text-red-400">dès 20 € <span className="text-xs font-normal">/ page</span></span>
                </div>
                <Link href="/services" className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1">
                  Calculer le devis →
                </Link>
              </div>
            </div>

            {/* Statuts & Entreprises */}
            <div className={`p-6 rounded-2xl border transition-all duration-300 hover:shadow-xl flex flex-col justify-between ${isDarkMode ? "bg-gray-900 border-gray-800 hover:border-red-600" : "bg-white border-gray-200 hover:border-red-500"}`}>
              <div>
                <div className="text-4xl mb-3">💼</div>
                <h3 className="text-lg font-bold mb-1">Contrats &amp; Documents Pro</h3>
                <p className="text-xs opacity-70 mb-4">Statuts de société, extraits Kbis, bilans, procurations et contrats commerciaux.</p>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                <div>
                  <span className="text-xs opacity-60 block">Volume</span>
                  <span className="text-lg font-black text-red-600 dark:text-red-400">Devis immédiat</span>
                </div>
                <Link href="/contact" className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1">
                  Demander un devis →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🔍 Résultat Final : À quoi ressemble votre traduction certifiée ? */}
      <section className={`py-20 border-y ${isDarkMode ? "bg-gray-900/40 border-gray-800" : "bg-gray-100/60 border-gray-200"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400 mb-3">
              Valeur Juridique &amp; Authenticité
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
              À quoi ressemble votre traduction certifiée conforme ?
            </h2>
            <p className="text-base opacity-75">
              Chaque traduction délivrée est un document officiel portant toutes les mentions obligatoires requises par les autorités françaises.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Colonne Gauche : Aperçu Réel du Document Certifié Officiel */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <CertifiedDocumentMockup />
            </div>

            {/* Colonne Droite : Les 4 piliers de conformité légale */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className={`p-5 rounded-2xl border ${isDarkMode ? "bg-gray-900 border-gray-800 hover:border-red-900/50" : "bg-white border-gray-200 hover:border-red-200"} shadow-sm transition-all duration-300`}>
                <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-600 flex items-center justify-center text-xl mb-3">
                  🔴
                </div>
                <h3 className="font-bold text-base mb-1.5 flex items-center gap-2">
                  <span>Sceau Officiel</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 font-bold">Cour d&apos;Appel</span>
                </h3>
                <p className="text-xs opacity-75 leading-relaxed">
                  Le cachet encreur officiel portant la mention d&apos;experte judiciaire près la Cour d&apos;Appel de Dijon est apposé sur chaque page du document.
                </p>
              </div>

              <div className={`p-5 rounded-2xl border ${isDarkMode ? "bg-gray-900 border-gray-800 hover:border-blue-900/50" : "bg-white border-gray-200 hover:border-blue-200"} shadow-sm transition-all duration-300`}>
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center text-xl mb-3">
                  🖋️
                </div>
                <h3 className="font-bold text-base mb-1.5 flex items-center gap-2">
                  <span>Signature Manuscrite</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-bold">Légale</span>
                </h3>
                <p className="text-xs opacity-75 leading-relaxed">
                  Chaque exemplaire est signé personnellement par le traducteur, engageant sa responsabilité juridique d&apos;expert assermenté.
                </p>
              </div>

              <div className={`p-5 rounded-2xl border ${isDarkMode ? "bg-gray-900 border-gray-800 hover:border-amber-900/50" : "bg-white border-gray-200 hover:border-amber-200"} shadow-sm transition-all duration-300`}>
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center text-xl mb-3">
                  🔢
                </div>
                <h3 className="font-bold text-base mb-1.5 flex items-center gap-2">
                  <span>Mention &ldquo;Ne Varietur&rdquo;</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 font-bold">Unique</span>
                </h3>
                <p className="text-xs opacity-75 leading-relaxed">
                  Numéro d&apos;enregistrement unique au répertoire des traductions officielles avec la formule légale de conformité avec l&apos;original.
                </p>
              </div>

              <div className={`p-5 rounded-2xl border ${isDarkMode ? "bg-gray-900 border-gray-800 hover:border-emerald-900/50" : "bg-white border-gray-200 hover:border-emerald-200"} shadow-sm transition-all duration-300`}>
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center text-xl mb-3">
                  📦
                </div>
                <h3 className="font-bold text-base mb-1.5 flex items-center gap-2">
                  <span>Double Format Délivré</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-bold">PDF + Papier</span>
                </h3>
                <p className="text-xs opacity-75 leading-relaxed">
                  Réception immédiate en <strong>PDF certifié haute définition</strong> par email + original papier envoyé par voie postale à domicile.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>





      {/* Expertise Section */}
      <LazySection>
        <section ref={(el) => { sectionsRef.current[1] = el }} className="reveal py-24 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                Pourquoi choisir votre traductrice assermentée à Dijon et Longvic ?
              </h2>
              <div className="w-24 h-1 bg-red-500 mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Carte 1 */}
              <div className={`p-8 rounded-2xl ${isDarkMode ? "bg-gray-900 border border-gray-800" : "bg-white border border-gray-100"} shadow-xl hover:shadow-2xl transition-all duration-300 group`}>
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 text-2xl ${isDarkMode ? "bg-red-900/20 text-red-500" : "bg-red-50 text-red-600"} group-hover:scale-110 transition-transform duration-300`}>
                  <FaUserTie />
                </div>
                <h3 className="text-xl font-bold mb-3">10+ Années d'Expertise</h3>
                <p className={`${isDarkMode ? "text-gray-400" : "text-gray-600"} leading-relaxed`}>
                  Une maîtrise parfaite des nuances linguistiques et des terminologies juridiques complexes, acquise au fil d'une décennie de pratique.
                </p>
              </div>

              {/* Carte 2 */}
              <div className={`p-8 rounded-2xl ${isDarkMode ? "bg-gray-900 border border-gray-800" : "bg-white border border-gray-100"} shadow-xl hover:shadow-2xl transition-all duration-300 group`}>
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 text-2xl ${isDarkMode ? "bg-blue-900/20 text-blue-500" : "bg-blue-50 text-blue-600"} group-hover:scale-110 transition-transform duration-300`}>
                  <FaClock />
                </div>
                <h3 className="text-xl font-bold mb-3">Rapidité & Échéances</h3>
                <p className={`${isDarkMode ? "text-gray-400" : "text-gray-600"} leading-relaxed`}>
                  Vos délais sont sacrés. Nous nous engageons à livrer vos traductions dans les temps impartis, sans jamais compromettre la qualité.
                </p>
              </div>

              {/* Carte 3 */}
              <div className={`p-8 rounded-2xl ${isDarkMode ? "bg-gray-900 border border-gray-800" : "bg-white border border-gray-100"} shadow-xl hover:shadow-2xl transition-all duration-300 group`}>
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 text-2xl ${isDarkMode ? "bg-emerald-900/20 text-emerald-500" : "bg-emerald-50 text-emerald-600"} group-hover:scale-110 transition-transform duration-300`}>
                  <FaUserSecret />
                </div>
                <h3 className="text-xl font-bold mb-3">Confidentialité Absolue</h3>
                <p className={`${isDarkMode ? "text-gray-400" : "text-gray-600"} leading-relaxed`}>
                  Vos documents sont traités avec la plus stricte confidentialité. Nous mettons un point d'honneur à protéger vos données personnelles.
                </p>
              </div>
            </div>
          </div>
        </section>
      </LazySection>

      {/* Services Section */}
      <LazySection>
        <section ref={(el) => { sectionsRef.current[2] = el }} className={`reveal py-24 ${isDarkMode ? "bg-gray-900" : "bg-gray-100"}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  Des Services de Traduction sur la Métropole de Dijon
                </h2>
                <p className={`text-lg mb-8 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                  Que vous soyez un particulier ou une entreprise à Dijon, Longvic ou partout en France, nous proposons une gamme complète de services de traduction certifiée pour répondre à toutes vos exigences.
                </p>

                <div className="space-y-6">
                  <div className={`p-6 rounded-xl border-l-4 border-red-500 ${isDarkMode ? "bg-gray-800" : "bg-white"} shadow-md`}>
                    <div className="flex items-start">
                      <FaFileContract className="text-2xl text-red-500 mt-1 mr-4" />
                      <div>
                        <h3 className="text-xl font-bold mb-2">Traductions Juridiques</h3>
                        <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                          Contrats, actes notariés, jugements, documents d'état civil...
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className={`p-6 rounded-xl border-l-4 border-blue-500 ${isDarkMode ? "bg-gray-800" : "bg-white"} shadow-md`}>
                    <div className="flex items-start">
                      <FaBriefcase className="text-2xl text-blue-500 mt-1 mr-4" />
                      <div>
                        <h3 className="text-xl font-bold mb-2">Traductions Commerciales</h3>
                        <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                          Sites web, marketing, rapports, présentations d'entreprise...
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-10">
                  <Link href="/services" className="text-red-600 font-semibold hover:text-red-700 flex items-center">
                    Voir tous nos services <FaArrowRight className="ml-2" />
                  </Link>
                </div>
              </div>

              {/* Simple Process Visualization */}
              <div className={`relative p-8 rounded-3xl ${isDarkMode ? "bg-gray-800/50" : "bg-white"} shadow-2xl`}>
                <h3 className="text-2xl font-bold mb-8 text-center">Processus Simple en 3 Étapes</h3>
                <div className="space-y-8 relative">
                  {/* Connecting Line */}
                  <div className={`absolute left-8 top-8 bottom-8 w-0.5 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}></div>

                  <div className="relative pl-20 transition-transform transform hover:translate-x-2 duration-300">
                    <div className="absolute left-0 w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 flex items-center justify-center font-bold text-xl border-4 border-white dark:border-gray-800 z-10">1</div>
                    <h4 className="text-lg font-bold">Devis & Commande</h4>
                    <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}><strong>Pas de scanner ? Une photo smartphone nette suffit !</strong> Téléchargez vos fichiers ou envoyez-les directement par WhatsApp.</p>
                  </div>

                  <div className="relative pl-20 transition-transform transform hover:translate-x-2 duration-300">
                    <div className="absolute left-0 w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center font-bold text-xl border-4 border-white dark:border-gray-800 z-10">2</div>
                    <h4 className="text-lg font-bold">Traduction & Validation</h4>
                    <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Traduction experte, relecture et validation qualité.</p>
                  </div>

                  <div className="relative pl-20 transition-transform transform hover:translate-x-2 duration-300">
                    <div className="absolute left-0 w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center font-bold text-xl border-4 border-white dark:border-gray-800 z-10">3</div>
                    <h4 className="text-lg font-bold">Livraison Rapide</h4>
                    <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Réception en <strong>PDF certifié haute définition</strong> par email + exemplaire original papier officiel envoyé par courrier postal.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </LazySection>

      {/* Stats Section */}
      <div className={`py-12 border-y ${isDarkMode ? "bg-gray-950 border-gray-800" : "bg-white border-gray-100"}`}>
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-extrabold text-red-600 mb-2">100%</div>
            <div className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Clients Satisfaits</div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-blue-600 mb-2">500+</div>
            <div className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Projets Réalisés</div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-emerald-600 mb-2">24h</div>
            <div className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Délais Moyens</div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-purple-600 mb-2">10+</div>
            <div className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Années d'Expérience</div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <LazySection minHeight={500}>
        <section ref={(el) => { sectionsRef.current[3] = el }} className="reveal py-24 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className={`text-3xl font-bold text-center mb-16 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Ce que disent nos clients
            </h2>

            <Suspense fallback={<div className="animate-pulse h-64 rounded-xl bg-gray-100 dark:bg-gray-800" />}>
              <GoogleReviews />
            </Suspense>
          </div>
        </section>
      </LazySection>

      {/* Document Gallery */}
      {(
        <LazySection>
          <section ref={(el) => { sectionsRef.current[4] = el }} className={`reveal py-24 ${isDarkMode ? "bg-gray-900" : "bg-gray-100"}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className={`text-3xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>Exemples de Réalisations</h2>
                <p className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Aperçu de documents types que nous traduisons quotidiennement</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { img: CNI, title: "Carte d'Identité" },
                  { img: jugement, title: "Jugement de Divorce" },
                  { img: casier, title: "Casier Judiciaire" },
                  { img: diplome, title: "Diplôme Universitaire" },
                  { img: passeport, title: "Passeport" },
                  { img: acteNaissance, title: "Acte de Naissance" },
                ].map((doc, idx) => (
                  <div key={idx} className="group relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                    <div className="aspect-[4/3] relative">
                      <Image
                        src={doc.img}
                        alt={`Traduction ${doc.title}`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 300px"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <span className="text-white font-bold text-lg border-2 border-white px-4 py-2 rounded-full backdrop-blur-sm">
                          {doc.title}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center mt-12">
                <p className={`text-sm italic ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>Et bien d'autres documents : permis, factures, certificats...</p>
              </div>
            </div>
          </section>
        </LazySection>
      )}


      {/* Promotional Pricing Banner / Coin Pub */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-8 relative z-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-600 via-red-700 to-amber-700 text-white shadow-2xl p-8 md:p-12">
          {/* Decorative background glow */}
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-10 -top-10 w-64 h-64 bg-red-400/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left max-w-2xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400 text-red-950 font-extrabold text-xs uppercase tracking-wider rounded-full mb-4 shadow-sm">
                <FaTag /> Offre Tarif Dégressif
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-3">
                Plus vous traduisez, moins vous payez !
              </h2>
              <p className="text-red-100 text-base sm:text-lg mb-6 leading-relaxed">
                Traductions certifiées conformes par une <strong>traductrice assermentée</strong> près la Cour d'Appel. <strong>Traduction réalisée en 24 heures</strong>. Profitez de nos tarifs avantageux (dont <strong>forfait spécial à 25 € pour le permis de conduire et le casier judiciaire</strong>) :
              </p>

              {/* Price Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex flex-col justify-between">
                  <span className="text-xs uppercase font-semibold text-red-200">1 à 2 pages</span>
                  <div className="text-2xl font-extrabold mt-1">30 € <span className="text-xs font-normal text-red-200">/ page</span></div>
                </div>
                <div className="bg-white/20 backdrop-blur-md border border-amber-300/40 rounded-2xl p-4 flex flex-col justify-between relative shadow-lg">
                  <span className="absolute -top-3 right-3 bg-amber-400 text-red-950 font-bold text-[10px] px-2 py-0.5 rounded-full uppercase">Populaire</span>
                  <span className="text-xs uppercase font-semibold text-amber-200">À partir de 3 pages</span>
                  <div className="text-2xl font-extrabold mt-1 text-amber-300">25 € <span className="text-xs font-normal text-amber-100">/ page</span></div>
                </div>
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex flex-col justify-between">
                  <span className="text-xs uppercase font-semibold text-red-200">À partir de 10 pages</span>
                  <div className="text-2xl font-extrabold mt-1 text-emerald-300">20 € <span className="text-xs font-normal text-red-200">/ page</span></div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center shrink-0 w-full lg:w-auto">
              <Link
                href="/services"
                onClick={handleOrderClick}
                className="w-full sm:w-auto text-center px-8 py-4 bg-amber-400 hover:bg-amber-300 text-red-950 font-extrabold text-lg rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3"
              >
                <span>Calculer mon devis</span>
                <FaArrowRight />
              </Link>
              <span className="text-xs text-red-200 mt-3 text-center">✨ Estimation et commande immédiate</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <LazySection>
        <section ref={(el) => { sectionsRef.current[5] = el }} className="reveal py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-red-800 opacity-90 z-0"></div>
          {/* Pattern Overlay */}
          <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>

          <div className="relative z-10 max-w-5xl mx-auto px-4 text-center text-white">
            <h2 className="text-4xl font-bold mb-6">Prêt à lancer votre projet de traduction ?</h2>
            <p className="text-xl mb-10 text-red-100 max-w-2xl mx-auto">
              Obtenez un devis gratuit en quelques minutes et bénéficiez d'une traduction rapide et professionnelle.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link href="/contact" className="px-10 py-5 bg-white text-red-700 font-bold rounded-full shadow-lg hover:bg-gray-100 transform hover:-translate-y-1 transition-all duration-300">
                Demander un devis
              </Link>
              <Link href="/services" onClick={handleOrderClick} className="px-10 py-5 bg-red-900/40 border-2 border-white/30 backdrop-blur-sm text-white font-bold rounded-full hover:bg-red-900/60 transition-all duration-300">
                Voir les tarifs
              </Link>
            </div>
          </div>
        </section>
      </LazySection>

    </div>
  );
};

export default Home;
