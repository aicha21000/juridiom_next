"use client";
import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import {
    FaBox, FaTruck, FaCheck, FaTimes, FaEnvelope,
    FaDownload, FaClock, FaSyncAlt, FaSignOutAlt, FaPaperPlane,
    FaFileAlt, FaTrash, FaCloudUploadAlt, FaPlus
} from "react-icons/fa";
import { listenToAllOrders, updateOrderStatus, Order } from "@/services/firebase";

const LEGALIZATION_LABELS: Record<string, string> = {
    none: "Aucune légalisation",
    mairie: "Mairie",
    chamberOfCommerce: "Chambre de commerce",
    foreignAffairs: "Ministère des Affaires étrangères",
    consulate: "Consulat et ambassade",
};

const DELIVERY_LABELS: Record<string, string> = {
    email: "Email",
    standard: "Livraison standard",
    priority: "Livraison prioritaire",
    international: "Livraison à l'étranger",
    dhl: "Livraison DHL",
};

const AdminDashboard = () => {
    const { user, loading: authLoading, logout } = useAuth();
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal state for sending translation
    const [sendModal, setSendModal] = useState<{ open: boolean; orderId: string; orderNumber: string; clientEmail: string } | null>(null);
    const [sendFiles, setSendFiles] = useState<File[]>([]);
    const [sendMessage, setSendMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [isDraggingModal, setIsDraggingModal] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Simple security check (à améliorer plus tard avec des rôles Firebase)
    const isAdmin = user?.email === "salhi.aicha@traductionenarabe.fr" || user?.email?.includes("admin");

    useEffect(() => {
        if (authLoading) return;

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
    }, [user, authLoading, router]);

    const handleDeleteOrder = async (orderId: string) => {
        if (!confirm('Êtes‑vous sûr de vouloir supprimer cette commande et tous ses fichiers ?')) {
            return;
        }
        try {
            const response = await fetch('/api/services/delete-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId })
            });
            if (!response.ok) {
                const data = await response.json();
                alert(`Erreur lors de la suppression : ${data.error || response.statusText}`);
            }
            // Listener will auto‑refresh the list
        } catch (err) {
            console.error('Error deleting order:', err);
            alert('Erreur lors de la suppression de la commande');
        }
    };
    const handleStatusUpdate = async (orderId: string, status: string) => {
        try {
            const response = await fetch('/api/services/update-order-status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId, status })
            });
            if (!response.ok) {
                const data = await response.json();
                alert(`Erreur lors de la mise à jour du statut : ${data.error || response.statusText}`);
            }
        } catch (err) {
            console.error('Error updating order status:', err);
            alert('Erreur lors de la mise à jour du statut');
        }
    };

    const handleAddSendFiles = (newFiles: FileList | File[]) => {
        const fileArray = Array.from(newFiles);
        if (fileArray.length === 0) return;
        setSendFiles((prev) => {
            const existingKeys = new Set(prev.map((f) => `${f.name}_${f.size}`));
            const filtered = fileArray.filter((f) => !existingKeys.has(`${f.name}_${f.size}`));
            return [...prev, ...filtered];
        });
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleRemoveSendFile = (index: number) => {
        setSendFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} o`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
    };

    const handleSendTranslation = async () => {
        if (!sendModal) return;
        if (sendFiles.length === 0) {
            alert('Veuillez sélectionner au moins un fichier de traduction.');
            return;
        }
        setSending(true);
        try {
            const formData = new FormData();
            formData.append('orderId', sendModal.orderId);
            formData.append('message', sendMessage);
            sendFiles.forEach((file) => {
                formData.append('files', file);
            });
            const response = await fetch('/api/services/send-translation', { method: 'POST', body: formData });
            if (response.ok) {
                alert(`✅ ${sendFiles.length > 1 ? `${sendFiles.length} fichiers envoyés` : 'Traduction envoyée'} avec succès à ${sendModal.clientEmail} !`);
                setSendModal(null);
                setSendFiles([]);
                setSendMessage('');
            } else {
                const data = await response.json();
                alert(`Erreur : ${data.error || 'Erreur inconnue'}`);
            }
        } catch (err) {
            console.error('Erreur envoi traduction:', err);
            alert('Erreur lors de l\'envoi.');
        } finally {
            setSending(false);
        }
    };

    if (authLoading || loading) {
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
                                                    <span className="text-xs font-mono text-gray-400">N° {order.orderNumber || order.id.slice(0, 10)}...</span>
                                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${order.status === 'paid' ? 'bg-green-100 text-green-700' :
                                                        order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                                                            order.status === 'completed' ? 'bg-gray-100 text-gray-700' :
                                                                'bg-yellow-100 text-yellow-700'
                                                        }`}>
                                                        {order.status ? order.status.toUpperCase() : 'UNKNOWN'}
                                                    </span>
                                                </div>
                                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                                    {order.mailClient}
                                                </h3>
                                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                                    <FaClock size={12} /> {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'Date inconnue'}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-red-600">{order.totalPrice || 0} €</div>
                                                <p className="text-xs text-gray-500">Payé via Stripe</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 border-t border-b border-gray-50 dark:border-gray-700 mb-4">
                                            <div>
                                                <span className="text-xs text-gray-400 block uppercase font-bold">Détails Service</span>
                                                <p className="text-sm dark:text-gray-300">{order.numberOfPages} pages / {order.numberOfDocuments} docs</p>
                                                <p className="text-sm dark:text-gray-300">{LEGALIZATION_LABELS[order.legalization as string] || order.legalization}</p>
                                            </div>
                                            <div>
                                                <span className="text-xs text-gray-400 block uppercase font-bold">Livraison</span>
                                                <p className="text-sm dark:text-gray-300">{DELIVERY_LABELS[order.deliveryMethod as string] || order.deliveryMethod}</p>
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
                                                                                                 <button
                                                     onClick={() => handleDeleteOrder(order.id)}
                                                     className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 title='Supprimer'">
                                                     <FaTimes />
                                                 </button>
                                                 <button
                                                     title="Envoyer la traduction"
                                                     onClick={() => {
                                                        setSendFiles([]);
                                                        setSendMessage('');
                                                        setSendModal({ open: true, orderId: order.id, orderNumber: order.orderNumber || order.id.slice(0, 10), clientEmail: order.mailClient });
                                                    }}
                                                     className="p-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100"
                                                 >
                                                     <FaPaperPlane />
                                                 </button>
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

            {/* Modal - Envoyer la traduction */}
            {sendModal && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                📤 Envoyer la traduction
                            </h2>
                            <button onClick={() => setSendModal(null)} className="text-gray-400 hover:text-gray-600">
                                <FaTimes size={20} />
                            </button>
                        </div>

                        <p className="text-sm text-gray-500 mb-4">
                            Commande <strong>#{sendModal.orderNumber}</strong> — Client : <strong>{sendModal.clientEmail}</strong>
                        </p>

                        {/* File upload zone with multi-files and drag & drop */}
                        <div className="mb-4">
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    📎 Fichiers traduits <span className="text-red-500">*</span>
                                </label>
                                {sendFiles.length > 0 && (
                                    <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 px-2 py-0.5 rounded-full">
                                        {sendFiles.length} fichier{sendFiles.length > 1 ? 's' : ''} sélectionné{sendFiles.length > 1 ? 's' : ''}
                                    </span>
                                )}
                            </div>

                            <div
                                onDragOver={(e) => { e.preventDefault(); setIsDraggingModal(true); }}
                                onDragLeave={(e) => { e.preventDefault(); setIsDraggingModal(false); }}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    setIsDraggingModal(false);
                                    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                                        handleAddSendFiles(e.dataTransfer.files);
                                    }
                                }}
                                className={`border-2 border-dashed rounded-xl p-4 text-center transition-colors ${
                                    isDraggingModal
                                        ? "border-purple-600 bg-purple-50/50 dark:bg-purple-950/20"
                                        : "border-gray-300 dark:border-gray-600 hover:border-purple-400"
                                }`}
                            >
                                <FaCloudUploadAlt className={`mx-auto text-3xl mb-1 ${isDraggingModal ? "text-purple-600" : "text-gray-400"}`} />
                                <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-0.5">
                                    {isDraggingModal ? "Déposez vos fichiers ici" : "Glissez vos documents traduits ou parcourez"}
                                </p>
                                <p className="text-[11px] text-gray-400 mb-2">
                                    PDF, images, etc. · Vous pouvez envoyer plusieurs fichiers à la fois
                                </p>
                                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold cursor-pointer transition shadow-xs">
                                    <FaPlus className="text-[10px]" />
                                    <span>{sendFiles.length === 0 ? "Sélectionner un ou plusieurs fichiers" : "Ajouter d'autres fichiers"}</span>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        multiple
                                        onChange={(e) => e.target.files && handleAddSendFiles(e.target.files)}
                                        className="hidden"
                                    />
                                </label>
                            </div>

                            {/* Liste des fichiers sélectionnés avec suppression unitaire */}
                            {sendFiles.length > 0 && (
                                <div className="mt-3 space-y-1.5 max-h-40 overflow-y-auto pr-1">
                                    {sendFiles.map((file, idx) => (
                                        <div
                                            key={`${file.name}_${idx}`}
                                            className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 text-xs"
                                        >
                                            <div className="flex items-center gap-2 truncate pr-2">
                                                <FaFileAlt className="text-purple-600 flex-shrink-0 text-sm" />
                                                <span className="font-medium truncate text-gray-800 dark:text-gray-200">{file.name}</span>
                                                <span className="text-[10px] text-gray-400 flex-shrink-0">({formatFileSize(file.size)})</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveSendFile(idx)}
                                                className="text-gray-400 hover:text-red-500 p-1 flex-shrink-0 transition-colors"
                                                title="Supprimer ce fichier"
                                            >
                                                <FaTrash className="text-xs" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Message */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                ✉️ Message (optionnel)
                            </label>
                            <textarea
                                rows={5}
                                placeholder="Laissez vide pour utiliser le message par défaut..."
                                value={sendMessage}
                                onChange={(e) => setSendMessage(e.target.value)}
                                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-sm dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setSendModal(null)}
                                className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleSendTranslation}
                                disabled={sending || sendFiles.length === 0}
                                className="flex-1 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2 font-medium text-sm transition"
                            >
                                <FaPaperPlane />
                                {sending ? 'Envoi en cours...' : `Envoyer (${sendFiles.length} fichier${sendFiles.length > 1 ? 's' : ''})`}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
