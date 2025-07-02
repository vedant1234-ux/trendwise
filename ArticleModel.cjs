const mongoose = require("mongoose");

const ArticleSchema = new mongoose.Schema({
    title: String,
    slug: String,
    content: String,
    metaDescription: String,
    ogImage: String,
    tags: [String],
    author: String,
    publishedAt: Date,
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.models.Article || mongoose.model("Article", ArticleSchema); 