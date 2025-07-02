'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import ArticleCard from './ArticleCard';

interface Article {
    _id: string;
    title: string;
    slug: string;
    metaDescription: string;
    ogImage: string;
    author: string;
    publishedAt: string;
    tags: string[];
}

export default function ArticleList() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const searchParams = useSearchParams();
    const query = searchParams.get('q');

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                setLoading(true);
                const url = query
                    ? `/api/article?q=${encodeURIComponent(query)}`
                    : '/api/article';

                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Failed to fetch articles');
                }

                const data = await response.json();
                setArticles(data.articles || []);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
                // Fallback to sample data for demo
                setArticles([
                    {
                        _id: '1',
                        title: 'The Future of Artificial Intelligence in 2024',
                        slug: 'ai-future-2024',
                        metaDescription: 'Discover how AI is transforming industries and reshaping our digital landscape with cutting-edge technologies.',
                        ogImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
                        author: 'TrendWise AI',
                        publishedAt: new Date().toISOString(),
                        tags: ['AI', 'Technology', 'Future']
                    },
                    {
                        _id: '2',
                        title: 'Sustainable Technology: Green Computing Trends',
                        slug: 'sustainable-tech-2024',
                        metaDescription: 'Explore the latest trends in sustainable technology and how green computing is shaping the future of tech.',
                        ogImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop',
                        author: 'TrendWise AI',
                        publishedAt: new Date(Date.now() - 86400000).toISOString(),
                        tags: ['Sustainability', 'Technology', 'Green Computing']
                    },
                    {
                        _id: '3',
                        title: 'Remote Work Revolution: The New Normal',
                        slug: 'remote-work-revolution',
                        metaDescription: 'How remote work is changing the corporate landscape and what the future holds for workplace flexibility.',
                        ogImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop',
                        author: 'TrendWise AI',
                        publishedAt: new Date(Date.now() - 172800000).toISOString(),
                        tags: ['Remote Work', 'Business', 'Workplace']
                    }
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, [query]);

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                        <div className="h-48 bg-gray-200"></div>
                        <div className="p-6">
                            <div className="h-4 bg-gray-200 rounded mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
                            <div className="h-3 bg-gray-200 rounded mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-red-600 mb-4">Error: {error}</p>
                <p className="text-gray-600">Showing sample articles for demonstration.</p>
            </div>
        );
    }

    if (articles.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-600">No articles found.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
                <ArticleCard key={article._id} article={article} />
            ))}
        </div>
    );
} 