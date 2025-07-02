import Head from 'next/head';

interface SEOProps {
    title: string;
    description: string;
    image?: string;
    type?: 'website' | 'article';
    url?: string;
}

export default function SEO({
    title,
    description,
    image,
    type = 'website',
    url
}: SEOProps) {
    const siteUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
    const defaultImage = `${siteUrl}/og-image.jpg`;

    return (
        <Head>
            {/* Basic Meta Tags */}
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="viewport" content="width=device-width, initial-scale=1" />

            {/* Open Graph Meta Tags */}
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:type" content={type} />
            <meta property="og:url" content={fullUrl} />
            <meta property="og:image" content={image || defaultImage} />
            <meta property="og:site_name" content="TrendWise" />

            {/* Twitter Meta Tags */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image || defaultImage} />

            {/* Additional Meta Tags */}
            <meta name="robots" content="index, follow" />
            <meta name="author" content="TrendWise" />

            {/* Canonical URL */}
            <link rel="canonical" href={fullUrl} />
        </Head>
    );
} 