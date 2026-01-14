"use client";
import React from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { FaUser, FaSignOutAlt, FaHistory } from "react-icons/fa";

const Dashboard = () => {
    const { user, logout } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.push("/login");
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Chargement...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                    Mon Tableau de Bord
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Profile Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full">
                                <FaUser size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold dark:text-white">Mon Profil</h2>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">{user.email}</p>
                            </div>
                        </div>

                        {user.email === "salhi.aicha@traductionenarabe.fr" && (
                            <button
                                onClick={() => router.push("/admin")}
                                className="w-full mb-4 flex items-center justify-center px-4 py-2 border-2 border-red-600 text-sm font-medium rounded-md text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm"
                            >
                                <FaUser className="mr-2" /> Espace Administration
                            </button>
                        )}

                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors"
                        >
                            <FaSignOutAlt className="mr-2" /> Se déconnecter
                        </button>
                    </div>

                    {/* Orders Placeholder */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:col-span-2">
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full">
                                <FaHistory size={24} />
                            </div>
                            <h2 className="text-xl font-semibold dark:text-white">Mes Commandes</h2>
                        </div>
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                            <p className="text-gray-500 dark:text-gray-400">
                                Vous n'avez pas encore de commande active. Vos futures commandes apparaîtront ici.
                                (L'historique complet sera disponible prochainement).
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
