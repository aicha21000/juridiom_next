import Payment from "@/components/Payment";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Paiement Réussi | Traduction en Arabe Aicha Salhi",
    robots: {
        index: false,
        follow: false,
    },
};

export default function Page() {
    return <Payment />;
}
