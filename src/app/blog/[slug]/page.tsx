import BlogPost from "@/components/BlogPost";
import { getArticleBySlug } from "@/lib/blog";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const article = getArticleBySlug(slug);

    if (!article) {
        return {
            title: "Article non trouvé | Traduction en Arabe Aicha Salhi",
        };
    }

    return {
        title: `${article.title} | Traduction en Arabe Aicha Salhi`,
        description: article.summary,
        openGraph: {
            title: article.title,
            description: article.summary,
            type: "article",
            images: article.imageUrl ? [article.imageUrl] : [],
        },
        alternates: {
            canonical: `https://traductionenarabe.fr/blog/${article.slug}`,
        },
    };
}

export default async function Page({ params }: Props) {
    const { slug } = await params;
    const article = getArticleBySlug(slug);

    if (!article) {
        notFound();
    }

    return <BlogPost article={article} />;
}
