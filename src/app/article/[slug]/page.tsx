import CommentSection from '@/components/CommentSection';
import SEO from '@/components/SEO';
import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';

interface ArticlePageProps {
    params: {
        slug: string;
    };
}

// This would normally fetch from your API
async function getArticle(slug: string) {
    try {
        const response = await fetch(`${process.env.NEXTAUTH_URL}/api/article?slug=${slug}`, {
            cache: 'no-store'
        });

        if (!response.ok) {
            return null;
        }

        const data = await response.json();
        return data.article;
    } catch (error) {
        console.error('Error fetching article:', error);
        return null;
    }
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
    const article = await getArticle(params.slug);

    if (!article) {
        return {
            title: 'Article Not Found - TrendWise',
            description: 'The requested article could not be found.',
        };
    }

    return {
        title: `${article.title} - TrendWise`,
        description: article.metaDescription,
        openGraph: {
            title: article.title,
            description: article.metaDescription,
            images: [article.ogImage],
            type: 'article',
            publishedTime: article.publishedAt,
            authors: [article.author],
        },
        twitter: {
            card: 'summary_large_image',
            title: article.title,
            description: article.metaDescription,
            images: [article.ogImage],
        },
    };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
    const article = await getArticle(params.slug);

    if (!article) {
        notFound();
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <>
            <SEO
                title={article.title}
                description={article.metaDescription}
                image={article.ogImage}
                type="article"
            />

            <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <header className="mb-8">
                    <div className="mb-4">
                        {article.tags.map((tag) => (
                            <span
                                key={tag}
                                className="inline-block px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full mr-2 mb-2"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>

                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        {article.title}
                    </h1>

                    <div className="flex items-center text-gray-600 mb-6">
                        <span>By {article.author}</span>
                        <span className="mx-2">•</span>
                        <span>{formatDate(article.publishedAt)}</span>
                    </div>

                    <p className="text-xl text-gray-600 mb-6">
                        {article.metaDescription}
                    </p>
                </header>

                {/* Featured Image */}
                <div className="relative h-96 mb-8 rounded-lg overflow-hidden">
                    <Image
                        src={article.ogImage}
                        alt={article.title}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

                {/* Content */}
                <div
                    className="prose prose-lg max-w-none mb-12"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                />

                {/* Comments */}
                <CommentSection articleId={article._id} />
            </article>
        </>
    );
} 