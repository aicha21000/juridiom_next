import CGU from "@/components/CGU";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Conditions Générales d'Utilisation | Traduction en Arabe Aicha Salhi",
    description: "Conditions générales d'utilisation des services de traduction Aicha Salhi.",
    alternates: {
        canonical: "https://traductionenarabe.fr/cgu",
    },
};

export default function Page() {
    return <CGU />;
}
