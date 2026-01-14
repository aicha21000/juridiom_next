"use client";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const Confirmation = () => {
  const [mailClient, setMailClient] = useState("");
  const [orderDetails, setOrderDetails] = useState<any[] | null>(null);

  useEffect(() => {
    const storedMail = Cookies.get("mailClient");
    if (storedMail) {
      setMailClient(storedMail);
    }

    const storedCart = Cookies.get("cart");
    if (storedCart) {
      setOrderDetails(JSON.parse(storedCart));
    }

    const timer = setTimeout(() => {
      Cookies.remove("mailClient");

    }, 1800000);
    Cookies.remove("cart");
    Cookies.remove("mailClient");
    localStorage.removeItem("cart");
    return () => clearTimeout(timer);
  }, []);

  const router = useRouter();

  const handleNavigateHome = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-12 flex items-center justify-center">
      <div className="max-w-lg mx-auto text-center">
        <h1 className="text-4xl font-bold text-green-400">Commande Confirmée!</h1>
        <p className="text-gray-300 mt-4">
          Merci pour votre commande{mailClient ? `, ${mailClient}` : ""}. Vous recevrez bientôt un email de confirmation à l'adresse suivante:{" "}
          <strong>{mailClient || "non disponible"}</strong> avec les détails de votre commande et les informations de suivi.
        </p>

        {orderDetails && (
          <div className="mt-6 text-left">
            <h2 className="text-2xl font-bold">Détails de la commande :</h2>
            <ul>
              {orderDetails.map((item, index) => (
                <li key={index} className="py-2">
                  <span>
                    {item.numberOfPages} pages, {item.numberOfDocuments} documents - {item.totalPrice} €
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={handleNavigateHome}
          className="mt-6 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Retour à la page d'accueil
        </button>
      </div>
    </div>
  );
};

export default Confirmation;