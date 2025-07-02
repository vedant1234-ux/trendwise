import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Article from '@/models/Article';
import Comment from '@/models/Comment';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const articleId = searchParams.get('articleId');

        if (!articleId) {
            return NextResponse.json(
                { success: false, error: 'Article ID is required' },
                { status: 400 }
            );
        }

        const comments = await Comment.find({ articleId })
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({
            success: true,
            comments,
            count: comments.length
        });

    } catch (error) {
        console.error('Error fetching comments:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch comments' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { success: false, error: 'Authentication required' },
                { status: 401 }
            );
        }

        await dbConnect();

        const body = await request.json();
        const { content, articleId } = body;

        if (!content || !articleId) {
            return NextResponse.json(
                { success: false, error: 'Content and article ID are required' },
                { status: 400 }
            );
        }

        // Verify article exists
        const article = await Article.findById(articleId);
        if (!article) {
            return NextResponse.json(
                { success: false, error: 'Article not found' },
                { status: 404 }
            );
        }

        const commentData = {
            content,
            articleId,
            author: {
                name: session.user.name || 'Anonymous',
                email: session.user.email || '',
                image: session.user.image || '',
            },
            userId: session.user.id,
        };

        const comment = new Comment(commentData);
        await comment.save();

        return NextResponse.json({
            success: true,
            comment,
            message: 'Comment posted successfully'
        });

    } catch (error) {
        console.error('Error creating comment:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create comment' },
            { status: 500 }
        );
    }
} 