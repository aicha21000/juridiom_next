import Dijon from "@/components/Dijon";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Traduction Arabe à Dijon | Aicha Salhi",
    description: "Traductrice professionnelle à Dijon. Traductions certifiées français-arabe, délais rapides, légalisation et remise sécurisée des documents.",
    alternates: {
        canonical: "https://traductionenarabe.fr/traduction-arabe-dijon",
    },
};

export default function Page() {
    return <Dijon />;
}
