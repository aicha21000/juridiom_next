import Payment from "@/components/Payment";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Paiement Réussi | Traduction en Arabe Aicha Salhi",
    robots: {
        index: false,
        follow: false,
    },
};

export default function Page() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-gray-900 text-white flex items-center justify-center"><p>Chargement...</p></div>}>
            <Payment />
        </Suspense>
    );
}
