"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Order } from "@/services/firebase";
import { FaBox, FaDownload, FaClock } from "react-icons/fa";

export default function ClientDashboard() {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      window.location.href = "/login";
      return;
    }
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => {
        const mine = data.orders.filter(
          (o: Order) =>
            o.mailClient?.toLowerCase() === user?.email?.toLowerCase()
        );
        setOrders(mine);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching orders:", err);
        setLoading(false);
      });
  }, [user]);

  if (loading) {
    return <div className="p-8 text-center">Chargement…</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mes commandes</h1>
        <button onClick={logout} className="text-gray-600 hover:text-red-600">
          Déconnexion
        </button>
      </header>

      {orders.length === 0 ? (
        <div className="text-center p-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm border">
          <FaBox className="text-gray-300 text-6xl mx-auto mb-4" />
          <p className="text-gray-500">
            Vous n'avez pas encore de commande active. Vos futures commandes
            apparaîtront ici. (L'historique complet sera disponible prochainement).
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-6"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold">{order.mailClient}</h2>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <FaClock size={12} /> {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="text-2xl font-bold text-red-600">
                  {order.totalPrice} €
                </div>
              </div>

              <div className="mt-4 text-sm">
                <p>{order.numberOfPages} pages / {order.numberOfDocuments} docs</p>
                <p>{order.legalization}</p>
                <p>{order.deliveryMethod}</p>
              </div>

              {order.files?.length > 0 && (
                <div className="mt-4">
                  <strong>Fichiers :</strong>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {order.files.map((f, i) => (
                      <a
                        key={i}
                        href={f.url ?? "#"}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full text-xs hover:bg-gray-200"
                      >
                        <FaDownload size={10} /> {f.name}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
