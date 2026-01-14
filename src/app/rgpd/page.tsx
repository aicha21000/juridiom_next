import RGPD from "@/components/RGPD";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "RGPD & Confidentialité | Traduction en Arabe Aicha Salhi",
    description: "Politique de confidentialité et conformité RGPD pour la protection de vos données personnelles.",
    alternates: {
        canonical: "https://traductionenarabe.fr/rgpd",
    },
};

export default function Page() {
    return <RGPD />;
}
