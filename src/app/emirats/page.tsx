import Emirats from "@/components/Emirats";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Légalisation Documents Émirats Arabes Unis | Aicha Salhi",
    description: "Service complet de traduction et légalisation de documents officiels pour les Émirats Arabes Unis. Traduction certifiée, Mairie, Ministère et Ambassade.",
    alternates: {
        canonical: "https://traductionenarabe.fr/Emirats",
    },
};

export default function Page() {
    return <Emirats />;
}
