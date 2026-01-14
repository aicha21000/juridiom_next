import AdminDashboard from "@/components/AdminDashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Administration | Juridiom",
    robots: {
        index: false,
        follow: false,
    },
};

export default function AdminPage() {
    return <AdminDashboard />;
}
