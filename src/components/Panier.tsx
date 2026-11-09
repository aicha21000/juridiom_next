"use client";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useTheme } from "../context/ThemeContext";
import useScrollToTop from "../hooks/useScrollToTop";
import { ensureEssentialConsent } from "../utils/cookieUtils";
import {
  calculateOrderPrice,
  formatEuros,
  DetailedPriceBreakdown,
  DOCUMENT_TYPES,
} from "../utils/pricing";
import {
  FaLock,
  FaShieldAlt,
  FaCheckCircle,
  FaGavel,
  FaPhone,
  FaArrowLeft,
  FaFileAlt,
  FaTrashAlt,
  FaEdit,
  FaEnvelope,
  FaTruck,
  FaClock,
  FaStamp,
  FaInfoCircle,
} from "react-icons/fa";

interface CartItem {
  numberOfPages: number;
  numberOfDocuments: number;
  deliveryMethod: string;
  mailClient: string;
  legalization: string;
  totalPrice: number;
  comment?: string;
  files?: Array<{
    name: string;
    url: string;
    path: string;
  }>;
  sessionId?: string;
  documentType?: string;
  urgency?: string;
}

export default function Panier() {
  useScrollToTop();
  const { isDarkMode } = useTheme();
  const router = useRouter();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isPlacingOrder, setIsPlacingOrder] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    ensureEssentialConsent();

    const loadCart = () => {
      const cookieCart = Cookies.get("cart");
      const localStorageCart = localStorage.getItem("cart");
      let cartData = null;

      if (cookieCart) {
        try {
          cartData = JSON.parse(cookieCart);
        } catch (e) {
          console.error("Erreur parsing cookie cart", e);
        }
      }
      if (!cartData && localStorageCart) {
        try {
          cartData = JSON.parse(localStorageCart);
        } catch (e) {
          console.error("Erreur parsing localStorage cart", e);
        }
      }

      if (cartData && Array.isArray(cartData) && cartData.length > 0) {
        setCart(cartData);
      } else {
        setCart([]);
      }
    };

    loadCart();
  }, []);

  const clearCart = () => {
    setCart([]);
    Cookies.remove("cart");
    localStorage.removeItem("cart");
  };

  const item = cart[0];

  // Calcul certifié en temps réel
  const breakdown: DetailedPriceBreakdown | null = item
    ? calculateOrderPrice({
        documentType: item.documentType,
        numberOfPages: item.numberOfPages,
        numberOfDocuments: item.numberOfDocuments,
        deliveryMethod: item.deliveryMethod,
        legalization: item.legalization,
        urgency: item.urgency,
      })
    : null;

  // Lancement du paiement Stripe sécurisé
  const placeOrder = async () => {
    if (!item) {
      alert("Votre commande est vide. Veuillez configurer votre document.");
      return;
    }

    ensureEssentialConsent();
    setIsPlacingOrder(true);
    setErrorMessage("");

    try {
      const response = await fetch(`/api/services/create-payment-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cart: cart,
          sessionId: item.sessionId || "",
        }),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de l'initialisation du paiement sécurisé.");
      }

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      } else {
        throw new Error("Lien de paiement non reçu.");
      }
    } catch (err: any) {
      console.error("Erreur commande:", err);
      setErrorMessage(err.message || "Une erreur est survenue lors de la connexion à Stripe.");
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className={`min-h-screen py-12 transition-colors duration-300 ${isDarkMode ? "bg-gray-950 text-gray-100" : "bg-gray-50 text-gray-800"}`}>
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Fil d'Ariane sobre */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-[#ba1728] transition-colors"
          >
            <FaArrowLeft className="text-[10px]" />
            <span>Modifier les options de commande</span>
          </Link>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-red-50 dark:bg-red-950/40 text-[#ba1728] border border-red-200 dark:border-red-900/50">
            Étape finale • Validation sécurisée
          </span>
        </div>

        {/* Message d'erreur éventuel */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm flex items-center gap-3">
            <FaInfoCircle className="flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* ============================================================ */}
        {/* ÉTAT 1 : PANIER VIDE                                         */}
        {/* ============================================================ */}
        {(!item || !breakdown) && (
          <div className={`p-10 sm:p-16 rounded-3xl border text-center max-w-2xl mx-auto shadow-sm ${isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"}`}>
            <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/50 text-[#ba1728] flex items-center justify-center text-3xl mx-auto mb-4">
              <FaFileAlt />
            </div>
            <h1 className="text-2xl font-bold mb-2">Votre commande est actuellement vide</h1>
            <p className="text-sm opacity-70 mb-8 max-w-md mx-auto leading-relaxed">
              Vous n&apos;avez sélectionné aucun document pour le moment. Choisissez votre acte pour obtenir un devis transparent et débuter votre commande.
            </p>

            <Link
              href="/services"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-[#ba1728] hover:bg-[#a01322] text-white font-bold text-sm shadow-md transition-all duration-200 mb-8"
            >
              <span>Choisir un document à faire traduire</span>
            </Link>

            {/* Rappel des prestations officielles */}
            <div className="pt-6 border-t border-gray-100 dark:border-gray-800 text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-3 text-center">
                Prestations assurées par le cabinet :
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                {DOCUMENT_TYPES.slice(0, 6).map((d) => (
                  <Link
                    key={d.id}
                    href={`/services?doc=${d.id}`}
                    className={`p-2.5 rounded-lg border text-center transition-colors hover:border-[#ba1728] ${isDarkMode ? "bg-gray-800/40 border-gray-700" : "bg-gray-50 border-gray-200"}`}
                  >
                    <span className="block text-base mb-1">{d.icon}</span>
                    <span className="font-semibold block truncate">{d.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* ÉTAT 2 : COMMANDE ACTIVE                                     */}
        {/* ============================================================ */}
        {item && breakdown && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* Colonne Gauche : Détails de la prestation */}
            <div className="lg:col-span-7 space-y-6">

              {/* Fiche descriptive du document */}
              <div className={`p-6 sm:p-8 rounded-3xl border shadow-sm ${isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"}`}>
                <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800 mb-5">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#ba1728]">
                      Traduction Certifiée Conforme
                    </span>
                    <h1 className="text-xl sm:text-2xl font-black mt-0.5">
                      {breakdown.documentName}
                    </h1>
                  </div>
                  <button
                    type="button"
                    onClick={clearCart}
                    className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1.5 transition-colors"
                    title="Supprimer cette commande"
                  >
                    <FaTrashAlt />
                    <span className="hidden sm:inline">Vider</span>
                  </button>
                </div>

                {/* Grille détaillée des caractéristiques */}
                <div className="space-y-3.5 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-gray-100 dark:border-gray-800/60">
                    <span className="text-gray-500">Combinaison linguistique :</span>
                    <span className="font-bold">Arabe ⇄ Français (Assermentée)</span>
                  </div>

                  <div className="flex justify-between py-1.5 border-b border-gray-100 dark:border-gray-800/60">
                    <span className="text-gray-500">Volume :</span>
                    <span className="font-semibold">
                      {breakdown.isFlatRate ? "Forfait officiel (1 document)" : `${breakdown.numberOfPages} page(s)`}
                    </span>
                  </div>

                  <div className="flex justify-between py-1.5 border-b border-gray-100 dark:border-gray-800/60">
                    <span className="text-gray-500">Tarif unitaire de base :</span>
                    <span className="font-semibold">
                      {breakdown.isFlatRate ? "25,00 € (Forfait)" : `${formatEuros(breakdown.unitPricePerPage)} / page`}
                    </span>
                  </div>

                  <div className="flex justify-between py-1.5 border-b border-gray-100 dark:border-gray-800/60">
                    <span className="text-gray-500 flex items-center gap-1.5">
                      <FaTruck className="text-[#8e8271]" />
                      <span>Mode de délivrance :</span>
                    </span>
                    <span className="font-semibold">{breakdown.deliveryName}</span>
                  </div>

                  <div className="flex justify-between py-1.5 border-b border-gray-100 dark:border-gray-800/60">
                    <span className="text-gray-500 flex items-center gap-1.5">
                      <FaClock className="text-[#8e8271]" />
                      <span>Délai de traitement :</span>
                    </span>
                    <span className="font-semibold">{breakdown.urgencyName}</span>
                  </div>

                  {breakdown.legalizationPrice > 0 && (
                    <div className="flex justify-between py-1.5 border-b border-gray-100 dark:border-gray-800/60">
                      <span className="text-gray-500 flex items-center gap-1.5">
                        <FaStamp className="text-[#8e8271]" />
                        <span>Formalité de légalisation :</span>
                      </span>
                      <span className="font-semibold">{breakdown.legalizationName}</span>
                    </div>
                  )}

                  <div className="flex justify-between py-1.5 border-b border-gray-100 dark:border-gray-800/60">
                    <span className="text-gray-500 flex items-center gap-1.5">
                      <FaEnvelope className="text-[#8e8271]" />
                      <span>Email destinataire :</span>
                    </span>
                    <span className="font-bold break-all">{item.mailClient}</span>
                  </div>

                  {/* Fichiers attachés */}
                  <div className="pt-2">
                    <span className="text-gray-500 block mb-2 font-medium">Fichiers transmis :</span>
                    {item.files && item.files.length > 0 ? (
                      <div className="space-y-1.5">
                        {item.files.map((file, idx) => (
                          <div
                            key={idx}
                            className={`flex items-center gap-2 p-2 rounded-lg ${isDarkMode ? "bg-gray-800/50" : "bg-gray-100"}`}
                          >
                            <FaCheckCircle className="text-emerald-500 flex-shrink-0" />
                            <span className="truncate">{file.name}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400 italic">Aucun fichier joint à cette étape.</span>
                    )}
                  </div>

                  {item.comment && (
                    <div className="pt-2">
                      <span className="text-gray-500 block mb-1 font-medium">Instructions particulières :</span>
                      <p className={`p-3 rounded-lg italic ${isDarkMode ? "bg-gray-800/50 text-gray-300" : "bg-gray-100 text-gray-700"}`}>
                        &ldquo;{item.comment}&rdquo;
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                  <Link
                    href="/services"
                    className="text-xs text-[#ba1728] hover:underline font-bold flex items-center gap-1.5"
                  >
                    <FaEdit />
                    <span>Modifier cette commande</span>
                  </Link>
                </div>
              </div>

              {/* Bloc Réassurance Déontologique */}
              <div className={`p-6 rounded-3xl border flex items-start gap-4 ${isDarkMode ? "bg-gray-900/60 border-gray-800" : "bg-white border-gray-200"}`}>
                <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/50 text-[#ba1728] flex items-center justify-center flex-shrink-0 text-xl">
                  <FaGavel />
                </div>
                <div className="text-xs leading-relaxed space-y-1">
                  <h3 className="font-bold text-sm">Auxiliaire de justice &amp; Expert près la Cour d&apos;Appel</h3>
                  <p className="opacity-75">
                    Traduction réalisée sous la responsabilité personnelle d&apos;<strong>Aicha Salhi</strong>, traductrice assermentée experte judiciaire près la Cour d&apos;Appel de Dijon.
                  </p>
                  <p className="opacity-75">
                    Chaque document comporte le sceau officiel, la signature manuscrite et la formule légale d&apos;assermentation <em>Ne Varietur</em>.
                  </p>
                </div>
              </div>

              {/* Coordonnées professionnelles et mentions légales */}
              <div className="text-xs text-gray-400 dark:text-gray-500 px-2 space-y-1">
                <p><strong>Cabinet :</strong> Centre d&apos;Affaires Regus, 10 Avenue Jean-Baptiste Greuze, 21000 Dijon</p>
                <p><strong>Téléphone :</strong> +33 6 69 15 12 16 • <strong>Email :</strong> contact@traductionenarabe.fr</p>
                <div className="pt-2 flex flex-wrap gap-4 text-[11px] underline">
                  <Link href="/cgu">Conditions Générales de Vente</Link>
                  <Link href="/legal">Mentions Légales &amp; RGPD</Link>
                  <Link href="/contact">Assistance directe</Link>
                </div>
              </div>

            </div>

            {/* Colonne Droite : Total, Paiement et Sécurité */}
            <aside aria-label="Validation et paiement" className="lg:col-span-5 sticky top-8 space-y-6">
              <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl ${isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"}`}>

                <h2 className="text-base font-extrabold pb-4 border-b border-gray-100 dark:border-gray-800 mb-4">
                  Détail du montant à régler
                </h2>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Montant de la traduction</span>
                    <span className="font-bold">{formatEuros(breakdown.translationPrice)}</span>
                  </div>

                  {breakdown.volumeDiscount > 0 && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                      <span>Remise dégressive appliquée</span>
                      <span>- {formatEuros(breakdown.volumeDiscount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-gray-500">Délivrance : {breakdown.deliveryName}</span>
                    <span className="font-medium">
                      {breakdown.deliveryPrice === 0 ? "Gratuit" : formatEuros(breakdown.deliveryPrice)}
                    </span>
                  </div>

                  {breakdown.legalizationPrice > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Formalité de légalisation</span>
                      <span className="font-medium">{formatEuros(breakdown.legalizationPrice)}</span>
                    </div>
                  )}

                  {breakdown.urgencyPrice > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Option Urgence Express</span>
                      <span className="font-medium">{formatEuros(breakdown.urgencyPrice)}</span>
                    </div>
                  )}

                  {/* Ligne Total certifiée */}
                  <div className="pt-4 mt-2 border-t-2 border-gray-100 dark:border-gray-800 flex items-baseline justify-between">
                    <div>
                      <span className="text-sm font-extrabold block">Total à payer</span>
                      <span className="text-[11px] text-gray-400">TVA non applicable (art. 293 B CGI)</span>
                    </div>
                    <span className="text-3xl font-black text-[#ba1728]">
                      {formatEuros(breakdown.totalPrice)}
                    </span>
                  </div>
                </div>

                {/* Bouton de paiement Stripe */}
                <div className="mt-8 space-y-3">
                  <button
                    type="button"
                    onClick={placeOrder}
                    disabled={isPlacingOrder}
                    className={`w-full py-4 px-6 rounded-2xl font-extrabold text-base text-white shadow-lg flex items-center justify-center gap-2.5 transition-all duration-200 ${
                      isPlacingOrder
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-[#ba1728] hover:bg-[#a01322] shadow-red-900/20 hover:shadow-xl"
                    }`}
                  >
                    <FaLock className="text-xs" />
                    <span>
                      {isPlacingOrder
                        ? "Connexion sécurisée en cours..."
                        : `Régler ma commande • ${formatEuros(breakdown.totalPrice)}`}
                    </span>
                  </button>

                  <p className="text-center text-[11px] opacity-60 leading-tight">
                    Paiement chiffré SSL 256 bits via Stripe. Aucune coordonnée bancaire n&apos;est stockée sur nos serveurs.
                  </p>
                </div>

                {/* Badges de sécurité */}
                <div className="mt-6 pt-5 border-t border-gray-100 dark:border-gray-800 space-y-2 text-[11px] text-gray-500">
                  <div className="flex items-center gap-2">
                    <FaShieldAlt className="text-emerald-600 flex-shrink-0" />
                    <span>Paiement sécurisé par Carte Bancaire, Visa, Mastercard</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaPhone className="text-[#8e8271] flex-shrink-0" />
                    <span>Assistance téléphonique directe : 06 69 15 12 16</span>
                  </div>
                </div>

              </div>
            </aside>

          </div>
        )}

      </main>
    </div>
  );
}
