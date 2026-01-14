import Services from "@/components/Services";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Nos Services et Tarifs - Traduction en Arabe | Aicha Salhi",
    description: "Consultez nos tarifs de traduction certifiée. Devis immédiat en ligne pour vos documents officiels, actes de naissance, jugements et diplômes.",
    alternates: {
        canonical: "https://traductionenarabe.fr/services",
    },
};

export default function Page() {
    return <Services />;
}
