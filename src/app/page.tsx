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

export default function Page() {
  return <Home />;
}
