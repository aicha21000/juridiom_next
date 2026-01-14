import Confirmation from "@/components/Confirmation";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Confirmation | Traduction en Arabe Aicha Salhi",
    robots: {
        index: false,
        follow: false,
    },
};

export default function Page() {
    return <Confirmation />;
}
