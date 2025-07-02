import dbConnect from '@/lib/mongodb';
import { generateArticleFromTopic } from '@/lib/openai';
import Article from '@/models/Article';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        console.log('API: GET /api/article called');
        await dbConnect();
        console.log('API: Connected to MongoDB');

        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');
        const limit = parseInt(searchParams.get('limit') || '10');

        let filter = {};
        if (query) {
            filter = {
                $or: [
                    { title: { $regex: query, $options: 'i' } },
                    { content: { $regex: query, $options: 'i' } },
                    { tags: { $in: [new RegExp(query, 'i')] } }
                ]
            };
        }

        const articles = await Article.find(filter)
            .sort({ publishedAt: -1 })
            .limit(limit)
            .lean();
        console.log('API: Articles found:', articles.length);

        return NextResponse.json({
            success: true,
            articles,
            count: articles.length
        });

    } catch (error) {
        console.error('Error fetching articles:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch articles' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        await dbConnect();

        const body = await request.json();
        const { topic, generateContent = false } = body;

        if (!topic) {
            return NextResponse.json(
                { success: false, error: 'Topic is required' },
                { status: 400 }
            );
        }

        let articleData;

        if (generateContent) {
            // Generate content using OpenAI
            const generatedArticle = await generateArticleFromTopic(topic);
            articleData = {
                ...generatedArticle,
                author: 'TrendWise AI',
                publishedAt: new Date(),
            };
        } else {
            // Create basic article structure
            articleData = {
                title: `Latest Trends: ${topic}`,
                slug: topic.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
                metaDescription: `Discover the latest trends and insights about ${topic}. Stay updated with comprehensive analysis and expert opinions.`,
                content: `<h2>${topic}</h2><p>Content about ${topic} will be generated soon...</p>`,
                ogImage: `https://images.unsplash.com/photo-${Math.random().toString(36).substring(2)}?w=1200&h=630&fit=crop`,
                tags: [topic.toLowerCase()],
                author: 'TrendWise AI',
                publishedAt: new Date(),
            };
        }

        const article = new Article(articleData);
        await article.save();

        return NextResponse.json({
            success: true,
            article,
            message: 'Article created successfully'
        });

    } catch (error) {
        console.error('Error creating article:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create article' },
            { status: 500 }
        );
    }
} 