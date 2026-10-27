import Home from "@/components/Home";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Traductrice Assermentée Arabe Dijon | Traduction Certifiée – Aicha Salhi",
  description: "Traductrice assermentée arabe-français à Dijon. Plus de 10 ans d'expérience en traductions juridiques, commerciales et administratives certifiées. Aicha Salhi, experte près la Cour d'Appel de Dijon.",
  alternates: {
    canonical: "https://traductionenarabe.fr",
  },
  openGraph: {
    title: "Traductrice Assermentée Arabe Dijon | Traduction Certifiée – Aicha Salhi",
    description: "Traductrice assermentée arabe-français à Dijon. Traductions juridiques, commerciales et certifiées depuis plus de 10 ans.",
    url: "https://traductionenarabe.fr",
    siteName: "Aicha Salhi Traduction",
    locale: "fr_FR",
    type: "website",
  },
};

const homeSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "Aicha Salhi – Traductrice Assermentée Arabe",
  "alternateName": "Traduction en Arabe Aicha Salhi",
  "url": "https://traductionenarabe.fr",
  "logo": "https://traductionenarabe.fr/assets/logo.svg",
  "image": "https://traductionenarabe.fr/assets/logo.svg",
  "description": "Traductrice assermentée arabe-français près la Cour d'Appel de Dijon. Traductions certifiées conformes de documents officiels, juridiques, commerciaux et état civil à Dijon et Longvic.",
  "telephone": "+33669151216",
  "email": "contact@traductionenarabe.fr",
  "priceRange": "€€",
  "hasCredential": "Traductrice-interprète assermentée près la Cour d'Appel de Dijon",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "10 Avenue Jean Baptiste Greuze",
    "addressLocality": "Dijon",
    "postalCode": "21000",
    "addressCountry": "FR"
  },
  "location": [
    {
      "@type": "Place",
      "name": "Siège administratif – Dijon",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "10 Avenue Jean Baptiste Greuze",
        "addressLocality": "Dijon",
        "postalCode": "21000",
        "addressCountry": "FR"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 47.330855,
        "longitude": 5.053896
      }
    },
    {
      "@type": "Place",
      "name": "Bureau d'accueil – Longvic (Grand Dijon)",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Centre d'Affaires Regus, 8 Chemin De La Noue",
        "addressLocality": "Longvic",
        "postalCode": "21600",
        "addressCountry": "FR"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 47.295,
        "longitude": 5.076
      }
    }
  ],
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 47.330855,
    "longitude": 5.053896
  },
  "areaServed": [
    "Dijon",
    "Longvic",
    "Grand Dijon",
    "Côte-d'Or",
    "Bourgogne-Franche-Comté",
    "France"
  ],
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    "opens": "09:00",
    "closes": "18:00"
  }
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeSchema) }}
      />
      <Home />
    </>
  );
}
