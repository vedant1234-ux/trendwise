import mongoose, { Document, Schema } from 'mongoose';

export interface IComment extends Document {
    content: string;
    author: {
        name: string;
        email: string;
        image?: string;
    };
    articleId: mongoose.Types.ObjectId;
    userId?: string;
    createdAt: Date;
    updatedAt: Date;
}

const CommentSchema: Schema = new Schema({
    content: {
        type: String,
        required: true,
        trim: true,
    },
    author: {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        image: String,
    },
    articleId: {
        type: Schema.Types.ObjectId,
        ref: 'Article',
        required: true,
    },
    userId: {
        type: String,
        required: false, // Optional for guest comments
    },
}, {
    timestamps: true,
});

// Create index for better query performance
CommentSchema.index({ articleId: 1, createdAt: -1 });

export default mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema); 