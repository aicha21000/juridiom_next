import Legal from "@/components/Legal";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Mentions légales | Traduction en Arabe Aicha Salhi",
    description: "Mentions légales: identification de l'éditeur, hébergeur, propriété intellectuelle, responsabilité, RGPD.",
    alternates: {
        canonical: "https://traductionenarabe.fr/legal",
    },
};

export default function Page() {
    return <Legal />;
}
