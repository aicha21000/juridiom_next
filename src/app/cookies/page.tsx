import CookiesPage from "@/components/Cookies";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Politique de Cookies | Traduction en Arabe Aicha Salhi",
    description: "Informations sur l'utilisation des cookies sur notre site de traduction.",
    alternates: {
        canonical: "https://traductionenarabe.fr/cookies",
    },
};

export default function Page() {
    return <CookiesPage />;
}
