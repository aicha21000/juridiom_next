import Home from "@/components/Home";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aicha Salhi | Traductrice Français-Arabe à Dijon",
  description: "Expertise en traduction français-arabe avec plus de 10 ans d'expérience. Traductions juridiques, commerciales et administratives certifiées à Dijon et partout en France.",
  alternates: {
    canonical: "https://traductionenarabe.fr",
  },
  openGraph: {
    title: "Aicha Salhi | Traductrice Français-Arabe à Dijon",
    description: "Expertise en traduction français-arabe avec plus de 10 ans d'expérience. Traductions certifiées et professionnelles.",
    url: "https://traductionenarabe.fr",
    siteName: "Aicha Salhi Traduction",
    locale: "fr_FR",
    type: "website",
  },
};

export default function Page() {
  return <Home />;
}
