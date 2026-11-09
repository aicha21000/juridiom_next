"use client";
import React, { useEffect, useState, useRef, Suspense } from "react";
import Cookies from "js-cookie";
import DOMPurify from "dompurify";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import { useTheme } from "../context/ThemeContext";
import useScrollToTop from "../hooks/useScrollToTop";
import { ensureEssentialConsent, setCookieWithConsent } from "../utils/cookieUtils";
import {
  DOCUMENT_TYPES,
  DELIVERY_OPTIONS,
  LEGALIZATION_OPTIONS,
  URGENCY_OPTIONS,
  calculateOrderPrice,
  formatEuros,
  DetailedPriceBreakdown,
  DocumentTypeId,
} from "../utils/pricing";
import {
  FaCheck,
  FaArrowRight,
  FaArrowLeft,
  FaCloudUploadAlt,
  FaTrash,
  FaFileAlt,
  FaInfoCircle,
  FaLock,
  FaShieldAlt,
  FaGavel,
  FaLightbulb,
  FaEdit,
  FaCheckCircle,
} from "react-icons/fa";

interface UploadedFile {
  name: string;
  url: string;
  path: string;
}

interface ServiceOrder {
  mailClient: string;
  numberOfPages: number;
  numberOfDocuments: number;
  deliveryMethod: string;
  legalization: string;
  totalPrice: number;
  comment?: string;
  files?: UploadedFile[];
  documentType: string;
  urgency: "standard" | "express";
  sessionId?: string;
}

const Tooltip = ({ text }: { text: string }) => {
  const [visible, setVisible] = useState(false);
  return (
    <span className="relative inline-block ml-1 align-middle">
      <button
        type="button"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
        className="text-gray-400 hover:text-[#ba1728] transition-colors focus:outline-none"
        aria-label="En savoir plus"
      >
        <FaInfoCircle className="text-xs" />
      </button>
      {visible && (
        <span className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 text-xs text-white bg-[#1d1d1b] rounded-xl shadow-xl leading-relaxed pointer-events-none">
          {text}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1d1d1b]" />
        </span>
      )}
    </span>
  );
};

