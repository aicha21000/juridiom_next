"use client";
import React, { useEffect, useRef, useState, lazy, Suspense } from "react";
import { useTheme } from "../context/ThemeContext";
import Link from "next/link";
import Cookies from "js-cookie";
import { ensureEssentialConsent } from "../utils/cookieUtils";
import {
  FaArrowRight,
  FaFileContract,
  FaBriefcase,
  FaClock,
  FaShieldAlt,
  FaGavel,
  FaGraduationCap,
  FaCar,
  FaBalanceScale,
  FaScroll,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";

const GoogleReviews = lazy(() => import("./GoogleReviews"));
import CertifiedDocumentMockup from "./CertifiedDocumentMockup";

// Chargement différé propre pour la performance
function LazySection({ children, minHeight = 350 }: { children: React.ReactNode; minHeight?: number }) {
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
      { rootMargin: "150px 0px", threshold: 0.01 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref}>
      {isVisible ? (
        children
      ) : (
        <div style={{ minHeight }} className="animate-pulse bg-gray-100/60 dark:bg-gray-900/60 rounded-2xl" />
      )}
    </div>
  );
}

const Home = () => {
  const { isDarkMode, setDarkMode } = useTheme();

  const handleOrderClick = () => {
    ensureEssentialConsent();
  };

  useEffect(() => {
    const savedMode = Cookies.get("darkMode");
    if (savedMode) {
      setDarkMode(savedMode === "true");
    }
  }, [setDarkMode]);

  // Documents types pris en charge présentés avec sobriété
  const handledDocuments = [
    {
      icon: <FaScroll className="text-[#ba1728] text-xl" />,
      title: "Actes d'État Civil",
      desc: "Actes de naissance, mariage, décès, livrets de famille pour préfectures, mairies et démarches de nationalité.",
      link: "/services?doc=acte_naissance",
    },
    {
      icon: <FaCar className="text-[#ba1728] text-xl" />,
      title: "Permis de Conduire",
      desc: "Traduction officielle pour l'échange de permis étranger auprès de l'ANTS et des préfectures (forfait fixe).",
      link: "/services?doc=permis",
    },
    {
      icon: <FaBalanceScale className="text-[#ba1728] text-xl" />,
      title: "Casiers Judiciaires",
      desc: "Bulletins d'antécédents judiciaires pour dossiers de naturalisation, emploi ou formalités consulaires.",
      link: "/services?doc=casier",
    },
    {
      icon: <FaGraduationCap className="text-[#ba1728] text-xl" />,
      title: "Diplômes & Parcours Universitaire",
      desc: "Baccalauréat, relevés de notes, diplômes universitaires pour Campus France, universités et ordres professionnels.",
      link: "/services?doc=diplome",
    },
    {
      icon: <FaGavel className="text-[#ba1728] text-xl" />,
      title: "Décisions de Justice & Actes Notariés",
      desc: "Jugements de divorce, ordonnances, kafalas, actes de succession et procurations notariées.",
      link: "/services?doc=jugement_divorce",
    },
    {
      icon: <FaBriefcase className="text-[#ba1728] text-xl" />,
      title: "Documents Juridiques & d'Entreprise",
      desc: "Statuts de sociétés, extraits de registre de commerce, bilans, attestations et contrats commerciaux.",
      link: "/contact",
    },
  ];

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-gray-950 text-gray-100" : "bg-white text-gray-900"} transition-colors duration-300 font-sans`}>

      {/* ============================================================ */}
      {/* 1. HERO SECTION : Sobre, solennelle et digne                */}
      {/* ============================================================ */}
      <section className="relative pt-32 pb-20 lg:pt-44 lg:pb-28 border-b border-gray-100 dark:border-gray-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

          {/* Badge institutionnel discret */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#ba1728] bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 mb-6">
            <span>Experte Judiciaire • Cour d&apos;Appel de Dijon</span>
          </div>

          {/* Titre sobre et statut professionnel */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            Aicha Salhi <br />
            <span className="text-[#ba1728] text-2xl sm:text-4xl lg:text-5xl font-semibold">
              Traductrice Assermentée Arabe ⇄ Français
            </span>
          </h1>

          <p className="text-base sm:text-lg max-w-2xl mx-auto mb-8 opacity-80 leading-relaxed font-normal">
            Traductions certifiées conformes aux exigences des autorités françaises et étrangères.
            Prestation assurée en direct par une traductrice assermentée officielle, en toute confidentialité.
          </p>

          {/* Actions sobres sans racolage */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/services"
              onClick={handleOrderClick}
              className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 text-sm font-bold text-white bg-[#ba1728] hover:bg-[#a01322] rounded-xl shadow-sm transition-all duration-200 group"
            >
              <span>Établir une demande de traduction</span>
              <FaArrowRight className="ml-2 text-xs group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/contact"
              className={`w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 text-sm font-semibold rounded-xl border transition-all duration-200 ${
                isDarkMode
                  ? "border-gray-800 text-gray-300 hover:bg-gray-900"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              Contacter le cabinet
            </Link>
          </div>

          <p className="mt-4 text-xs text-gray-400">
            Cabinet à Dijon &amp; Longvic • Traitement à distance partout en France
          </p>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. BANDEAU DE RECEVABILITÉ ADMINISTRATIVE                     */}
      {/* ============================================================ */}
      <section className={`py-6 border-b text-xs ${isDarkMode ? "bg-gray-900/40 border-gray-900" : "bg-gray-50/80 border-gray-100"}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                Documents certifiés recevables auprès des institutions :
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 opacity-75 font-medium">
              <span>Préfectures &amp; ANTS</span>
              <span>•</span>
              <span>Mairies &amp; État civil</span>
              <span>•</span>
              <span>Tribunaux &amp; Notaires</span>
              <span>•</span>
              <span>Universités &amp; Écoles</span>
              <span>•</span>
              <span>Consulats &amp; Ambassades</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. DOMAINES D'INTERVENTION & DOCUMENTS PRIS EN CHARGE         */}
      {/* ============================================================ */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
              Actes &amp; Documents pris en charge
            </h2>
            <p className="text-sm opacity-75 leading-relaxed">
              Chaque traduction fait l&apos;objet d&apos;une étude rigoureuse et respecte strictement la terminologie juridique officielle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {handledDocuments.map((doc, idx) => (
              <div
                key={idx}
                className={`p-6 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                  isDarkMode
                    ? "bg-gray-900/60 border-gray-800 hover:border-gray-700"
                    : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-xs"
                }`}
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/40 flex items-center justify-center mb-4">
                    {doc.icon}
                  </div>
                  <h3 className="font-bold text-base mb-2">{doc.title}</h3>
                  <p className="text-xs opacity-75 leading-relaxed mb-6">
                    {doc.desc}
                  </p>
                </div>
                <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
                  <Link
                    href={doc.link}
                    className="text-xs font-semibold text-[#ba1728] hover:underline inline-flex items-center gap-1.5"
                  >
                    <span>Consulter les modalités</span>
                    <FaArrowRight className="text-[10px]" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/services"
              className="text-xs font-semibold text-gray-500 hover:text-[#ba1728] transition-colors underline"
            >
              Consulter le barème officiel et configurer votre commande →
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. VISUEL DU DOCUMENT OFFICIEL & MENTIONS LÉGALES             */}
      {/* ============================================================ */}
      <section className={`py-20 border-y ${isDarkMode ? "bg-gray-900/30 border-gray-900" : "bg-gray-50/70 border-gray-200"}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-[#ba1728] block mb-2">
              Authenticité Juridique
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
              Présentation de votre traduction certifiée
            </h2>
            <p className="text-sm opacity-75">
              Chaque acte traduit comporte toutes les mentions légales obligatoires requises par la justice et l&apos;administration française.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Colonne Gauche : Photographie réelle du document */}
            <div className="lg:col-span-5 flex justify-center">
              <CertifiedDocumentMockup />
            </div>

            {/* Colonne Droite : Les 4 critères de conformité */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className={`p-5 rounded-2xl border ${isDarkMode ? "bg-gray-900/80 border-gray-800" : "bg-white border-gray-200"}`}>
                <div className="font-bold text-sm mb-1 text-[#ba1728] flex items-center gap-2">
                  <span>🔴 Sceau Officiel</span>
                </div>
                <p className="text-xs opacity-75 leading-relaxed">
                  Cachet d&apos;encre officiel d&apos;experte judiciaire près la Cour d&apos;Appel de Dijon apposé sur chaque feuillet.
                </p>
              </div>

              <div className={`p-5 rounded-2xl border ${isDarkMode ? "bg-gray-900/80 border-gray-800" : "bg-white border-gray-200"}`}>
                <div className="font-bold text-sm mb-1 text-[#ba1728] flex items-center gap-2">
                  <span>🖋️ Signature Manuscrite</span>
                </div>
                <p className="text-xs opacity-75 leading-relaxed">
                  Signé personnellement par la traductrice assermentée, engageant sa responsabilité juridique officielle.
                </p>
              </div>

              <div className={`p-5 rounded-2xl border ${isDarkMode ? "bg-gray-900/80 border-gray-800" : "bg-white border-gray-200"}`}>
                <div className="font-bold text-sm mb-1 text-[#ba1728] flex items-center gap-2">
                  <span>📜 Mention Ne Varietur</span>
                </div>
                <p className="text-xs opacity-75 leading-relaxed">
                  Numéro unique d&apos;enregistrement au registre des traductions certifiées avec la formule légale d&apos;assermentation.
                </p>
              </div>

              <div className={`p-5 rounded-2xl border ${isDarkMode ? "bg-gray-900/80 border-gray-800" : "bg-white border-gray-200"}`}>
                <div className="font-bold text-sm mb-1 text-[#ba1728] flex items-center gap-2">
                  <span>📦 Délivrance Sécurisée</span>
                </div>
                <p className="text-xs opacity-75 leading-relaxed">
                  Exemplaire numérique PDF haute résolution envoyé par email et original papier officiel expédié par voie postale.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. PROCESSUS EN 3 ÉTAPES CLAIRES                             */}
      {/* ============================================================ */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
              Comment se déroule la traduction ?
            </h2>
            <p className="text-sm opacity-75">
              Un cheminement simple et rigoureux pour obtenir vos documents en toute sérénité.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center relative">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-bold text-lg flex items-center justify-center mb-4">
                1
              </div>
              <h3 className="font-bold text-sm mb-2">Transmission du document</h3>
              <p className="text-xs opacity-75 leading-relaxed">
                Transmettez vos scans ou photographies nettes depuis le formulaire en ligne ou par email.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-bold text-lg flex items-center justify-center mb-4">
                2
              </div>
              <h3 className="font-bold text-sm mb-2">Traduction &amp; Certification</h3>
              <p className="text-xs opacity-75 leading-relaxed">
                Traduction experte bilingue, vérification minutieuse, apposition du sceau et signature officielle.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-bold text-lg flex items-center justify-center mb-4">
                3
              </div>
              <h3 className="font-bold text-sm mb-2">Délivrance officielle</h3>
              <p className="text-xs opacity-75 leading-relaxed">
                Réception immédiate du PDF certifié par email et expédition de l&apos;original papier sous pli suivi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. REPÈRES INSTITUTIONNELS & CRÉDIBILITÉ                      */}
      {/* ============================================================ */}
      <section className={`py-12 border-y ${isDarkMode ? "bg-gray-900/50 border-gray-900" : "bg-gray-50 border-gray-200"}`}>
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-xl sm:text-2xl font-black text-[#ba1728] mb-1">Cour d&apos;Appel</div>
            <div className="text-xs text-gray-500">Experte Judiciaire Assermentée</div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-amber-600 mb-1">5.0 / 5 ★</div>
            <div className="text-xs text-gray-500">18 avis vérifiés Google</div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-emerald-600 mb-1">Double Format</div>
            <div className="text-xs text-gray-500">PDF Certifié &amp; Original Papier</div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-gray-700 dark:text-gray-300 mb-1">Arabe ⇄ Français</div>
            <div className="text-xs text-gray-500">Combinaison Linguistique Officielle</div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 7. AVIS GOOGLE VÉRIFIÉS                                      */}
      {/* ============================================================ */}
      <LazySection minHeight={400}>
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
                Avis &amp; Témoignages
              </h2>
              <p className="text-xs text-gray-500">
                Retours d&apos;expérience de clients ayant fait appel au cabinet
              </p>
            </div>

            <Suspense fallback={<div className="animate-pulse h-48 rounded-2xl bg-gray-100 dark:bg-gray-800" />}>
              <GoogleReviews />
            </Suspense>
          </div>
        </section>
      </LazySection>

      {/* ============================================================ */}
      {/* 8. CONCLUSION SOBRE & CONTACT DU CABINET                     */}
      {/* ============================================================ */}
      <section className={`py-16 border-t ${isDarkMode ? "bg-gray-900 border-gray-800" : "bg-gray-100/60 border-gray-200"}`}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Besoin d&apos;une traduction officielle pour vos démarches ?
          </h2>
          <p className="text-sm opacity-75 max-w-xl mx-auto mb-8 leading-relaxed">
            Consultez les tarifs forfaitaires, déposez vos documents en ligne ou contactez directement le cabinet pour un conseil personnalisé.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/services"
              className="w-full sm:w-auto px-8 py-3.5 bg-[#ba1728] hover:bg-[#a01322] text-white font-bold text-sm rounded-xl shadow-sm transition-colors"
            >
              Accéder au formulaire de commande
            </Link>
            <Link
              href="/contact"
              className={`w-full sm:w-auto px-8 py-3.5 rounded-xl border text-sm font-semibold transition-colors ${
                isDarkMode ? "border-gray-700 hover:bg-gray-800" : "border-gray-300 hover:bg-white"
              }`}
            >
              Prendre contact avec le cabinet
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-6 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <FaPhone className="text-[#8e8271]" />
              <a href="tel:+33669151216" className="hover:underline">+33 6 69 15 12 16</a>
            </span>
            <span className="flex items-center gap-1.5">
              <FaEnvelope className="text-[#8e8271]" />
              <a href="mailto:contact@traductionenarabe.fr" className="hover:underline">contact@traductionenarabe.fr</a>
            </span>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
