import SSL from "@/components/SSL";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sécurité SSL | Traduction en Arabe Aicha Salhi",
    description: "Informations sur la sécurité SSL et la protection de vos données sur notre site de traduction.",
    alternates: {
        canonical: "https://traductionenarabe.fr/securite-ssl",
    },
};

export default function Page() {
    return <SSL />;
}
