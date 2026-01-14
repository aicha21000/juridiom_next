import About from "@/components/About";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "À Propos | Traduction en Arabe Aicha Salhi",
    description: "Découvrez Aicha Salhi, traductrice-interprète assermentée à Dijon, spécialisée en traduction français-arabe. Services professionnels et personnalisés.",
    keywords: "traductrice assermentée, Aicha Salhi, traduction français-arabe, Dijon, interprète",
    alternates: {
        canonical: "https://traductionenarabe.fr/about",
    },
};

export default function Page() {
    return <About />;
}
