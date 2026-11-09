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
  FaCamera,
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

  // Si le type sélectionné est forfaitaire (permis ou casier), forcer les pages à 1
  const selectedDocConfig = DOCUMENT_TYPES.find((d) => d.id === documentType) || DOCUMENT_TYPES[0];
  const isFlatRate = !!selectedDocConfig.isFlatRate;

  // Calcul du prix en temps réel via la source unique de vérité
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
        setErrorMessage("Veuillez indiquer un nombre de pages valide (minimum 1).");
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
        window.scrollTo({ top: 120, behavior: "smooth" });
      }
    }
  };

  const goToPreviousStep = () => {
    setErrorMessage("");
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as any);
      window.scrollTo({ top: 120, behavior: "smooth" });
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

  // Navigation des étapes
  const steps = [
    { number: 1, title: "Type de document" },
    { number: 2, title: "Document & Données" },
    { number: 3, title: "Options & Tarifs" },
    { number: 4, title: "Récapitulatif" },
  ];

  return (
    <div className={`min-h-screen py-12 transition-colors duration-300 ${isDarkMode ? "bg-gray-950 text-gray-100" : "bg-gray-50 text-gray-800"}`}>
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* En-tête sobre et institutionnel */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-[#ba1728] bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 mb-3">
            <span>Cabinet d&apos;expertise judiciaire • Cour d&apos;Appel de Dijon</span>
          </div>
          <h1 className={`text-3xl sm:text-4xl font-extrabold tracking-tight mb-3 ${isDarkMode ? "text-white" : "text-[#1d1d1b]"}`}>
            Commande de Traduction Assermentée
          </h1>
          <p className="text-sm sm:text-base opacity-75 max-w-2xl mx-auto">
            Parcours officiel et transparent en 4 étapes pour la traduction certifiée de vos documents (Arabe ⇄ Français).
          </p>
        </div>

        {/* Indicateur de progression (Stepper) */}
        <nav aria-label="Progression de la commande" className="mb-12">
          <div className="flex items-center justify-between max-w-3xl mx-auto relative">
            {/* Ligne d'arrière-plan */}
            <div className="absolute top-5 left-8 right-8 h-0.5 bg-gray-200 dark:bg-gray-800 -z-0" />
            <div
              className="absolute top-5 left-8 h-0.5 bg-[#ba1728] transition-all duration-500 -z-0"
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
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                      isPassed
                        ? "bg-[#ba1728] text-white shadow-md shadow-red-900/20"
                        : isCurrent
                        ? "bg-[#ba1728] text-white ring-4 ring-red-100 dark:ring-red-950/60 shadow-lg"
                        : isDarkMode
                        ? "bg-gray-900 text-gray-500 border border-gray-800"
                        : "bg-white text-gray-400 border border-gray-200 shadow-sm"
                    }`}
                  >
                    {isPassed ? <FaCheck className="text-xs" /> : s.number}
                  </button>
                  <span
                    className={`mt-2 text-xs font-semibold text-center hidden sm:block ${
                      isCurrent
                        ? "text-[#ba1728] font-bold"
                        : isPassed
                        ? isDarkMode ? "text-gray-200" : "text-gray-700"
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

        {/* Message d'erreur s'il y a lieu */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm flex items-center gap-3 animate-fade-in">
            <FaInfoCircle className="flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Corps des étapes */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Colonne Principale (8 colonnes sur grand écran) */}
          <div className="lg:col-span-8">

            {/* ============================================================ */}
            {/* ÉTAPE 1 : TYPE DE DOCUMENT                                  */}
            {/* ============================================================ */}
            {currentStep === 1 && (
              <section className={`p-6 sm:p-8 rounded-3xl border ${isDarkMode ? "bg-gray-900/80 border-gray-800" : "bg-white border-gray-200"} shadow-sm`}>
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-1 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-[#ba1728] text-white text-xs flex items-center justify-center font-bold">1</span>
                    <span>Sélectionnez votre type de document</span>
                  </h2>
                  <p className="text-xs sm:text-sm opacity-70">
                    Les tarifs sont clairs et forfaitaires : 25 € pour le permis de conduire et le casier judiciaire, dès 30 € pour les autres actes avec barème dégressif.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                        className={`cursor-pointer p-4 rounded-2xl border-2 transition-all duration-200 relative flex flex-col justify-between ${
                          isSelected
                            ? "border-[#ba1728] bg-red-50/40 dark:bg-red-950/20 shadow-md ring-1 ring-[#ba1728]"
                            : isDarkMode
                            ? "border-gray-800 bg-gray-900/60 hover:border-gray-700 hover:bg-gray-800/40"
                            : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/60"
                        }`}
                      >
                        {doc.isFlatRate && (
                          <span className="absolute top-3 right-3 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            Forfait 25 €
                          </span>
                        )}
                        <div>
                          <div className="text-2xl mb-2">{doc.icon}</div>
                          <h3 className="font-bold text-sm mb-1">{doc.name}</h3>
                          <p className="text-xs opacity-70 leading-relaxed mb-3">
                            {doc.description}
                          </p>
                        </div>
                        <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs">
                          <span className="font-semibold text-gray-500">
                            {doc.isFlatRate ? "Tarif fixe :" : "Tarif standard :"}
                          </span>
                          <span className="font-extrabold text-[#ba1728]">
                            {doc.isFlatRate ? "25 €" : "30 € / page"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    type="button"
                    onClick={goToNextStep}
                    className="px-6 py-3 rounded-xl bg-[#ba1728] hover:bg-[#a01322] text-white font-bold text-sm flex items-center gap-2 shadow-md transition-all duration-200"
                  >
                    <span>Continuer vers le document</span>
                    <FaArrowRight className="text-xs" />
                  </button>
                </div>
              </section>
            )}

            {/* ============================================================ */}
            {/* ÉTAPE 2 : DOCUMENT ET INFORMATIONS                          */}
            {/* ============================================================ */}
            {currentStep === 2 && (
              <section className={`p-6 sm:p-8 rounded-3xl border ${isDarkMode ? "bg-gray-900/80 border-gray-800" : "bg-white border-gray-200"} shadow-sm space-y-6`}>
                <div>
                  <h2 className="text-xl font-bold mb-1 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-[#ba1728] text-white text-xs flex items-center justify-center font-bold">2</span>
                    <span>Transmettez votre document et vos coordonnées</span>
                  </h2>
                  <p className="text-xs sm:text-sm opacity-70">
                    Déposez les scans ou photographies nets de votre document. Une simple photo claire prise au smartphone convient parfaitement.
                  </p>
                </div>

                {/* Consignes pour photographier ou scanner */}
                <div className={`p-4 rounded-2xl border ${isDarkMode ? "bg-gray-800/50 border-gray-700" : "bg-amber-50/50 border-amber-200"} text-xs leading-relaxed`}>
                  <div className="font-bold flex items-center gap-2 text-amber-900 dark:text-amber-300 mb-2">
                    <FaLightbulb />
                    <span>Conseils pour une prise de vue conforme :</span>
                  </div>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-700 dark:text-gray-300">
                    <li className="flex items-start gap-1.5">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>Posez le document bien à plat sur une table bien éclairée.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>Assurez-vous que les 4 coins et les tampons sont bien visibles.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>Évitez les reflets de flash et les ombres portées de vos doigts.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>Formats acceptés : PDF haute définition, JPG, JPEG, PNG.</span>
                    </li>
                  </ul>
                </div>

                {/* Zone de téléversement */}
                <div className="border-2 border-dashed rounded-2xl p-6 text-center transition-colors border-gray-300 dark:border-gray-700 hover:border-[#ba1728]">
                  <FaCloudUploadAlt className="mx-auto text-4xl text-gray-400 mb-2" />
                  <p className="text-sm font-semibold mb-1">
                    Glissez-déposez vos fichiers ici, ou cliquez pour parcourir
                  </p>
                  <p className="text-xs opacity-60 mb-4">
                    PDF, JPG, JPEG ou PNG (plusieurs fichiers acceptés)
                  </p>
                  <label className="inline-block px-5 py-2.5 rounded-xl bg-[#ba1728] hover:bg-[#a01322] text-white text-xs font-bold cursor-pointer transition-colors shadow-sm">
                    {uploading ? "Téléversement en cours..." : "Sélectionner mes fichiers"}
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

                {/* Liste des fichiers téléversés */}
                {uploadedFiles.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider opacity-70 block">
                      Fichiers ajoutés ({uploadedFiles.length}) :
                    </span>
                    <div className="space-y-2">
                      {uploadedFiles.map((file, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center justify-between p-3 rounded-xl border text-xs ${isDarkMode ? "bg-gray-800/40 border-gray-700" : "bg-gray-50 border-gray-200"}`}
                        >
                          <div className="flex items-center gap-2.5 truncate pr-2">
                            <FaFileAlt className="text-[#ba1728] flex-shrink-0" />
                            <span className="font-medium truncate">{file.name}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteFile(file.path)}
                            className="text-red-500 hover:text-red-700 p-1 flex-shrink-0 transition-colors"
                            title="Supprimer ce fichier"
                          >
                            <FaTrash />
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
                      <label htmlFor="numberOfPagesInput" className="font-bold text-sm block">
                        Nombre total de pages à traduire
                      </label>
                      <p className="text-xs opacity-70">
                        {isFlatRate
                          ? "Forfait officiel fixé à 25 € pour ce document (recto-verso inclus)."
                          : "1 à 2 pages : 30 €/p • À partir de 3 pages : 25 €/p • Dès 10 pages : 20 €/p."}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        disabled={isFlatRate || numberOfPages <= 1}
                        onClick={() => setNumberOfPages((prev) => Math.max(1, prev - 1))}
                        className="w-9 h-9 rounded-lg border font-bold flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        -
                      </button>
                      <input
                        id="numberOfPagesInput"
                        type="number"
                        min="1"
                        disabled={isFlatRate}
                        value={isFlatRate ? 1 : numberOfPages}
                        onChange={(e) => setNumberOfPages(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-16 h-9 text-center font-bold text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent"
                      />
                      <button
                        type="button"
                        disabled={isFlatRate}
                        onClick={() => setNumberOfPages((prev) => prev + 1)}
                        className="w-9 h-9 rounded-lg border font-bold flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Coordonnées : Email */}
                <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                  <label htmlFor="clientEmailInput" className="font-bold text-sm block mb-1">
                    Adresse email de réception <span className="text-[#ba1728]">*</span>
                  </label>
                  <p className="text-xs opacity-70 mb-2">
                    Votre traduction officielle certifiée en PDF haute définition ainsi que votre reçu vous seront envoyés à cette adresse.
                  </p>
                  <input
                    id="clientEmailInput"
                    type="email"
                    value={mailClient}
                    onChange={(e) => setMailClient(e.target.value)}
                    placeholder="exemple@email.com"
                    className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent text-sm focus:ring-2 focus:ring-[#ba1728] focus:outline-none"
                    required
                  />
                </div>

                {/* Instructions / Commentaires */}
                <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                  <label htmlFor="clientCommentInput" className="font-bold text-sm block mb-1">
                    Instructions particulières (facultatif)
                  </label>
                  <p className="text-xs opacity-70 mb-2">
                    Indiquez par exemple l&apos;orthographe officielle des noms et prénoms selon le passeport si elle diffère du document.
                  </p>
                  <textarea
                    id="clientCommentInput"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                    placeholder="Précisions de transcription, urgence spécifique..."
                    className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent text-sm focus:ring-2 focus:ring-[#ba1728] focus:outline-none"
                  />
                </div>

                {/* Boutons d'étape */}
                <div className="mt-8 flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                  <button
                    type="button"
                    onClick={goToPreviousStep}
                    className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-xs font-bold flex items-center gap-2"
                  >
                    <FaArrowLeft className="text-xs" />
                    <span>Retour</span>
                  </button>
                  <button
                    type="button"
                    onClick={goToNextStep}
                    className="px-6 py-3 rounded-xl bg-[#ba1728] hover:bg-[#a01322] text-white font-bold text-sm flex items-center gap-2 shadow-md transition-all duration-200"
                  >
                    <span>Passer aux options &amp; tarifs</span>
                    <FaArrowRight className="text-xs" />
                  </button>
                </div>
              </section>
            )}

            {/* ============================================================ */}
            {/* ÉTAPE 3 : OPTIONS ET TARIFICATION                            */}
            {/* ============================================================ */}
            {currentStep === 3 && (
              <section className={`p-6 sm:p-8 rounded-3xl border ${isDarkMode ? "bg-gray-900/80 border-gray-800" : "bg-white border-gray-200"} shadow-sm space-y-8`}>
                <div>
                  <h2 className="text-xl font-bold mb-1 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-[#ba1728] text-white text-xs flex items-center justify-center font-bold">3</span>
                    <span>Modes de délivrance, délais et formalités</span>
                  </h2>
                  <p className="text-xs sm:text-sm opacity-70">
                    Choisissez votre mode de livraison et le niveau d&apos;urgence adapté à vos démarches administratives.
                  </p>
                </div>

                {/* Mode de délivrance / livraison */}
                <div>
                  <label className="font-bold text-sm block mb-3">
                    Mode de délivrance
                  </label>
                  <div className="space-y-2.5">
                    {DELIVERY_OPTIONS.map((opt) => {
                      const isSelected = selectedDelivery === opt.id;
                      return (
                        <div
                          key={opt.id}
                          onClick={() => setSelectedDelivery(opt.id)}
                          className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex items-center justify-between ${
                            isSelected
                              ? "border-[#ba1728] bg-red-50/30 dark:bg-red-950/20 shadow-xs ring-1 ring-[#ba1728]"
                              : isDarkMode
                              ? "border-gray-800 bg-gray-900/50 hover:border-gray-700"
                              : "border-gray-200 bg-white hover:border-gray-300"
                          }`}
                        >
                          <div>
                            <div className="font-bold text-sm flex items-center gap-2">
                              <span>{opt.name}</span>
                              {opt.price === 0 && (
                                <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                                  Inclus
                                </span>
                              )}
                            </div>
                            <p className="text-xs opacity-70 mt-0.5">{opt.description}</p>
                          </div>
                          <span className="font-extrabold text-sm ml-4 whitespace-nowrap text-[#ba1728]">
                            {opt.price === 0 ? "Gratuit" : `+ ${formatEuros(opt.price)}`}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Délai de traitement */}
                <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                  <label className="font-bold text-sm block mb-3">
                    Délai de traitement
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {URGENCY_OPTIONS.map((opt) => {
                      const isSelected = urgency === opt.id;
                      return (
                        <div
                          key={opt.id}
                          onClick={() => setUrgency(opt.id)}
                          className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex flex-col justify-between ${
                            isSelected
                              ? "border-[#ba1728] bg-red-50/30 dark:bg-red-950/20 ring-1 ring-[#ba1728]"
                              : isDarkMode
                              ? "border-gray-800 bg-gray-900/50 hover:border-gray-700"
                              : "border-gray-200 bg-white hover:border-gray-300"
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-sm">{opt.name}</span>
                              <span className="text-xs font-bold text-[#ba1728]">
                                {opt.price === 0 ? "Inclus" : `+ ${formatEuros(opt.price)}`}
                              </span>
                            </div>
                            <span className="inline-block text-[11px] font-semibold text-gray-500 mb-1">
                              {opt.delayText}
                            </span>
                            <p className="text-xs opacity-70">{opt.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Formalités de légalisation (si besoin) */}
                <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-1.5 mb-2">
                    <label htmlFor="legalizationSelect" className="font-bold text-sm">
                      Formalités de légalisation supplémentaires
                    </label>
                    <Tooltip text="Exigée uniquement par certaines ambassades étrangères ou pour des démarches internationales spécifiques. Non requise pour la quasi-totalité des démarches administratives en France." />
                  </div>
                  <select
                    id="legalizationSelect"
                    value={selectedLegalization}
                    onChange={(e) => setSelectedLegalization(e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent text-sm focus:ring-2 focus:ring-[#ba1728] focus:outline-none"
                  >
                    {LEGALIZATION_OPTIONS.map((leg) => (
                      <option key={leg.id} value={leg.id} className={isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}>
                        {leg.name} {leg.price > 0 ? `(+ ${formatEuros(leg.price)} / doc)` : "(Aucune - démarche courante)"}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Boutons d'étape */}
                <div className="mt-8 flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                  <button
                    type="button"
                    onClick={goToPreviousStep}
                    className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-xs font-bold flex items-center gap-2"
                  >
                    <FaArrowLeft className="text-xs" />
                    <span>Retour</span>
                  </button>
                  <button
                    type="button"
                    onClick={goToNextStep}
                    className="px-6 py-3 rounded-xl bg-[#ba1728] hover:bg-[#a01322] text-white font-bold text-sm flex items-center gap-2 shadow-md transition-all duration-200"
                  >
                    <span>Vérifier mon récapitulatif</span>
                    <FaArrowRight className="text-xs" />
                  </button>
                </div>
              </section>
            )}

            {/* ============================================================ */}
            {/* ÉTAPE 4 : RÉCAPITULATIF                                     */}
            {/* ============================================================ */}
            {currentStep === 4 && (
              <section className={`p-6 sm:p-8 rounded-3xl border ${isDarkMode ? "bg-gray-900/80 border-gray-800" : "bg-white border-gray-200"} shadow-sm space-y-6`}>
                <div>
                  <h2 className="text-xl font-bold mb-1 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-[#ba1728] text-white text-xs flex items-center justify-center font-bold">4</span>
                    <span>Vérification de votre commande avant validation</span>
                  </h2>
                  <p className="text-xs sm:text-sm opacity-70">
                    Vérifiez l&apos;exactitude des informations. Vous pouvez modifier chaque section d&apos;un simple clic.
                  </p>
                </div>

                {/* Bloc 1 : Document et Volume */}
                <div className={`p-5 rounded-2xl border ${isDarkMode ? "bg-gray-800/40 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Document à traduire</span>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="text-xs text-[#ba1728] hover:underline flex items-center gap-1 font-semibold"
                    >
                      <FaEdit /> Modifier
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-bold">{breakdown.documentName}</span>
                    <span className="text-xs opacity-75">
                      {breakdown.isFlatRate ? "Forfait officiel 25 €" : `${breakdown.numberOfPages} page(s) • ${breakdown.unitPricePerPage} €/page`}
                    </span>
                  </div>
                  <div className="mt-2 text-xs opacity-70">
                    Combinaison linguistique officielle : <strong>Arabe ⇄ Français</strong>
                  </div>
                </div>

                {/* Bloc 2 : Fichiers et Email */}
                <div className={`p-5 rounded-2xl border ${isDarkMode ? "bg-gray-800/40 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Fichiers &amp; Coordonnées</span>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="text-xs text-[#ba1728] hover:underline flex items-center gap-1 font-semibold"
                    >
                      <FaEdit /> Modifier
                    </button>
                  </div>
                  <div className="text-xs space-y-1.5">
                    <div>
                      <span className="text-gray-500">Email de réception :</span>{" "}
                      <span className="font-bold">{mailClient}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Fichiers transmis :</span>{" "}
                      <span className="font-medium">
                        {uploadedFiles.length > 0
                          ? uploadedFiles.map((f) => f.name).join(", ")
                          : "Aucun fichier téléversé pour l'instant"}
                      </span>
                    </div>
                    {comment && (
                      <div className="italic text-gray-500 pt-1">
                        &ldquo;{comment}&rdquo;
                      </div>
                    )}
                  </div>
                </div>

                {/* Bloc 3 : Options de livraison et délai */}
                <div className={`p-5 rounded-2xl border ${isDarkMode ? "bg-gray-800/40 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Options sélectionnées</span>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="text-xs text-[#ba1728] hover:underline flex items-center gap-1 font-semibold"
                    >
                      <FaEdit /> Modifier
                    </button>
                  </div>
                  <div className="text-xs space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Livraison :</span>
                      <span className="font-medium">{breakdown.deliveryName} ({breakdown.deliveryPrice === 0 ? "Inclus" : `+ ${formatEuros(breakdown.deliveryPrice)}`})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Délai :</span>
                      <span className="font-medium">{breakdown.urgencyName} ({breakdown.urgencyPrice === 0 ? "Inclus" : `+ ${formatEuros(breakdown.urgencyPrice)}`})</span>
                    </div>
                    {breakdown.legalizationPrice > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Légalisation :</span>
                        <span className="font-medium">{breakdown.legalizationName} (+ {formatEuros(breakdown.legalizationPrice)})</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bouton de validation vers la page Panier */}
                <div className="mt-8 flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                  <button
                    type="button"
                    onClick={goToPreviousStep}
                    className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-xs font-bold flex items-center gap-2"
                  >
                    <FaArrowLeft className="text-xs" />
                    <span>Retour aux options</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleFinalizeOrder}
                    className="px-7 py-3.5 rounded-xl bg-[#ba1728] hover:bg-[#a01322] text-white font-extrabold text-sm flex items-center gap-2 shadow-lg transition-all duration-200"
                  >
                    <span>Valider et procéder au paiement ({formatEuros(breakdown.totalPrice)})</span>
                    <FaArrowRight className="text-xs" />
                  </button>
                </div>
              </section>
            )}

          </div>

          {/* Colonne Latérale Droite : Décompte Tarifaire Transparent en Temps Réel */}
          <aside aria-label="Récapitulatif tarifaire" className="lg:col-span-4 sticky top-8">
            <div className={`p-6 rounded-3xl border shadow-lg ${isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"}`}>
              <h3 className="text-base font-extrabold mb-4 pb-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <span>Détail du calcul</span>
                <span className="text-xs font-semibold text-gray-500">TVA non applicable</span>
              </h3>

              <div className="space-y-3 text-xs">
                {/* Ligne traduction */}
                <div className="flex justify-between">
                  <span className="text-gray-500">
                    {breakdown.isFlatRate
                      ? "Forfait traduction officielle"
                      : `Traduction (${breakdown.numberOfPages} p. × ${breakdown.unitPricePerPage} €)`}
                  </span>
                  <span className="font-bold">{formatEuros(breakdown.translationPrice)}</span>
                </div>

                {/* Remise dégressive affichée si applicable */}
                {breakdown.volumeDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span>Remise volume dégressif</span>
                    <span>- {formatEuros(breakdown.volumeDiscount)}</span>
                  </div>
                )}

                {/* Ligne livraison */}
                <div className="flex justify-between">
                  <span className="text-gray-500">Frais de délivrance / port</span>
                  <span className="font-medium">
                    {breakdown.deliveryPrice === 0 ? "Gratuit (Email)" : formatEuros(breakdown.deliveryPrice)}
                  </span>
                </div>

                {/* Ligne légalisation */}
                {breakdown.legalizationPrice > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Frais de légalisation</span>
                    <span className="font-medium">{formatEuros(breakdown.legalizationPrice)}</span>
                  </div>
                )}

                {/* Ligne urgence */}
                {breakdown.urgencyPrice > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Option Express (&lt; 12h)</span>
                    <span className="font-medium">{formatEuros(breakdown.urgencyPrice)}</span>
                  </div>
                )}

                {/* Total certifié */}
                <div className="pt-4 mt-2 border-t-2 border-gray-100 dark:border-gray-800 flex items-baseline justify-between">
                  <div>
                    <span className="text-sm font-extrabold block text-gray-900 dark:text-white">
                      Montant total net
                    </span>
                    <span className="text-[11px] text-gray-400">
                      Art. 293 B du CGI
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-[#ba1728]">
                      {formatEuros(breakdown.totalPrice)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Réassurance institutionnelle */}
              <div className="mt-6 pt-5 border-t border-gray-100 dark:border-gray-800 space-y-2.5 text-[11px] text-gray-500">
                <div className="flex items-center gap-2">
                  <FaGavel className="text-[#ba1728] flex-shrink-0" />
                  <span>Aicha Salhi, traductrice assermentée près la Cour d&apos;Appel de Dijon</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaLock className="text-emerald-600 flex-shrink-0" />
                  <span>Paiement sécurisé et chiffré par Stripe</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaShieldAlt className="text-blue-600 flex-shrink-0" />
                  <span>Confidentialité et secret professionnel garantis</span>
                </div>
              </div>
            </div>
          </aside>

        </div>
      </main>
    </div>
  );
}

export default function Services() {
  return (
    <Suspense fallback={<div className="min-h-screen py-20 text-center text-sm opacity-50">Chargement du formulaire...</div>}>
      <ServicesContent />
    </Suspense>
  );
}
