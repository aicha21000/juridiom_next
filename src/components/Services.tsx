"use client";
import React, { useEffect, useState, useRef } from "react";
import Cookies from "js-cookie";
import DOMPurify from "dompurify";
import { useRouter } from "next/navigation";

import { useTheme } from "../context/ThemeContext";
import useScrollToTop from "../hooks/useScrollToTop";
import CookieBanner from './CookieBanner';
import { ensureEssentialConsent, setCookieWithConsent } from "../utils/cookieUtils";
import {
  FaFileAlt,
  FaTruck,
  FaStamp,
  FaCloudUploadAlt,
  FaTrash,
  FaShoppingCart,
  FaEnvelope,
  FaComment
} from "react-icons/fa";

interface Service {
  mailClient: string;
  numberOfPages: number;
  numberOfDocuments: number;
  deliveryMethod: string;
  legalization: string;
  totalPrice: number;
  comment?: string;
  files?: Array<{ name: string; url: string; path: string }>;
}

interface DeliveryMethod {
  id: string;
  name: string;
  price: number;
}

interface LegalizationType {
  id: string;
  name: string;
  price: number;
}

const Services = () => {
  useScrollToTop();

  // const { isAuthenticated, user } = useAuth(); // Auth removed
  const { isDarkMode } = useTheme();

  const [deliveryMethods, setDeliveryMethods] = useState<DeliveryMethod[]>([]);
  const [mailClient, setMailClient] = useState<string>("");
  const [legalizationTypes, setLegalizationTypes] = useState<LegalizationType[]>([]);
  const [selectedDelivery, setSelectedDelivery] = useState("email");
  const [selectedLegalization, setSelectedLegalization] = useState("none");
  const [numberOfPages, setNumberOfPages] = useState(1);
  const [numberOfDocuments, setNumberOfDocuments] = useState(1);
  const [totalPrice, setTotalPrice] = useState(30);
  const [cart, setCart] = useState<Service[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState<{ email?: string; file?: string; page?: string }>({});
  const [comment, setComment] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ name: string; url: string; path: string }>>([]);
  const [uploadingFiles, setUploadingFiles] = useState<Array<{ name: string; progress: number }>>([]);
  const sessionIdRef = useRef<string>(Math.random().toString(36).substring(7));
  const initialLoadRef = useRef(false);
  const router = useRouter();

  // Chargement initial du panier
  useEffect(() => {
    if (initialLoadRef.current) return;
    initialLoadRef.current = true;

    ensureEssentialConsent();

    const storedCart = Cookies.get("cart");
    if (storedCart) {
      const parsedCart = JSON.parse(storedCart);
      setCart(parsedCart);
    }

    // Auth login removed, using cookie only
    const storedMail = Cookies.get("mailClient");
    if (storedMail && storedMail !== "undefined") {
      setMailClient(storedMail);
    }
  }, []);

  useEffect(() => {
    if (cart.length > 0 && cart[0].files) {
      setUploadedFiles(cart[0].files);
    }
  }, [cart]);

  useEffect(() => {
    let isMounted = true;
    const updateActivity = async () => {
      if (!isMounted || uploadedFiles.length === 0) return;

      try {
        await fetch(`/api/services/update-session-activity`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: sessionIdRef.current,
            files: uploadedFiles
          }),
          credentials: 'include'
        });
      } catch (error) {
        console.error('Erreur mise à jour activité:', error);
      }
    };

    const interval = setInterval(updateActivity, 5 * 60 * 1000);
    updateActivity();

    const handleBeforeUnload = async () => {
      if (uploadedFiles.length === 0) return;

      try {
        for (const file of uploadedFiles) {
          const fileName = file.path.split("/").pop();
          await fetch(`/api/services/delete/${fileName}`, {
            method: "DELETE",
            credentials: "include",
          });
        }
      } catch (error) {
        console.error("Erreur suppression fichiers:", error);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      isMounted = false;
      clearInterval(interval);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [uploadedFiles]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`/api/services`);
        const data = await response.json();
        setDeliveryMethods(data.deliveryMethods);
        setLegalizationTypes(data.legalizationTypes);
      } catch (err) {
        console.error("Erreur lors du chargement des services", err);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    const calculateTotalPrice = async () => {
      try {
        const response = await fetch(`/api/services/calculate-price`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            numberOfPages,
            deliveryMethod: selectedDelivery,
            legalization: selectedLegalization,
            numberOfDocuments,
          }),
        });
        const data = await response.json();
        setTotalPrice(data.totalPrice);
      } catch (err) {
        console.error("Erreur de calcul du prix", err);
      }
    };

    calculateTotalPrice();
  }, [numberOfPages, selectedDelivery, selectedLegalization, numberOfDocuments]);

  const handleNumberOfPagesChange = (value: number) => {
    if (value < numberOfDocuments) {
      setErrorMessage("Le nombre de pages ne peut pas être inférieur au nombre de documents.");
    } else {
      setErrorMessage("");
      setNumberOfPages(value);
    }
  };

  const handleNumberOfDocumentsChange = (value: number) => {
    if (value < 1) return;
    setNumberOfDocuments(value);
    if (numberOfPages < value) {
      setNumberOfPages(value);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;

    const formData = new FormData();
    const files = Array.from(event.target.files);

    setUploadingFiles(files.map(file => ({ name: file.name, progress: 0 })));

    for (const file of files) {
      const allowedTypes = ["image/png", "image/jpeg", "application/pdf"];
      if (!allowedTypes.includes(file.type)) {
        setErrorMessage("Seuls les fichiers PDF, PNG et JPG sont autorisés.");
        setUploadingFiles([]);
        return;
      }
      formData.append("files", file);
    }

    try {
      const response = await fetch(`/api/services/upload`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) throw new Error(`Erreur upload: ${response.statusText}`);

      const result = await response.json();
      const newFiles = result.fileUrls.map((file: { name: string; url: string; path: string }) => ({
        name: file.name,
        url: file.url,
        path: file.path,
      }));

      setUploadedFiles(prev => [...prev, ...newFiles]);
      setErrorMessage("");
    } catch (error) {
      console.error("Erreur upload:", error);
      setErrorMessage("Erreur lors de l'upload des fichiers.");
    } finally {
      setUploadingFiles([]);
    }
  };

  const handleDeleteFile = async (filePath: string) => {
    try {
      const fileName = filePath.split("/").pop();

      const response = await fetch(`/api/services/delete/${fileName}`, {
        method: "DELETE",
        credentials: "include",
      });

      setUploadedFiles((prevFiles) => prevFiles.filter((file) => file.path !== filePath));

      const updatedCart = [...cart];
      if (updatedCart.length > 0 && updatedCart[0].files) {
        updatedCart[0].files = updatedCart[0].files.filter((file) => file.path !== filePath);
        setCart(updatedCart);
        setCookieWithConsent("cart", JSON.stringify(updatedCart), { expires: 7, path: "/" });
        localStorage.setItem("cart", JSON.stringify(updatedCart));
      }

      if (!response.ok) {
        if (response.status === 404) return;
        throw new Error("Erreur lors de la suppression du fichier");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du fichier:", error);
      setErrorMessage("Erreur lors de la suppression du fichier.");
    }
  };

  const handleCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const sanitizedComment = DOMPurify.sanitize(event.target.value);
    setComment(sanitizedComment);
  };

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const addToCart = () => {
    // Guest mode only: always require email
    if (!mailClient.trim()) {
      setErrorMessage("L'adresse email est requise.");
      return;
    } else if (!isValidEmail(mailClient)) {
      setErrorMessage("Veuillez entrer une adresse email valide.");
      return;
    }

    ensureEssentialConsent();
    setErrorMessage("");

    if (errorMessage) return;

    const newItem = {
      numberOfPages,
      numberOfDocuments,
      deliveryMethod: selectedDelivery,
      mailClient,
      legalization: selectedLegalization,
      totalPrice,
      comment,
      files: uploadedFiles,
    };

    const updatedCart = [...cart];
    if (updatedCart.length > 0) {
      updatedCart[0] = newItem;
    } else {
      updatedCart.push(newItem);
    }

    setCart(updatedCart);
    setCookieWithConsent("cart", JSON.stringify(updatedCart), { expires: 7, path: "/" });
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCookieWithConsent("mailClient", mailClient, { expires: 7 });
    localStorage.setItem("mailClient", mailClient);
    router.push("/panier");
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? "bg-gray-950 text-gray-100" : "bg-gray-50 text-gray-800"}`}>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className={`text-4xl md:text-5xl font-extrabold tracking-tight mb-4 ${isDarkMode ? "text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500" : "text-gray-900"}`}>
            Services de <span className="text-red-700">Traduction</span>
          </h1>
          <p className={`text-lg max-w-2xl mx-auto ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            Configurez votre commande en quelques étapes simples. Devis immédiat et transparent.
          </p>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-start">

          {/* Left Column - Configuration Forms */}
          <div className="lg:col-span-7 space-y-8">

            {/* Documents Section */}
            <div className={`p-8 rounded-2xl shadow-sm border transition-all duration-300 hover:shadow-md ${isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}>
              <div className="flex items-center mb-6">
                <div className={`p-3 rounded-full mr-4 ${isDarkMode ? "bg-red-900/20 text-red-500" : "bg-red-50 text-red-600"}`}>
                  <FaFileAlt className="text-xl" />
                </div>
                <h2 className="text-2xl font-bold">Documents</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Number of Pages */}
                <div>
                  <label htmlFor="numberOfPages" className="block text-sm font-semibold mb-2 opacity-80">
                    Nombre de pages
                  </label>
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => handleNumberOfPagesChange(Math.max(numberOfDocuments, numberOfPages - 1))}
                      className={`w-10 h-10 flex items-center justify-center rounded-l-lg border-y border-l transition-colors outline-none focus:ring-1 focus:ring-red-500 ${isDarkMode
                        ? "bg-gray-800 border-gray-700 hover:bg-gray-750"
                        : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                        }`}
                    >
                      -
                    </button>
                    <input
                      id="numberOfPages"
                      type="number"
                      value={numberOfPages}
                      onChange={(e) => handleNumberOfPagesChange(Math.max(numberOfDocuments, Number(e.target.value)))}
                      className={`w-full h-10 text-center border-y z-10 focus:ring-1 focus:ring-red-500 outline-none ${isDarkMode
                        ? "bg-gray-900 border-gray-700 text-white"
                        : "bg-white border-gray-200 text-gray-900"
                        }`}
                      min={numberOfDocuments}
                    />
                    <button
                      type="button"
                      onClick={() => handleNumberOfPagesChange(numberOfPages + 1)}
                      className={`w-10 h-10 flex items-center justify-center rounded-r-lg border-y border-r transition-colors outline-none focus:ring-1 focus:ring-red-500 ${isDarkMode
                        ? "bg-gray-800 border-gray-700 hover:bg-gray-750"
                        : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                        }`}
                    >
                      +
                    </button>
                  </div>
                  {numberOfPages < numberOfDocuments && (
                    <p className="text-red-500 text-xs mt-2">Min. égal au nb. de documents</p>
                  )}
                </div>

                {/* Number of Documents */}
                <div>
                  <label htmlFor="numberOfDocuments" className="block text-sm font-semibold mb-2 opacity-80">
                    Nombre de documents
                  </label>
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => handleNumberOfDocumentsChange(Math.max(1, numberOfDocuments - 1))}
                      className={`w-10 h-10 flex items-center justify-center rounded-l-lg border-y border-l transition-colors outline-none focus:ring-1 focus:ring-red-500 ${isDarkMode
                        ? "bg-gray-800 border-gray-700 hover:bg-gray-750"
                        : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                        }`}
                    >
                      -
                    </button>
                    <input
                      id="numberOfDocuments"
                      type="number"
                      value={numberOfDocuments}
                      onChange={(e) => handleNumberOfDocumentsChange(Math.max(1, Number(e.target.value)))}
                      className={`w-full h-10 text-center border-y z-10 focus:ring-1 focus:ring-red-500 outline-none ${isDarkMode
                        ? "bg-gray-900 border-gray-700 text-white"
                        : "bg-white border-gray-200 text-gray-900"
                        }`}
                      min={1}
                    />
                    <button
                      type="button"
                      onClick={() => handleNumberOfDocumentsChange(numberOfDocuments + 1)}
                      className={`w-10 h-10 flex items-center justify-center rounded-r-lg border-y border-r transition-colors outline-none focus:ring-1 focus:ring-red-500 ${isDarkMode
                        ? "bg-gray-800 border-gray-700 hover:bg-gray-750"
                        : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                        }`}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery & Legalization Section */}
            <div className={`p-8 rounded-2xl shadow-sm border transition-all duration-300 hover:shadow-md ${isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Delivery */}
                <div>
                  <div className="flex items-center mb-4">
                    <FaTruck className={`mr-3 ${isDarkMode ? "text-indigo-400" : "text-indigo-600"}`} />
                    <h2 className="text-xl font-bold">Livraison</h2>
                  </div>
                  <select
                    value={selectedDelivery}
                    onChange={(e) => setSelectedDelivery(e.target.value)}
                    className={`w-full p-3 rounded-lg border transition-colors focus:ring-2 focus:ring-red-500 focus:border-red-500 ${isDarkMode
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-gray-50 border-gray-200 text-gray-900"
                      }`}
                  >
                    {deliveryMethods.map((method) => (
                      <option key={method.id} value={method.id}>
                        {method.name} (+{method.price}€)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Legalization */}
                <div>
                  <div className="flex items-center mb-4">
                    <FaStamp className={`mr-3 ${isDarkMode ? "text-amber-400" : "text-amber-600"}`} />
                    <h2 className="text-xl font-bold">Légalisation</h2>
                  </div>
                  <select
                    value={selectedLegalization}
                    onChange={(e) => setSelectedLegalization(e.target.value)}
                    className={`w-full p-3 rounded-lg border transition-colors focus:ring-2 focus:ring-red-500 focus:border-red-500 ${isDarkMode
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-gray-50 border-gray-200 text-gray-900"
                      }`}
                  >
                    {legalizationTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name} (+{type.price}€)
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Email Section (if needed) */}
            <div className={`p-8 rounded-2xl shadow-sm border transition-all duration-300 hover:shadow-md ${isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}>
              <div className="flex items-center mb-6">
                <FaEnvelope className={`mr-3 ${isDarkMode ? "text-emerald-400" : "text-emerald-600"}`} />
                <h2 className="text-xl font-bold">Vos coordonnées</h2>
              </div>
              <input
                type="email"
                placeholder="votre@email.com"
                value={mailClient}
                onChange={(e) => {
                  setMailClient(e.target.value);
                  if (e.target.value.trim()) setErrorMessage("");
                }}
                className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-red-500 focus:border-red-500 ${isDarkMode
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-gray-50 border-gray-200 text-gray-900"
                  }`}
              />
            </div>

            {/* Files Upload */}
            <div className={`p-8 rounded-2xl shadow-sm border transition-all duration-300 hover:shadow-md ${isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}>
              <div className="flex items-center mb-6">
                <FaCloudUploadAlt className={`mr-3 text-2xl ${isDarkMode ? "text-blue-400" : "text-blue-600"}`} />
                <h2 className="text-xl font-bold">Vos Fichiers</h2>
              </div>

              <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${isDarkMode ? "border-gray-700 hover:border-gray-500 bg-gray-800/50" : "border-gray-300 hover:border-gray-400 bg-gray-50"
                }`}>
                <input
                  id="file-upload"
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                  <FaCloudUploadAlt className="text-4xl mb-3 opacity-50" />
                  <span className="font-semibold text-lg">Cliquez pour ajouter des fichiers</span>
                  <span className="text-sm opacity-70 mt-1">PDF, PNG, JPG acceptés</span>
                </label>
              </div>

              {/* File List */}
              {uploadedFiles.length > 0 && (
                <div className="mt-6 space-y-3">
                  {uploadedFiles.map((file, idx) => (
                    <div key={idx} className={`flex justify-between items-center p-3 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}>
                      <div className="flex items-center overflow-hidden">
                        <FaFileAlt className="mr-3 opacity-70 flex-shrink-0" />
                        <span className="truncate text-sm font-medium">{file.name}</span>
                      </div>
                      <button onClick={() => handleDeleteFile(file.path)} className="text-red-500 hover:text-red-700 p-2 transition-colors">
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Comments */}
            <div className={`p-8 rounded-2xl shadow-sm border transition-all duration-300 hover:shadow-md ${isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}>
              <div className="flex items-center mb-4">
                <FaComment className={`mr-3 ${isDarkMode ? "text-purple-400" : "text-purple-600"}`} />
                <h2 className="text-xl font-bold">Commentaire / Instructions</h2>
              </div>
              <textarea
                value={comment}
                onChange={handleCommentChange}
                placeholder="Instructions particulières pour la traduction..."
                className={`w-full p-4 rounded-lg border min-h-[120px] focus:ring-2 focus:ring-red-500 focus:border-red-500 ${isDarkMode
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-gray-50 border-gray-200 text-gray-900"
                  }`}
              />
            </div>

          </div>

          {/* Right Column - Sticky Summary */}
          <div className="lg:col-span-5 mt-12 lg:mt-0 relative">
            <div className={`sticky top-8 rounded-2xl shadow-xl overflow-hidden border ${isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}>
              <div className="bg-gradient-to-r from-red-600 to-red-800 p-6 text-white">
                <h2 className="text-2xl font-bold flex items-center">
                  <FaShoppingCart className="mr-3" /> Résumé
                </h2>
              </div>

              <div className="p-8 space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-800">
                  <span className="opacity-80">Pages</span>
                  <span className="font-bold text-lg">{numberOfPages}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-800">
                  <span className="opacity-80">Documents</span>
                  <span className="font-bold text-lg">{numberOfDocuments}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-800">
                  <span className="opacity-80">Livraison</span>
                  <div className="text-right">
                    <div className="font-bold">{deliveryMethods.find(d => d.id === selectedDelivery)?.name}</div>
                    <div className="text-sm opacity-60">
                      +{deliveryMethods.find(d => d.id === selectedDelivery)?.price}€
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-800">
                  <span className="opacity-80">Légalisation</span>
                  <div className="text-right">
                    <div className="font-bold">{legalizationTypes.find(l => l.id === selectedLegalization)?.name}</div>
                    <div className="text-sm opacity-60">
                      +{legalizationTypes.find(l => l.id === selectedLegalization)?.price}€
                    </div>
                  </div>
                </div>

                <div className="pt-4 pb-6">
                  <div className="flex justify-between items-end">
                    <span className="text-lg font-medium opacity-80">Total estimé</span>
                    <span className={`text-4xl font-extrabold ${isDarkMode ? "text-red-500" : "text-red-600"}`}>
                      {totalPrice}€
                    </span>
                  </div>
                </div>

                {errorMessage && (
                  <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-lg text-sm mb-4">
                    {errorMessage}
                  </div>
                )}

                <button
                  onClick={addToCart}
                  disabled={uploadingFiles.length > 0}
                  className={`w-full py-4 text-lg font-bold rounded-xl shadow-lg transform transition-all hover:scale-105 active:scale-95 ${uploadingFiles.length > 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white"
                    }`}
                >
                  {uploadingFiles.length > 0 ? "Chargement..." : "Ajouter au panier"}
                </button>

                <p className="text-center text-xs opacity-50 mt-4">
                  Les prix sont indiqués en Euros TTC. Paiement sécurisé.
                </p>
              </div>
            </div>
          </div>

        </div>
        <CookieBanner />
      </main>
    </div>
  );
};

export default Services;