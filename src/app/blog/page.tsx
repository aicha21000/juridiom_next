import { getAllArticles } from "@/lib/blog";
import BlogList from "@/components/BlogList";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Blog - Actualités et Conseils en Traduction | Aicha Salhi",
    description: "Découvrez nos derniers articles sur la traduction certifiée, la légalisation de documents et des conseils pour vos démarches administratives.",
    alternates: {
        canonical: "https://traductionenarabe.fr/blog",
    },
};

export default function Page() {
    const articles = getAllArticles();
    return <BlogList articles={articles} />;
}
