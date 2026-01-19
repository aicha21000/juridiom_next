"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import {
    FaBox, FaTruck, FaCheck, FaTimes, FaEnvelope,
    FaDownload, FaClock, FaSyncAlt, FaSignOutAlt
} from "react-icons/fa";
import { listenToAllOrders, updateOrderStatus, Order } from "@/services/firebase";

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    // Simple security check (à améliorer plus tard avec des rôles Firebase)
    const isAdmin = user?.email === "salhi.aicha@traductionenarabe.fr" || user?.email?.includes("admin");

    useEffect(() => {
        if (!user) {
            router.push("/login");
            return;
        }

        const unsubscribeOrders = listenToAllOrders((data) => {
            setOrders(data);
            setLoading(false);
        });

        return () => {
            unsubscribeOrders();
        };
    }, [user, router]);

    const handleStatusUpdate = async (orderId: string, status: Order['status']) => {
        try {
            await updateOrderStatus(orderId, status);
        } catch (error) {
            alert("Erreur lors de la mise à jour du statut");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
        );
    }

    if (!isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
                <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-xl shadow-xl max-w-md w-full">
                    <FaTimes className="text-red-500 text-5xl mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Accès Refusé</h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Vous n'avez pas les droits nécessaires pour accéder au panneau d'administration.
                    </p>
                    <button
                        onClick={() => router.push("/")}
                        className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
                    >
                        Retour à l'accueil
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Sidebar / Header */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center">
                            <h1 className="text-xl font-bold text-red-600">Admin Juridiom</h1>
                            <nav className="ml-10 flex space-x-4">
                                <span className="px-3 py-2 rounded-md text-sm font-medium bg-red-100 text-red-700">
                                    Commandes ({orders.length})
                                </span>
                            </nav>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-500 hidden md:block">{user?.email}</span>
                            <button onClick={() => logout()} className="text-gray-500 hover:text-red-600">
                                <FaSignOutAlt size={20} title="Déconnexion" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Gestion des Commandes</h2>
                        <div className="text-sm text-gray-500">
                            Dernier rafraîchissement : {new Date().toLocaleTimeString()}
                        </div>
                    </div>

                    {orders.length === 0 ? (
                        <div className="bg-white dark:bg-gray-800 p-12 text-center rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                            <FaBox className="text-gray-300 text-6xl mx-auto mb-4" />
                            <p className="text-gray-500">Aucune commande reçue pour le moment.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6">
                            {orders.map((order) => (
                                <div key={order.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transform transition hover:shadow-md">
                                    <div className="p-6">
                                        <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-xs font-mono text-gray-400">ID: {order.id.slice(0, 10)}...</span>
                                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${order.status === 'paid' ? 'bg-green-100 text-green-700' :
                                                        order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                                                            order.status === 'completed' ? 'bg-gray-100 text-gray-700' :
                                                                'bg-yellow-100 text-yellow-700'
                                                        }`}>
                                                        {order.status.toUpperCase()}
                                                    </span>
                                                </div>
                                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                                    {order.mailClient}
                                                </h3>
                                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                                    <FaClock size={12} /> {new Date(order.createdAt).toLocaleString()}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-red-600">{order.totalPrice} €</div>
                                                <p className="text-xs text-gray-500">Payé via Stripe</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 border-t border-b border-gray-50 dark:border-gray-700 mb-4">
                                            <div>
                                                <span className="text-xs text-gray-400 block uppercase font-bold">Détails Service</span>
                                                <p className="text-sm dark:text-gray-300">{order.numberOfPages} pages / {order.numberOfDocuments} docs</p>
                                                <p className="text-sm dark:text-gray-300">{order.legalization}</p>
                                            </div>
                                            <div>
                                                <span className="text-xs text-gray-400 block uppercase font-bold">Livraison</span>
                                                <p className="text-sm dark:text-gray-300">{order.deliveryMethod}</p>
                                            </div>
                                            <div>
                                                <span className="text-xs text-gray-400 block uppercase font-bold">Actions</span>
                                                <div className="flex gap-2 mt-1">
                                                    {order.status === 'paid' && (
                                                        <button
                                                            onClick={() => handleStatusUpdate(order.id, 'processing')}
                                                            className="p-2 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 title='En cours'"
                                                        >
                                                            <FaSyncAlt />
                                                        </button>
                                                    )}
                                                    {order.status !== 'shipped' && order.status !== 'completed' && (
                                                        <button
                                                            onClick={() => handleStatusUpdate(order.id, 'shipped')}
                                                            className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 title='Expédié'"
                                                        >
                                                            <FaTruck />
                                                        </button>
                                                    )}
                                                    {order.status !== 'completed' && (
                                                        <button
                                                            onClick={() => handleStatusUpdate(order.id, 'completed')}
                                                            className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 title='Terminé'"
                                                        >
                                                            <FaCheck />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {order.comment && (
                                            <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg italic text-sm text-gray-600 dark:text-gray-400">
                                                "{order.comment}"
                                            </div>
                                        )}

                                        {order.files && order.files.length > 0 && (
                                            <div>
                                                <span className="text-xs text-gray-400 block uppercase font-bold mb-2">Fichiers Client</span>
                                                <div className="flex flex-wrap gap-2">
                                                    {order.files.map((file, idx) => (
                                                        <a
                                                            key={idx}
                                                            href="#"
                                                            onClick={async (e) => {
                                                                e.preventDefault();
                                                                // If the file already contains a signed URL, use it directly
                                                                if (file.url) {
                                                                    window.open(file.url, '_blank');
                                                                    return;
                                                                }
                                                                try {
                                                                    const res = await fetch(`/api/services/download?path=${encodeURIComponent(file.path)}`);
                                                                    const data = await res.json();
                                                                    if (data.url) {
                                                                        window.open(data.url, '_blank');
                                                                    } else {
                                                                        alert('Impossible de récupérer le lien de téléchargement.');
                                                                    }
                                                                } catch (err) {
                                                                    console.error(err);
                                                                    alert('Erreur lors du téléchargement.');
                                                                }
                                                            }}
                                                            className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full text-xs hover:bg-gray-200 transition"
                                                        >
                                                            <FaDownload size={10} /> {file.name}
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
