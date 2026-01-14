"use client";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useTheme } from "../context/ThemeContext";
import useScrollToTop from "../hooks/useScrollToTop";
import CookieBanner from './CookieBanner';
import { Stripe } from '@stripe/stripe-js';
import { ensureEssentialConsent, setCookieWithConsent } from "../utils/cookieUtils";

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
}

const Panier = () => {
  useScrollToTop();

  const { isDarkMode } = useTheme();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);

  useEffect(() => {
    // Créer automatiquement le consentement pour les cookies essentiels si nécessaire
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
    const interval = setInterval(loadCart, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Charger Stripe uniquement quand le composant est monté
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
      alert("Votre panier est vide. Veuillez ajouter des services avant de passer commande.");
      return;
    }

    // Créer automatiquement le consentement pour les cookies essentiels si nécessaire
    ensureEssentialConsent();

    setIsPlacingOrder(true);

    try {
      const lineItems = cart.map((item) => ({
        price_data: {
          currency: "eur",
          product_data: {
            name: `Traduction de ${item.numberOfPages} pages (${item.numberOfDocuments} documents)`,
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
          cart: cart
        }),
        credentials: "include"
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

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} px-6 py-12`}>
      <div className="max-w-4xl mx-auto text-center">
        <h1 className={`text-4xl font-bold ${isDarkMode ? 'text-red-500' : 'text-red-700'} mb-2`}>Votre Commande</h1>
        <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-red-500' : 'text-red-700'}`}>Récapitulatif</h2>
        {cart.length > 0 ? (
          <>
            <ul className={`mt-6 text-left ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
              {cart.map((item, index) => (
                <li key={index} className="py-2">
                  <span>
                    {item.numberOfPages} pages, {item.numberOfDocuments} documents - {item.totalPrice} €
                  </span>
                  <button onClick={() => removeFromCart(index)} className={`ml-4 ${isDarkMode ? 'text-red-500' : 'text-red-600'}`}>
                    Retirer
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-6 space-x-4">
              <button
                onClick={placeOrder}
                disabled={isPlacingOrder}
                className={`${isPlacingOrder ? 'bg-gray-400' : isDarkMode ? 'bg-green-600' : 'bg-green-500'} text-white py-2 px-4 rounded`}
              >
                {isPlacingOrder ? 'Traitement...' : 'Valider la commande'}
              </button>
              <button
                onClick={clearCart}
                className={`${isDarkMode ? 'bg-red-600' : 'bg-red-500'} text-white py-2 px-4 rounded`}
              >
                Vider le panier
              </button>
            </div>
          </>
        ) : (
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Votre panier est vide.</p>
        )}
      </div>
      <CookieBanner />
    </div>
  );
};

export default Panier;
