import { AuthProvider } from "@/context/AuthContext";

export default function ClientDashboardLayout({ children }: { children: React.ReactNode }) {
    return <AuthProvider>{children}</AuthProvider>;
}
