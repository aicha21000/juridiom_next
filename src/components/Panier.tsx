"use client";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Link from "next/link";
import { useTheme } from "../context/ThemeContext";
import useScrollToTop from "../hooks/useScrollToTop";
import CookieBanner from './CookieBanner';
import { Stripe } from '@stripe/stripe-js';
import { ensureEssentialConsent, setCookieWithConsent } from "../utils/cookieUtils";
import {
  FaLock,
  FaShieldAlt,
  FaCheckCircle,
  FaStar,
  FaGavel,
  FaPhone,
  FaArrowLeft,
  FaFileAlt,
  FaTruck,
  FaStamp,
  FaEnvelope,
  FaTrashAlt,
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
}

const DELIVERY_LABELS: Record<string, string> = {
  email: "Par email (PDF officiel certifié)",
  standard: "Livraison postale standard",
  priority: "Livraison postale prioritaire",
  international: "Livraison postale à l'étranger",
  dhl: "Livraison express DHL",
};

const LEGALIZATION_LABELS: Record<string, string> = {
  none: "Aucune légalisation supplémentaire",
  mairie: "Certification Mairie",
  chamberOfCommerce: "Chambre de Commerce",
  foreignAffairs: "Ministère des Affaires Étrangères",
  consulate: "Consulat / Ambassade",
};

