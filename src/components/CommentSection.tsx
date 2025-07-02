'use client';

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface Comment {
    _id: string;
    content: string;
    author: {
        name: string;
        email: string;
        image?: string;
    };
    createdAt: string;
}

interface CommentSectionProps {
    articleId: string;
}

export default function CommentSection({ articleId }: CommentSectionProps) {
    const { data: session } = useSession();
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchComments();
    }, [articleId]);

    const fetchComments = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/comment?articleId=${articleId}`);
            if (response.ok) {
                const data = await response.json();
                setComments(data.comments || []);
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!session) {
            alert('Please sign in to comment');
            return;
        }

        if (!newComment.trim()) {
            return;
        }

        try {
            setSubmitting(true);
            const response = await fetch('/api/comment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: newComment.trim(),
                    articleId,
                }),
            });

            if (response.ok) {
                setNewComment('');
                fetchComments(); // Refresh comments
            } else {
                const error = await response.json();
                alert(error.error || 'Failed to post comment');
            }
        } catch (error) {
            console.error('Error posting comment:', error);
            alert('Failed to post comment');
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="mt-12">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                Comments ({comments.length})
            </h3>

            {/* Comment Form */}
            {session ? (
                <form onSubmit={handleSubmitComment} className="mb-8">
                    <div className="flex items-start space-x-4">
                        {session.user?.image && (
                            <Image
                                src={session.user.image}
                                alt={session.user.name || 'User'}
                                width={40}
                                height={40}
                                className="rounded-full"
                            />
                        )}
                        <div className="flex-1">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Write a comment..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                rows={3}
                                disabled={submitting}
                            />
                            <button
                                type="submit"
                                disabled={submitting || !newComment.trim()}
                                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submitting ? 'Posting...' : 'Post Comment'}
                            </button>
                        </div>
                    </div>
                </form>
            ) : (
                <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">
                        Please <button className="text-blue-600 hover:underline">sign in</button> to leave a comment.
                    </p>
                </div>
            )}

            {/* Comments List */}
            {loading ? (
                <div className="text-center py-8">
                    <p className="text-gray-600">Loading comments...</p>
                </div>
            ) : comments.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-600">No comments yet. Be the first to comment!</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {comments.map((comment) => (
                        <div key={comment._id} className="flex space-x-4">
                            {comment.author.image && (
                                <Image
                                    src={comment.author.image}
                                    alt={comment.author.name}
                                    width={40}
                                    height={40}
                                    className="rounded-full"
                                />
                            )}
                            <div className="flex-1">
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-medium text-gray-900">
                                            {comment.author.name}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            {formatDate(comment.createdAt)}
                                        </span>
                                    </div>
                                    <p className="text-gray-700">{comment.content}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
} 