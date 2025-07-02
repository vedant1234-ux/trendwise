import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface Article {
    _id: string;
    title: string;
    slug: string;
    metaDescription: string;
    ogImage: string;
    author: string;
    publishedAt: string;
    tags: string[];
    content: string;
    createdAt?: string;
}

interface ArticleCardProps {
    article: Article;
}

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop";

export default function ArticleCard({ article }: ArticleCardProps) {
    const [imgSrc, setImgSrc] = useState(article.ogImage || DEFAULT_IMAGE);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatDateTime = (dateString: string) => {
        if (!dateString) return 'Date unavailable';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Date unavailable';
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
        });
    };

    return (
        <Link href={`/article/${article.slug}`} className="group">
            <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                    <Image
                        src={imgSrc}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={() => setImgSrc(DEFAULT_IMAGE)}
                    />
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-3">
                        {(article?.tags || []).slice(0, 3).map((tag, index) => (
                            <span key={index} className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {article.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {((article?.metaDescription || article?.content || '') + '').slice(0, 150)}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{article.author}</span>
                        <p className="text-xs text-gray-500">
                            {formatDateTime(article.publishedAt || article.createdAt || '')}
                        </p>
                    </div>
                </div>
            </article>
        </Link>
    );
} 