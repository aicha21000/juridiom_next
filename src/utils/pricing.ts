// Source unique et sécurisée de vérité pour la tarification officielle
// juridiom / traductionenarabe.fr - Aicha Salhi, Traductrice Assermentée

export type DocumentTypeId =
  | "acte_naissance"
  | "acte_mariage"
  | "acte_deces"
  | "jugement_divorce"
  | "permis"
  | "casier"
  | "diplome"
  | "autre";

export interface DocumentTypeOption {
  id: DocumentTypeId;
  name: string;
  category: "civil" | "judiciaire" | "administratif" | "autre";
  description: string;
  icon: string;
  isFlatRate?: boolean;
  flatPrice?: number;
}

export const DOCUMENT_TYPES: DocumentTypeOption[] = [
  {
    id: "acte_naissance",
    name: "Acte de naissance",
    category: "civil",
    description: "Copie intégrale ou extrait pour préfecture, nationalité, mariage",
    icon: "📜",
  },
  {
    id: "acte_mariage",
    name: "Acte de mariage",
    category: "civil",
    description: "Livret de famille, certificat de mariage, transcription",
    icon: "💍",
  },
  {
    id: "acte_deces",
    name: "Acte de décès",
    category: "civil",
    description: "Certificat de décès pour successions, assurances et consulats",
    icon: "🕊️",
  },
  {
    id: "jugement_divorce",
    name: "Jugement de divorce",
    category: "judiciaire",
    description: "Décision judiciaire, ordonnance, kafala, acte notarié",
    icon: "⚖️",
  },
  {
    id: "permis",
    name: "Permis de conduire",
    category: "administratif",
    description: "Échange de permis étranger auprès de l'ANTS et des préfectures",
    icon: "🚗",
    isFlatRate: true,
    flatPrice: 25,
  },
  {
    id: "casier",
    name: "Casier judiciaire",
    category: "judiciaire",
    description: "Bulletin officiel pour titre de séjour, naturalisation ou emploi",
    icon: "🏛️",
    isFlatRate: true,
    flatPrice: 25,
  },
  {
    id: "diplome",
    name: "Diplôme & Relevé de notes",
    category: "administratif",
    description: "Baccalauréat, licence, master, équivalences et ordres professionnels",
    icon: "🎓",
  },
  {
    id: "autre",
    name: "Autre document",
    category: "autre",
    description: "Attestation, contrat, relevé bancaire, certificat médical",
    icon: "📄",
  },
];

export interface DeliveryOption {
  id: string;
  name: string;
  description: string;
  price: number;
}

export const DELIVERY_OPTIONS: DeliveryOption[] = [
  { id: "email", name: "Format Numérique (Email)", description: "PDF certifié haute définition avec sceau et signature", price: 0 },
  { id: "standard", name: "Courrier suivi à domicile", description: "Envoi postal en France métropolitaine (2-3 jours ouvrés)", price: 10 },
  { id: "priority", name: "Lettre recommandée / Prioritaire", description: "Remise contre signature avec suivi prioritaire", price: 15 },
  { id: "international", name: "Envoi postal international", description: "Europe, Maghreb et international", price: 20 },
  { id: "dhl", name: "Courrier Express DHL", description: "Livraison sécurisée express en 24h à 48h", price: 100 },
];

export interface LegalizationOption {
  id: string;
  name: string;
  description: string;
  price: number;
}

export const LEGALIZATION_OPTIONS: LegalizationOption[] = [
  { id: "none", name: "Aucune légalisation", description: "Pour les démarches administratives françaises courantes", price: 0 },
  { id: "mairie", name: "Certification matérielle en Mairie", description: "Attestation d'authenticité de la signature de la traductrice", price: 20 },
  { id: "chamberOfCommerce", name: "Chambre de Commerce (CCI)", description: "Pour documents commerciaux, d'entreprise et d'export", price: 50 },
  { id: "foreignAffairs", name: "Ministère des Affaires Étrangères", description: "Apostille ou légalisation officielle MEAE", price: 40 },
  { id: "consulate", name: "Consulat & Ambassade", description: "Démarches consulaires pour pays non signataires de La Haye", price: 80 },
];

export interface UrgencyOption {
  id: "standard" | "express";
  name: string;
  delayText: string;
  description: string;
  price: number;
}

