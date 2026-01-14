import Devis from "@/components/Devis";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Demander un Devis | Traduction en Arabe Aicha Salhi",
    description: "Demandez un devis gratuit pour vos traductions français-arabe. Réponse rapide et tarifs transparents.",
    robots: {
        index: false,
        follow: false,
    },
};

export default function Page() {
    return <Devis />;
}
