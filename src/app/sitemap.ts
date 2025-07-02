import dbConnect from '@/lib/mongodb';
import Article from '@/models/Article';
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

    try {
        await dbConnect();

        // Fetch all articles
        const articles = await Article.find({}, 'slug updatedAt').lean();

        // Static pages
        const staticPages = [
            {
                url: baseUrl,
                lastModified: new Date(),
                changeFrequency: 'daily' as const,
                priority: 1,
            },
            {
                url: `${baseUrl}/login`,
                lastModified: new Date(),
                changeFrequency: 'monthly' as const,
                priority: 0.5,
            },
        ];

        // Article pages
        const articlePages = articles.map((article) => ({
            url: `${baseUrl}/article/${article.slug}`,
            lastModified: new Date(article.updatedAt),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        }));

        return [...staticPages, ...articlePages];
    } catch (error) {
        console.error('Error generating sitemap:', error);

        // Fallback sitemap
        return [
            {
                url: baseUrl,
                lastModified: new Date(),
                changeFrequency: 'daily',
                priority: 1,
            },
        ];
    }
} 