const Panier = () => {
  useScrollToTop();

  const { isDarkMode } = useTheme();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);

  useEffect(() => {
    ensureEssentialConsent();

    const loadCart = () => {
      const cookieCart = Cookies.get("cart");
      const localStorageCart = localStorage.getItem("cart");
      let cartData = null;
      if (cookieCart) {
        try {
          cartData = JSON.parse(cookieCart);
        } catch (error) {
          console.error("Erreur parsing cookie cart:", error);
        }
      }
      if (!cartData && localStorageCart) {
        try {
          cartData = JSON.parse(localStorageCart);
        } catch (error) {
          console.error("Erreur parsing localStorage cart:", error);
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

  useEffect(() => {
    const loadStripeModule = async () => {
      const { loadStripe } = await import('@stripe/stripe-js');
      setStripePromise(loadStripe(`${process.env.NEXT_PUBLIC_STRIPE_PUBLIC}`));
    };
    loadStripeModule();
  }, []);

  const removeFromCart = (index: number) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
    setCookieWithConsent("cart", JSON.stringify(newCart), { expires: 7 });
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const clearCart = () => {
    setCart([]);
    Cookies.remove("cart");
    localStorage.removeItem("cart");
  };

  const placeOrder = async () => {
    if (cart.length === 0) {
      alert("Votre panier est vide. Veuillez ajouter un document avant de passer commande.");
      return;
    }

    ensureEssentialConsent();
    setIsPlacingOrder(true);

    try {
      const lineItems = cart.map((item) => ({
        price_data: {
          currency: "eur",
          product_data: {
            name: `Traduction assermentée (${item.numberOfPages} pages, ${item.numberOfDocuments} documents)`,
          },
          unit_amount: item.totalPrice * 100,
        },
        quantity: 1,
      }));

      const stripeResponse = await fetch(`/api/services/create-payment-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: lineItems,
          cart: cart,
          sessionId: cart[0]?.sessionId || '',
        }),
        credentials: "include",
      });

      if (!stripeResponse.ok) {
        const errorData = await stripeResponse.json();
        throw new Error(errorData.error || "Erreur lors de la création de la session de paiement");
      }

      const { url } = await stripeResponse.json();

      if (url) {
        window.location.href = url;
      } else {
        throw new Error("URL de paiement manquante");
      }
    } catch (err) {
      console.error("Erreur:", err);
      alert("Erreur: " + (err instanceof Error ? err.message : "Une erreur est survenue lors du paiement"));
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const item = cart[0];
  const totalAmount = cart.reduce((sum, it) => sum + (it.totalPrice || 0), 0);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-950 text-gray-100' : 'bg-gray-50 text-gray-900'} py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300`}>
      <div className="max-w-4xl mx-auto">

        {/* Fil d'Ariane / Progression */}
        <div className="mb-8">
          <Link
            href="/services"
            className="inline-flex items-center text-sm font-medium text-red-600 hover:text-red-700 mb-4 transition-colors"
          >
            <FaArrowLeft className="mr-2" /> Modifier mes options / documents
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-wider text-red-600 dark:text-red-400">
                Étape 2 sur 2 • Finalisation sécurisée
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1">
                Récapitulatif &amp; Paiement
              </h1>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <FaLock className="text-emerald-600 dark:text-emerald-400" />
              <span>Chiffrement SSL 256 bits</span>
            </div>
          </div>
        </div>

        {cart.length > 0 && item ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* Colonne Gauche : Détail de la commande */}
            <div className="lg:col-span-7 space-y-6">

              {/* Carte des détails */}
              <div className={`rounded-2xl border p-6 sm:p-8 shadow-sm ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
                <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-800">
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <FaFileAlt className="text-red-600" />
                    Détails de la traduction
                  </h2>
                  <button
                    onClick={() => removeFromCart(0)}
                    className="text-xs text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1"
                    title="Retirer ce document"
                  >
                    <FaTrashAlt /> Retirer
                  </button>
                </div>

                <div className="mt-6 space-y-4 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800/50">
                    <span className="opacity-70">Volume :</span>
                    <span className="font-semibold">{item.numberOfPages} page(s) • {item.numberOfDocuments} document(s)</span>
                  </div>

                  <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800/50">
                    <span className="opacity-70 flex items-center gap-1.5">
                      <FaTruck className="text-xs text-blue-500" /> Mode de livraison :
                    </span>
                    <span className="font-semibold text-right">
                      {DELIVERY_LABELS[item.deliveryMethod] || item.deliveryMethod}
                    </span>
                  </div>

                  {item.legalization && item.legalization !== "none" && (
                    <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800/50">
                      <span className="opacity-70 flex items-center gap-1.5">
                        <FaStamp className="text-xs text-amber-500" /> Légalisation :
                      </span>
                      <span className="font-semibold text-right">
                        {LEGALIZATION_LABELS[item.legalization] || item.legalization}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800/50">
                    <span className="opacity-70 flex items-center gap-1.5">
                      <FaEnvelope className="text-xs text-emerald-500" /> Email de réception :
                    </span>
                    <span className="font-semibold break-all text-right">{item.mailClient}</span>
                  </div>

                  {/* Fichiers attachés */}
                  {item.files && item.files.length > 0 && (
                    <div className="pt-2">
                      <span className="opacity-70 block mb-2 font-medium">Fichiers transmis :</span>
                      <div className="space-y-1.5">
                        {item.files.map((file, idx) => (
                          <div
                            key={idx}
                            className={`flex items-center gap-2 p-2 rounded-lg text-xs ${isDarkMode ? 'bg-gray-800/60' : 'bg-gray-100'}`}
                          >
                            <FaCheckCircle className="text-emerald-500 flex-shrink-0" />
                            <span className="truncate">{file.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Commentaire éventuel */}
                  {item.comment && (
                    <div className="pt-2">
                      <span className="opacity-70 block mb-1 font-medium">Instructions particulières :</span>
                      <p className={`p-3 rounded-lg text-xs italic ${isDarkMode ? 'bg-gray-800/60 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                        &ldquo;{item.comment}&rdquo;
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Reassurance Bloc 1 : Validité Officielle */}
              <div className={`rounded-2xl border p-6 flex items-start gap-4 ${isDarkMode ? 'bg-gray-900/60 border-gray-800' : 'bg-white border-gray-200'}`}>
                <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-600 flex items-center justify-center flex-shrink-0 text-xl">
                  <FaGavel />
                </div>
                <div>
                  <h3 className="font-bold text-sm mb-1">Traduction Certifiée Conforme &amp; Officielle</h3>
                  <p className="text-xs opacity-75 leading-relaxed">
                    Réalisée et signée avec sceau officiel par <strong>Aicha Salhi</strong>, traductrice assermentée experte judiciaire près la <strong>Cour d&apos;Appel de Dijon</strong>. Valable auprès de toutes les préfectures, mairies, universités, tribunaux et consulats de France.
                  </p>
                </div>
              </div>

            </div>

            {/* Colonne Droite : Total, Paiement et Sécurité */}
            <div className="lg:col-span-5 space-y-6">

              {/* Bloc Paiement Sticky */}
              <div className={`rounded-2xl border p-6 sm:p-8 shadow-xl relative overflow-hidden ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
                <div className="flex items-center justify-between pb-6 border-b border-gray-200 dark:border-gray-800">
                  <span className="text-base font-semibold opacity-80">Total à régler</span>
                  <div className="text-right">
                    <span className="text-4xl font-black text-red-600 dark:text-red-500">
                      {totalAmount} €
                    </span>
                    <span className="block text-xs opacity-50">TTC • Aucun frais caché</span>
                  </div>
                </div>

                {/* Bouton de paiement Stripe */}
                <div className="mt-6 space-y-3">
                  <button
                    onClick={placeOrder}
                    disabled={isPlacingOrder}
                    className={`w-full py-4 px-6 rounded-xl font-extrabold text-lg text-white shadow-lg flex items-center justify-center gap-3 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 ${
                      isPlacingOrder
                        ? 'bg-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 hover:shadow-emerald-500/25'
                    }`}
                  >
                    <FaLock className="text-sm" />
                    <span>{isPlacingOrder ? 'Connexion sécurisée...' : `Payer en toute sécurité (${totalAmount} €)`}</span>
                  </button>

                  <p className="text-center text-[11px] opacity-60 leading-tight">
                    Vous allez être redirigé vers l&apos;interface de paiement sécurisée Stripe.
                  </p>
                </div>

                {/* Badges de paiement sécurisé */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800 space-y-4">
                  <div className="flex items-center justify-center gap-2 text-xs font-semibold opacity-80">
                    <FaShieldAlt className="text-emerald-500 text-sm" />
                    <span>Paiement sécurisé par Stripe</span>
                  </div>

                  <div className="flex items-center justify-center gap-4 text-xs opacity-60 flex-wrap">
                    <span className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 font-semibold">Carte Bancaire</span>
                    <span className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 font-semibold">Visa</span>
                    <span className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 font-semibold">Mastercard</span>
                    <span className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 font-semibold">Apple Pay</span>
                  </div>

                  <p className="text-center text-[11px] opacity-50">
                    Vos coordonnées bancaires sont chiffrées selon la norme bancaire PCI-DSS et ne transitent jamais sur nos serveurs.
                  </p>
                </div>

                {/* Avis Google */}
                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800/60 flex items-center justify-center gap-2 text-xs">
                  <div className="flex text-yellow-400">
                    <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                  </div>
                  <span className="font-bold">4.9 / 5</span>
                  <span className="opacity-60">• +50 avis vérifiés sur Google</span>
                </div>

                {/* Assistance téléphonique */}
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800/60 text-center">
                  <p className="text-xs opacity-70 mb-1">Un doute ou une question avant de régler ?</p>
                  <a
                    href="tel:+33669151216"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 dark:text-red-400"
                  >
                    <FaPhone className="text-[10px]" /> 06 69 15 12 16 (Appel direct)
                  </a>
                </div>

              </div>

              {/* Bouton secondaire pour vider */}
              <div className="text-center">
                <button
                  onClick={clearCart}
                  className="text-xs text-gray-400 hover:text-red-500 underline transition-colors"
                >
                  Annuler et vider la commande
                </button>
              </div>

            </div>

          </div>
        ) : (
          /* Panier vide */
          <div className={`rounded-2xl border p-12 text-center max-w-lg mx-auto ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-950/50 text-red-600 flex items-center justify-center text-2xl">
              <FaFileAlt />
            </div>
            <h2 className="text-xl font-bold mb-2">Votre commande est vide</h2>
            <p className="text-sm opacity-70 mb-6">
              Vous n&apos;avez pas encore configuré de document pour la traduction.
            </p>
            <Link
              href="/services"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-md"
            >
              Configurer ma traduction
            </Link>
          </div>
        )}

      </div>
      <CookieBanner />
    </div>
  );
};

export default Panier;