export const URGENCY_OPTIONS: UrgencyOption[] = [
  { id: "standard", name: "Délai Standard", delayText: "24h à 48h ouvrées", description: "Traitement soigné et rigoureux", price: 0 },
  { id: "express", name: "Option Urgence Express", delayText: "< 12h / Jour même", description: "Prise en charge prioritaire immédiate", price: 15 },
];

export interface CalculationParams {
  documentType?: string;
  numberOfPages: number;
  numberOfDocuments?: number;
  deliveryMethod?: string;
  legalization?: string;
  urgency?: string;
}

export interface DetailedPriceBreakdown {
  documentType: string;
  documentName: string;
  numberOfPages: number;
  numberOfDocuments: number;
  isFlatRate: boolean;
  unitPricePerPage: number;
  standardGrossPrice: number;
  translationPrice: number;
  volumeDiscount: number;
  deliveryMethod: string;
  deliveryName: string;
  deliveryPrice: number;
  legalization: string;
  legalizationName: string;
  legalizationPrice: number;
  urgency: "standard" | "express";
  urgencyName: string;
  urgencyPrice: number;
  totalPrice: number;
}

/**
 * Calcul officiel et centralisé du prix d'une traduction certifiée.
 * Utilisé à la fois côté client et côté serveur (API calculate-price & Stripe session).
 */
export function calculateOrderPrice(params: CalculationParams): DetailedPriceBreakdown {
  const docTypeStr = params.documentType || "autre";
  const matchedDoc = DOCUMENT_TYPES.find((d) => d.id === docTypeStr);
  const documentName = matchedDoc ? matchedDoc.name : "Document officiel";
  const isFlatRate = docTypeStr === "permis" || docTypeStr === "casier";

  const numPages = Math.max(1, Math.round(Number(params.numberOfPages) || 1));
  const numDocs = Math.max(1, Math.round(Number(params.numberOfDocuments) || 1));

  let unitPricePerPage = 30;
  let translationPrice = 30;
  let standardGrossPrice = 30 * numPages;
  let volumeDiscount = 0;

  if (isFlatRate) {
    unitPricePerPage = 25;
    translationPrice = 25; // Forfait fixe officiel de 25 €
    standardGrossPrice = 25;
    volumeDiscount = 0;
  } else {
    if (numPages >= 10) {
      unitPricePerPage = 20;
    } else if (numPages >= 3) {
      unitPricePerPage = 25;
    } else {
      unitPricePerPage = 30;
    }
    translationPrice = unitPricePerPage * numPages;
    volumeDiscount = Math.max(0, standardGrossPrice - translationPrice);
  }

  const deliveryMethod = params.deliveryMethod || "email";
  const matchedDelivery = DELIVERY_OPTIONS.find((d) => d.id === deliveryMethod) || DELIVERY_OPTIONS[0];
  const deliveryPrice = matchedDelivery.price;
  const deliveryName = matchedDelivery.name;

  const legalization = params.legalization || "none";
  const matchedLegalization = LEGALIZATION_OPTIONS.find((l) => l.id === legalization) || LEGALIZATION_OPTIONS[0];
  const legalizationUnitPrice = matchedLegalization.price;
  const legalizationPrice = legalizationUnitPrice * numDocs;
  const legalizationName = matchedLegalization.name;

  const urgencyId: "standard" | "express" = params.urgency === "express" ? "express" : "standard";
  const matchedUrgency = URGENCY_OPTIONS.find((u) => u.id === urgencyId) || URGENCY_OPTIONS[0];
  const urgencyPrice = matchedUrgency.price;
  const urgencyName = matchedUrgency.name;

  const totalPrice = translationPrice + deliveryPrice + legalizationPrice + urgencyPrice;

  return {
    documentType: docTypeStr,
    documentName,
    numberOfPages: isFlatRate ? 1 : numPages,
    numberOfDocuments: numDocs,
    isFlatRate,
    unitPricePerPage,
    standardGrossPrice,
    translationPrice,
    volumeDiscount,
    deliveryMethod,
    deliveryName,
    deliveryPrice,
    legalization,
    legalizationName,
    legalizationPrice,
    urgency: urgencyId,
    urgencyName,
    urgencyPrice,
    totalPrice,
  };
}

/** Formate un montant en euros propre (ex: 25,00 € ou 30 €) */
export function formatEuros(amount: number, forceDecimals = true): string {
  if (forceDecimals || amount % 1 !== 0) {
    return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", minimumFractionDigits: 2 }).format(amount);
  }
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", minimumFractionDigits: 0 }).format(amount);
}
