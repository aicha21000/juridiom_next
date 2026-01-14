import Contact from "@/components/Contact";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contactez-nous | Traduction en Arabe Aicha Salhi",
    description: "Vous avez une question sur nos services de traduction ? Contactez-nous via le formulaire, par email ou par téléphone pour toute demande d'information.",
    alternates: {
        canonical: "https://traductionenarabe.fr/contact",
    },
};

export default function Page() {
    return <Contact />;
}
