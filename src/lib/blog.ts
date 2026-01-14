import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'src/content/articles');

export interface Article {
    slug: string;
    title: string;
    date: string;
    author: string;
    summary: string;
    content: string;
    tags?: string[];
    imageUrl?: string;
}

export function getAllArticles(): Article[] {
    // Create directory if it doesn't exist to avoid errors
    if (!fs.existsSync(postsDirectory)) {
        return [];
    }

    const fileNames = fs.readdirSync(postsDirectory);
    const allArticlesData = fileNames.filter(fileName => fileName.endsWith('.md')).map((fileName) => {
        const slug = fileName.replace(/\.md$/, '');
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');

        const { data, content } = matter(fileContents);

        return {
            slug,
            content,
            title: data.title || 'Sans titre',
            date: data.date || new Date().toISOString(),
            author: data.author || 'Aicha Salhi',
            summary: data.summary || '',
            tags: data.tags || [],
            imageUrl: data.imageUrl || null,
            ...data,
        } as Article;
    });

    return allArticlesData.sort((a, b) => {
        if (a.date < b.date) {
            return 1;
        } else {
            return -1;
        }
    });
}

export function getArticleBySlug(slug: string): Article | null {
    try {
        const fullPath = path.join(postsDirectory, `${slug}.md`);
        if (!fs.existsSync(fullPath)) {
            return null;
        }
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);

        return {
            slug,
            content,
            title: data.title,
            date: data.date,
            author: data.author,
            summary: data.summary,
            tags: data.tags || [],
            imageUrl: data.imageUrl || null,
            ...data,
        } as Article;
    } catch (err) {
        return null;
    }
}
