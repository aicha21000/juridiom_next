import Dashboard from "@/components/Dashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Mon Tableau de Bord | Aicha Salhi Traduction",
    description: "Gérez vos commandes et informations personnelles.",
    robots: {
        index: false,
        follow: false,
    },
};

export default function DashboardPage() {
    return <Dashboard />;
}
