import FAQ from "@/components/FAQ";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Questions Fréquentes (FAQ) | Traduction en Arabe Aicha Salhi",
    description: "Trouvez des réponses à vos questions sur les traductions certifiées, les délais, les tarifs et les démarches de légalisation.",
    alternates: {
        canonical: "https://traductionenarabe.fr/faq",
    },
};

export default function Page() {
    return <FAQ />;
}
