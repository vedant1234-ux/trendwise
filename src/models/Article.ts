import mongoose, { Document, Schema } from 'mongoose';

export interface IArticle extends Document {
    title: string;
    slug: string;
    metaDescription: string;
    content: string;
    ogImage: string;
    media: {
        images: string[];
        videos: string[];
        tweets: string[];
    };
    tags: string[];
    author: string;
    publishedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const ArticleSchema: Schema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    metaDescription: {
        type: String,
        required: true,
        trim: true,
    },
    content: {
        type: String,
        required: true,
    },
    ogImage: {
        type: String,
        required: true,
    },
    media: {
        images: [String],
        videos: [String],
        tweets: [String],
    },
    tags: [String],
    author: {
        type: String,
        default: 'TrendWise AI',
    },
    publishedAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

// Create index for better search performance
ArticleSchema.index({ title: 'text', content: 'text', tags: 'text' });

export default mongoose.models.Article || mongoose.model<IArticle>('Article', ArticleSchema); 