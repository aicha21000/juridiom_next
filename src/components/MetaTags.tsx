import React from 'react';
import { Helmet } from 'react-helmet-async';

interface MetaTagsProps {
    title: string;
    description: string;
    keywords?: string;
    canonicalUrl?: string;
    ogImage?: string;
    ogType?: string;
}

const MetaTags: React.FC<MetaTagsProps> = ({
    title,
    description,
    keywords = '',
    canonicalUrl = 'https://traductionenarabe.fr',
    ogImage = 'https://traductionenarabe.fr/default-img',
    ogType = 'website'
}) => {
    const fullTitle = `${title} | Traduction en Arabe Aicha Salhi`;
    const fullCanonicalUrl = canonicalUrl.startsWith('http') ? canonicalUrl : `https://traductionenarabe.fr${canonicalUrl}`;

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            {keywords && <meta name="keywords" content={keywords} />}
            <link rel="canonical" href={fullCanonicalUrl} />

            {/* Open Graph Meta Tags */}
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:type" content={ogType} />
            <meta property="og:url" content={fullCanonicalUrl} />
            <meta property="og:image" content={ogImage} />
            <meta property="og:site_name" content="Juridiom" />

            {/* Twitter Card Meta Tags */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={ogImage} />
            <meta name="twitter:site" content="@Juridiom" />
        </Helmet>
    );
};

export default MetaTags; 