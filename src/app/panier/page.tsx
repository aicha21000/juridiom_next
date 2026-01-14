import Panier from "@/components/Panier";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Votre Panier | Traduction en Arabe Aicha Salhi",
    robots: {
        index: false,
        follow: false,
    },
};

export default function Page() {
    return <Panier />;
}
