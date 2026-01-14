import Login from "@/components/Login";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Connexion | Aicha Salhi Traduction",
    description: "Accédez à votre espace client pour suivre vos commandes.",
    robots: {
        index: false,
        follow: false,
    },
};

export default function LoginPage() {
    return <Login />;
}