function ServicesContent() {
  useScrollToTop();
  const { isDarkMode } = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Étapes du parcours : 1 à 4
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // État de la commande
  const [documentType, setDocumentType] = useState<DocumentTypeId>("acte_naissance");
  const [numberOfPages, setNumberOfPages] = useState<number>(1);
  const [numberOfDocuments, setNumberOfDocuments] = useState<number>(1);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const [mailClient, setMailClient] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [selectedDelivery, setSelectedDelivery] = useState<string>("email");
  const [selectedLegalization, setSelectedLegalization] = useState<string>("none");
  const [urgency, setUrgency] = useState<"standard" | "express">("standard");

  const [errorMessage, setErrorMessage] = useState<string>("");
  const sessionIdRef = useRef<string>(Math.random().toString(36).substring(7));
  const initialLoadRef = useRef<boolean>(false);

  // Pré-sélection éventuelle via paramètre d'URL (ex: ?doc=permis)
  useEffect(() => {
    const docParam = searchParams.get("doc");
    if (docParam) {
      const match = DOCUMENT_TYPES.find((d) => d.id === docParam);
      if (match) {
        setDocumentType(match.id);
        if (match.isFlatRate) {
          setNumberOfPages(1);
          setNumberOfDocuments(1);
        }
      }
    }
  }, [searchParams]);

  // Chargement initial du panier existant s'il existe
  useEffect(() => {
    if (initialLoadRef.current) return;
    initialLoadRef.current = true;
    ensureEssentialConsent();

    const storedCart = Cookies.get("cart");
    if (storedCart) {
      try {
        const parsed = JSON.parse(storedCart);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const item = parsed[0];
          if (item.documentType && DOCUMENT_TYPES.some((d) => d.id === item.documentType)) {
            setDocumentType(item.documentType as DocumentTypeId);
          }
          if (item.numberOfPages) setNumberOfPages(item.numberOfPages);
          if (item.numberOfDocuments) setNumberOfDocuments(item.numberOfDocuments);
          if (item.deliveryMethod) setSelectedDelivery(item.deliveryMethod);
          if (item.legalization) setSelectedLegalization(item.legalization);
          if (item.urgency) setUrgency(item.urgency);
          if (item.mailClient) setMailClient(item.mailClient);
          if (item.comment) setComment(item.comment);
          if (item.files && Array.isArray(item.files)) setUploadedFiles(item.files);
        }
      } catch (e) {
        console.error("Erreur lecture panier existant", e);
      }
    }

    const storedMail = Cookies.get("mailClient");
    if (storedMail && storedMail !== "undefined") {
      setMailClient(storedMail);
    }
  }, []);

  // Nettoyage automatique des fichiers uploadés lors de l'activité
  useEffect(() => {
    let isMounted = true;
    const updateActivity = async () => {
      if (!isMounted || uploadedFiles.length === 0) return;
      try {
        await fetch(`/api/services/update-session-activity`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: sessionIdRef.current,
            files: uploadedFiles,
          }),
          credentials: "include",
        });
      } catch (err) {
        console.error("Erreur mise à jour activité:", err);
      }
    };

    const interval = setInterval(updateActivity, 5 * 60 * 1000);
    updateActivity();

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [uploadedFiles]);

  const selectedDocConfig = DOCUMENT_TYPES.find((d) => d.id === documentType) || DOCUMENT_TYPES[0];
  const isFlatRate = !!selectedDocConfig.isFlatRate;

  // Calcul transparent certifié
  const breakdown: DetailedPriceBreakdown = calculateOrderPrice({
    documentType,
    numberOfPages: isFlatRate ? 1 : numberOfPages,
    numberOfDocuments,
    deliveryMethod: selectedDelivery,
    legalization: selectedLegalization,
    urgency,
  });

  // Gestion de l'upload des fichiers
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    setErrorMessage("");
    setUploading(true);

    const formData = new FormData();
    const files = Array.from(event.target.files);

    for (const file of files) {
      const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "application/pdf"];
      if (!allowedTypes.includes(file.type)) {
        setErrorMessage("Formats acceptés : PDF, PNG, JPG, JPEG uniquement.");
        setUploading(false);
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

      if (!response.ok) throw new Error("Erreur de téléversement");

      const result = await response.json();
      const newFiles = (result.fileUrls || []).map((f: any) => ({
        name: f.name,
        url: f.url,
        path: f.path,
      }));

      setUploadedFiles((prev) => [...prev, ...newFiles]);
    } catch (error) {
      console.error("Erreur téléversement:", error);
      setErrorMessage("Le téléversement a échoué. Veuillez réessayer ou contacter le cabinet.");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteFile = async (filePath: string) => {
    try {
      const fileName = filePath.split("/").pop();
      await fetch(`/api/services/delete/${fileName}`, {
        method: "DELETE",
        credentials: "include",
      });
      setUploadedFiles((prev) => prev.filter((f) => f.path !== filePath));
    } catch (err) {
      console.error("Erreur suppression:", err);
    }
  };

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  // Validation d'étape
  const validateStep = (step: number): boolean => {
    setErrorMessage("");
    if (step === 1) {
      if (!documentType) {
        setErrorMessage("Veuillez sélectionner un type de document.");
        return false;
      }
      return true;
    }
    if (step === 2) {
      if (!isFlatRate && (numberOfPages < 1 || isNaN(numberOfPages))) {
        setErrorMessage("Veuillez indiquer un nombre de pages valide.");
        return false;
      }
      if (!mailClient.trim()) {
        setErrorMessage("Veuillez renseigner votre adresse email pour recevoir la traduction.");
        return false;
      }
      if (!isValidEmail(mailClient)) {
        setErrorMessage("Veuillez saisir une adresse email valide.");
        return false;
      }
      return true;
    }
    return true;
  };

  const goToNextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 4) {
        setCurrentStep((prev) => (prev + 1) as any);
        window.scrollTo({ top: 100, behavior: "smooth" });
      }
    }
  };

  const goToPreviousStep = () => {
    setErrorMessage("");
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as any);
      window.scrollTo({ top: 100, behavior: "smooth" });
    }
  };

  // Finalisation et enregistrement dans le panier
  const handleFinalizeOrder = () => {
    if (!validateStep(2)) {
      setCurrentStep(2);
      return;
    }

    ensureEssentialConsent();

    const orderItem: ServiceOrder = {
      documentType,
      numberOfPages: isFlatRate ? 1 : numberOfPages,
      numberOfDocuments,
      deliveryMethod: selectedDelivery,
      legalization: selectedLegalization,
      urgency,
      totalPrice: breakdown.totalPrice,
      mailClient: mailClient.trim(),
      comment: DOMPurify.sanitize(comment),
      files: uploadedFiles,
      sessionId: sessionIdRef.current,
    };

    const cartArray = [orderItem];
    setCookieWithConsent("cart", JSON.stringify(cartArray), { expires: 7, path: "/" });
    localStorage.setItem("cart", JSON.stringify(cartArray));
    setCookieWithConsent("mailClient", mailClient.trim(), { expires: 7 });
    localStorage.setItem("mailClient", mailClient.trim());

    router.push("/panier");
  };

  const steps = [
    { number: 1, title: "Nature du document" },
    { number: 2, title: "Fichiers & Coordonnées" },
    { number: 3, title: "Options de délivrance" },
    { number: 4, title: "Récapitulatif" },
  ];

  return (
    <div className={`min-h-screen py-12 transition-colors duration-300 ${isDarkMode ? "bg-gray-950 text-gray-100" : "bg-white text-gray-900"}`}>
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* En-tête sobre et digne */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-[#ba1728] bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 mb-3">
            <span>Experte Judiciaire • Cour d&apos;Appel de Dijon</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
            Demande de Traduction Certifiée Conforme
          </h1>
          <p className="text-xs sm:text-sm opacity-70 max-w-xl mx-auto leading-relaxed">
            Configurez votre dossier en 4 étapes simples. Chaque traduction officielle est délivrée sous la responsabilité personnelle d&apos;Aicha Salhi.
          </p>
        </div>

        {/* Indicateur de progression (Stepper sobre et fin) */}
        <nav aria-label="Progression de la commande" className="mb-10">
          <div className="flex items-center justify-between max-w-2xl mx-auto relative">
            <div className="absolute top-4 left-6 right-6 h-0.5 bg-gray-200 dark:bg-gray-800 -z-0" />
            <div
              className="absolute top-4 left-6 h-0.5 bg-[#ba1728] transition-all duration-300 -z-0"
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 92}%` }}
            />

            {steps.map((s) => {
              const isPassed = currentStep > s.number;
              const isCurrent = currentStep === s.number;
              return (
                <div key={s.number} className="relative z-10 flex flex-col items-center">
                  <button
                    type="button"
                    onClick={() => {
                      if (s.number < currentStep || validateStep(currentStep)) {
                        setCurrentStep(s.number as any);
                      }
                    }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                      isPassed
                        ? "bg-[#ba1728] text-white"
                        : isCurrent
                        ? "bg-[#ba1728] text-white ring-4 ring-red-50 dark:ring-red-950/50"
                        : isDarkMode
                        ? "bg-gray-900 text-gray-500 border border-gray-800"
                        : "bg-white text-gray-400 border border-gray-200"
                    }`}
                  >
                    {isPassed ? <FaCheck className="text-[10px]" /> : s.number}
                  </button>
                  <span
                    className={`mt-1.5 text-[11px] font-medium text-center hidden sm:block ${
                      isCurrent
                        ? "text-[#ba1728] font-bold"
                        : isPassed
                        ? isDarkMode ? "text-gray-300" : "text-gray-700"
                        : "text-gray-400"
                    }`}
                  >
                    {s.title}
                  </span>
                </div>
              );
            })}
          </div>
        </nav>

        {/* Message d'erreur éventuel */}
        {errorMessage && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2.5">
            <FaInfoCircle className="flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Colonne Principale (8/12) */}
          <div className="lg:col-span-8">

            {/* ============================================================ */}
            {/* ÉTAPE 1 : NATURE DU DOCUMENT                                 */}
            {/* ============================================================ */}
            {currentStep === 1 && (
              <section className={`p-6 sm:p-7 rounded-2xl border ${isDarkMode ? "bg-gray-900/60 border-gray-800" : "bg-white border-gray-200"} shadow-xs`}>
                <div className="mb-6">
                  <h2 className="text-lg font-bold mb-1">
                    1. Sélectionnez la nature de votre document
                  </h2>
                  <p className="text-xs opacity-70">
                    Choisissez le document à traduire pour adapter la présentation et la conformité administrative.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {DOCUMENT_TYPES.map((doc) => {
                    const isSelected = documentType === doc.id;
                    return (
                      <div
                        key={doc.id}
                        onClick={() => {
                          setDocumentType(doc.id);
                          if (doc.isFlatRate) {
                            setNumberOfPages(1);
                            setNumberOfDocuments(1);
                          }
                          setErrorMessage("");
                        }}
                        className={`cursor-pointer p-4 rounded-xl border transition-all duration-150 flex flex-col justify-between ${
                          isSelected
                            ? "border-[#ba1728] bg-red-50/20 dark:bg-red-950/20 shadow-xs"
                            : isDarkMode
                            ? "border-gray-800 bg-gray-900/40 hover:border-gray-700"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2.5 mb-2">
                            <span className="text-lg">{doc.icon}</span>
                            <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">{doc.name}</h3>
                          </div>
                          <p className="text-xs opacity-70 leading-relaxed">
                            {doc.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    type="button"
                    onClick={goToNextStep}
                    className="px-6 py-2.5 rounded-xl bg-[#ba1728] hover:bg-[#a01322] text-white font-semibold text-xs flex items-center gap-2 shadow-xs transition-colors"
                  >
                    <span>Continuer vers les fichiers</span>
                    <FaArrowRight className="text-[10px]" />
                  </button>
                </div>
              </section>
            )}

            {/* ============================================================ */}
            {/* ÉTAPE 2 : FICHIERS ET COORDONNÉES                           */}
            {/* ============================================================ */}
            {currentStep === 2 && (
              <section className={`p-6 sm:p-7 rounded-2xl border ${isDarkMode ? "bg-gray-900/60 border-gray-800" : "bg-white border-gray-200"} shadow-xs space-y-6`}>
                <div>
                  <h2 className="text-lg font-bold mb-1">
                    2. Déposez votre document &amp; vos coordonnées
                  </h2>
                  <p className="text-xs opacity-70">
                    Document sélectionné : <strong>{selectedDocConfig.name}</strong>. Une photographie nette prise avec votre smartphone convient.
                  </p>
                </div>

                {/* Consignes de numérisation discrètes */}
                <div className={`p-4 rounded-xl border text-xs leading-relaxed ${isDarkMode ? "bg-gray-800/40 border-gray-700 text-gray-300" : "bg-gray-50 border-gray-200 text-gray-700"}`}>
                  <div className="font-semibold flex items-center gap-1.5 mb-1.5 text-gray-900 dark:text-white">
                    <FaLightbulb className="text-amber-500" />
                    <span>Recommandations de prise de vue :</span>
                  </div>
                  <p className="opacity-80">
                    Posez le document bien à plat, veillez à ce que les 4 coins, le texte et les tampons d&apos;origine soient parfaitement lisibles et sans reflets.
                  </p>
                </div>

                {/* Zone de téléversement sobre */}
                <div className="border border-dashed rounded-xl p-6 text-center transition-colors border-gray-300 dark:border-gray-700 hover:border-gray-400">
                  <FaCloudUploadAlt className="mx-auto text-3xl text-gray-400 mb-2" />
                  <p className="text-xs font-semibold mb-1">
                    Glissez vos documents ici, ou parcourez vos fichiers
                  </p>
                  <p className="text-[11px] opacity-60 mb-3">
                    Formats acceptés : PDF, JPG, JPEG, PNG
                  </p>
                  <label className="inline-block px-4 py-2 rounded-lg bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs font-semibold cursor-pointer hover:opacity-90 transition-opacity">
                    {uploading ? "Téléversement en cours..." : "Sélectionner un fichier"}
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={handleFileUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Fichiers ajoutés */}
                {uploadedFiles.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-xs font-semibold text-gray-500 block">
                      Documents téléversés ({uploadedFiles.length}) :
                    </span>
                    <div className="space-y-1.5">
                      {uploadedFiles.map((file, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center justify-between p-2.5 rounded-lg border text-xs ${isDarkMode ? "bg-gray-800/30 border-gray-800" : "bg-gray-50 border-gray-200"}`}
                        >
                          <div className="flex items-center gap-2 truncate pr-2">
                            <FaFileAlt className="text-gray-400 flex-shrink-0" />
                            <span className="font-medium truncate">{file.name}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteFile(file.path)}
                            className="text-gray-400 hover:text-red-500 p-1 flex-shrink-0 transition-colors"
                            title="Supprimer"
                          >
                            <FaTrash className="text-xs" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Nombre de pages */}
                <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <label htmlFor="pagesInput" className="font-semibold text-xs block">
                        Nombre total de pages du document
                      </label>
                      <p className="text-[11px] opacity-60">
                        {isFlatRate
                          ? "Forfait officiel de 25 € applicable pour ce type de document."
                          : "Tarif dégressif calculé automatiquement selon le volume."}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={isFlatRate || numberOfPages <= 1}
                        onClick={() => setNumberOfPages((prev) => Math.max(1, prev - 1))}
                        className="w-8 h-8 rounded-lg border text-xs font-bold flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        -
                      </button>
                      <input
                        id="pagesInput"
                        type="number"
                        min="1"
                        disabled={isFlatRate}
                        value={isFlatRate ? 1 : numberOfPages}
                        onChange={(e) => setNumberOfPages(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-14 h-8 text-center font-semibold text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent"
                      />
                      <button
                        type="button"
                        disabled={isFlatRate}
                        onClick={() => setNumberOfPages((prev) => prev + 1)}
                        className="w-8 h-8 rounded-lg border text-xs font-bold flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Email de réception */}
                <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                  <label htmlFor="emailInput" className="font-semibold text-xs block mb-1">
                    Adresse email de réception <span className="text-[#ba1728]">*</span>
                  </label>
                  <p className="text-[11px] opacity-60 mb-2">
                    Votre exemplaire numérique certifié et votre reçu d&apos;honoraires vous seront adressés à cette adresse.
                  </p>
                  <input
                    id="emailInput"
                    type="email"
                    value={mailClient}
                    onChange={(e) => setMailClient(e.target.value)}
                    placeholder="adresse.email@exemple.com"
                    className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-xs focus:ring-1 focus:ring-gray-400 focus:outline-none"
                    required
                  />
                </div>

                {/* Instructions particulières */}
                <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                  <label htmlFor="commentsInput" className="font-semibold text-xs block mb-1">
                    Observations ou transcription particulière (facultatif)
                  </label>
                  <textarea
                    id="commentsInput"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={2}
                    placeholder="Orthographe exacte des noms d'après le passeport, remarques..."
                    className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-xs focus:ring-1 focus:ring-gray-400 focus:outline-none"
                  />
                </div>

                {/* Boutons d'étape */}
                <div className="mt-8 flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                  <button
                    type="button"
                    onClick={goToPreviousStep}
                    className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-xs font-medium flex items-center gap-1.5"
                  >
                    <FaArrowLeft className="text-[10px]" />
                    <span>Retour</span>
                  </button>
                  <button
                    type="button"
                    onClick={goToNextStep}
                    className="px-6 py-2.5 rounded-xl bg-[#ba1728] hover:bg-[#a01322] text-white font-semibold text-xs flex items-center gap-2 shadow-xs transition-colors"
                  >
                    <span>Continuer vers les options</span>
                    <FaArrowRight className="text-[10px]" />
                  </button>
                </div>
              </section>
            )}

            {/* ============================================================ */}
            {/* ÉTAPE 3 : OPTIONS & MODES DE DÉLIVRANCE                      */}
            {/* ============================================================ */}
            {currentStep === 3 && (
              <section className={`p-6 sm:p-7 rounded-2xl border ${isDarkMode ? "bg-gray-900/60 border-gray-800" : "bg-white border-gray-200"} shadow-xs space-y-6`}>
                <div>
                  <h2 className="text-lg font-bold mb-1">
                    3. Modes de délivrance et formalités
                  </h2>
                  <p className="text-xs opacity-70">
                    Sélectionnez le mode de remise de votre traduction ainsi que les éventuelles formalités requises.
                  </p>
                </div>

                {/* Mode de délivrance */}
                <div>
                  <label className="font-semibold text-xs block mb-2.5 text-gray-700 dark:text-gray-300">
                    Mode d&apos;expédition / Remise du document
                  </label>
                  <div className="space-y-2">
                    {DELIVERY_OPTIONS.map((opt) => {
                      const isSelected = selectedDelivery === opt.id;
                      return (
                        <div
                          key={opt.id}
                          onClick={() => setSelectedDelivery(opt.id)}
                          className={`cursor-pointer p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                            isSelected
                              ? "border-[#ba1728] bg-red-50/20 dark:bg-red-950/20 shadow-xs"
                              : isDarkMode
                              ? "border-gray-800 bg-gray-900/40 hover:border-gray-700"
                              : "border-gray-200 bg-white hover:border-gray-300"
                          }`}
                        >
                          <div>
                            <div className="font-semibold text-xs text-gray-900 dark:text-gray-100 flex items-center gap-2">
                              <span>{opt.name}</span>
                              {opt.price === 0 && (
                                <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">
                                  (Format standard inclus)
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] opacity-60 mt-0.5">{opt.description}</p>
                          </div>
                          <span className="text-xs font-medium text-gray-600 dark:text-gray-400 ml-4 whitespace-nowrap">
                            {opt.price === 0 ? "Inclus" : `+ ${formatEuros(opt.price)}`}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Délai de traitement */}
                <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                  <label className="font-semibold text-xs block mb-2.5 text-gray-700 dark:text-gray-300">
                    Délai de réalisation
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {URGENCY_OPTIONS.map((opt) => {
                      const isSelected = urgency === opt.id;
                      return (
                        <div
                          key={opt.id}
                          onClick={() => setUrgency(opt.id)}
                          className={`cursor-pointer p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                            isSelected
                              ? "border-[#ba1728] bg-red-50/20 dark:bg-red-950/20 shadow-xs"
                              : isDarkMode
                              ? "border-gray-800 bg-gray-900/40 hover:border-gray-700"
                              : "border-gray-200 bg-white hover:border-gray-300"
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-semibold text-xs">{opt.name}</span>
                              <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                                {opt.price === 0 ? "Inclus" : `+ ${formatEuros(opt.price)}`}
                              </span>
                            </div>
                            <span className="inline-block text-[11px] font-medium text-gray-500 mb-1">
                              {opt.delayText}
                            </span>
                            <p className="text-[11px] opacity-60">{opt.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Légalisation */}
                <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <label htmlFor="legalSelect" className="font-semibold text-xs text-gray-700 dark:text-gray-300">
                      Formalités de légalisation supplémentaires
                    </label>
                    <Tooltip text="Exigée uniquement par certaines autorités consulaires étrangères pour des pays hors convention. Inutile pour les démarches en France métropolitaine." />
                  </div>
                  <select
                    id="legalSelect"
                    value={selectedLegalization}
                    onChange={(e) => setSelectedLegalization(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-xs focus:ring-1 focus:ring-gray-400 focus:outline-none"
                  >
                    {LEGALIZATION_OPTIONS.map((leg) => (
                      <option key={leg.id} value={leg.id} className={isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}>
                        {leg.name} {leg.price > 0 ? `(+ ${formatEuros(leg.price)})` : "(Aucune démarche requise)"}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Boutons d'étape */}
                <div className="mt-8 flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                  <button
                    type="button"
                    onClick={goToPreviousStep}
                    className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-xs font-medium flex items-center gap-1.5"
                  >
                    <FaArrowLeft className="text-[10px]" />
                    <span>Retour</span>
                  </button>
                  <button
                    type="button"
                    onClick={goToNextStep}
                    className="px-6 py-2.5 rounded-xl bg-[#ba1728] hover:bg-[#a01322] text-white font-semibold text-xs flex items-center gap-2 shadow-xs transition-colors"
                  >
                    <span>Vérifier le récapitulatif</span>
                    <FaArrowRight className="text-[10px]" />
                  </button>
                </div>
              </section>
            )}

            {/* ============================================================ */}
            {/* ÉTAPE 4 : RÉCAPITULATIF                                     */}
            {/* ============================================================ */}
            {currentStep === 4 && (
              <section className={`p-6 sm:p-7 rounded-2xl border ${isDarkMode ? "bg-gray-900/60 border-gray-800" : "bg-white border-gray-200"} shadow-xs space-y-5`}>
                <div>
                  <h2 className="text-lg font-bold mb-1">
                    4. Synthèse de votre demande
                  </h2>
                  <p className="text-xs opacity-70">
                    Vérifiez les données saisies avant de valider votre commande.
                  </p>
                </div>

                <div className={`p-4 rounded-xl border text-xs space-y-2 ${isDarkMode ? "bg-gray-800/20 border-gray-800" : "bg-gray-50/70 border-gray-200"}`}>
                  <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-800">
                    <span className="font-semibold text-gray-500">Document :</span>
                    <span className="font-bold">{breakdown.documentName} ({breakdown.isFlatRate ? "Forfait" : `${breakdown.numberOfPages} page(s)`})</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-800">
                    <span className="font-semibold text-gray-500">Délivrance :</span>
                    <span>{breakdown.deliveryName}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-800">
                    <span className="font-semibold text-gray-500">Délai :</span>
                    <span>{breakdown.urgencyName}</span>
                  </div>
                  {breakdown.legalizationPrice > 0 && (
                    <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-800">
                      <span className="font-semibold text-gray-500">Légalisation :</span>
                      <span>{breakdown.legalizationName}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-500">Email client :</span>
                    <span className="font-medium">{mailClient}</span>
                  </div>
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="text-xs">
                    <span className="font-semibold text-gray-500 block mb-1">Pièces jointes ({uploadedFiles.length}) :</span>
                    <ul className="list-disc list-inside opacity-75 space-y-0.5">
                      {uploadedFiles.map((f, i) => (
                        <li key={i} className="truncate">{f.name}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-8 flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                  <button
                    type="button"
                    onClick={goToPreviousStep}
                    className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-xs font-medium flex items-center gap-1.5"
                  >
                    <FaArrowLeft className="text-[10px]" />
                    <span>Modifier les options</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleFinalizeOrder}
                    className="px-6 py-2.5 rounded-xl bg-[#ba1728] hover:bg-[#a01322] text-white font-semibold text-xs flex items-center gap-2 shadow-xs transition-colors"
                  >
                    <span>Valider ma commande ({formatEuros(breakdown.totalPrice)})</span>
                    <FaArrowRight className="text-[10px]" />
                  </button>
                </div>
              </section>
            )}

          </div>

          {/* Colonne Latérale Droite (4/12) : Reassurance & Décompte discret */}
          <aside aria-label="Informations du cabinet" className="lg:col-span-4 sticky top-6 space-y-5">
            <div className={`p-5 rounded-2xl border shadow-xs ${isDarkMode ? "bg-gray-900/60 border-gray-800" : "bg-white border-gray-200"}`}>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 pb-2 border-b border-gray-100 dark:border-gray-800">
                {currentStep >= 3 ? "Honoraires transparents" : "Prestation & Déontologie"}
              </h3>

              {currentStep < 3 ? (
                /* Présentation institutionnelle discrète pendant les étapes 1 et 2 */
                <div className="space-y-3.5 text-xs">
                  <div>
                    <span className="font-semibold block text-gray-900 dark:text-gray-100 mb-0.5">
                      Aicha Salhi
                    </span>
                    <p className="opacity-70 text-[11px] leading-relaxed">
                      Experte judiciaire assermentée près la Cour d&apos;Appel de Dijon.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-gray-100 dark:border-gray-800 space-y-2 text-[11px] text-gray-500">
                    <div className="flex items-center gap-2">
                      <FaGavel className="text-[#8e8271] flex-shrink-0" />
                      <span>Sceau officiel et mention Ne Varietur</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaShieldAlt className="text-emerald-600 flex-shrink-0" />
                      <span>Secret professionnel et confidentialité absolue</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaLock className="text-gray-500 flex-shrink-0" />
                      <span>Paiement sécurisé Stripe à l&apos;étape finale</span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Décompte clair et sobre lors des étapes 3 et 4 */
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Traduction ({breakdown.documentName})</span>
                    <span className="font-semibold">{formatEuros(breakdown.translationPrice)}</span>
                  </div>

                  {breakdown.volumeDiscount > 0 && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                      <span>Barème dégressif</span>
                      <span>- {formatEuros(breakdown.volumeDiscount)}</span>
                    </div>
                  )}

                  {breakdown.deliveryPrice > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Expédition postale</span>
                      <span>{formatEuros(breakdown.deliveryPrice)}</span>
                    </div>
                  )}

                  {breakdown.urgencyPrice > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Urgence Express</span>
                      <span>{formatEuros(breakdown.urgencyPrice)}</span>
                    </div>
                  )}

                  {breakdown.legalizationPrice > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Légalisation</span>
                      <span>{formatEuros(breakdown.legalizationPrice)}</span>
                    </div>
                  )}

                  <div className="pt-3 mt-1 border-t border-gray-200 dark:border-gray-800 flex justify-between items-baseline">
                    <span className="font-bold text-xs text-gray-700 dark:text-gray-300">
                      Total net :
                    </span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {formatEuros(breakdown.totalPrice)}
                    </span>
                  </div>
                  <span className="block text-[10px] text-gray-400 text-right">
                    TVA non applicable (art. 293 B CGI)
                  </span>
                </div>
              )}
            </div>

            <div className="text-[11px] text-gray-400 px-1 leading-relaxed text-center">
              Besoin d&apos;assistance ? Contactez le cabinet au <a href="tel:+33669151216" className="font-semibold underline">06 69 15 12 16</a>
            </div>
          </aside>

        </div>
      </main>
    </div>
  );
}

export default function Services() {
  return (
    <Suspense fallback={<div className="min-h-screen py-20 text-center text-xs opacity-50">Chargement...</div>}>
      <ServicesContent />
    </Suspense>
  );
}
