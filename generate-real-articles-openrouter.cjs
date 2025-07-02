require('dotenv').config();
const mongoose = require('mongoose');
const Article = require('./ArticleModel.cjs');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const API_KEY = process.env.OPENROUTER_API_KEY;
const MONGODB_URI = process.env.MONGODB_URI;
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

console.log('DEBUG: API_KEY:', API_KEY ? 'Loaded' : 'Missing');
console.log('DEBUG: MONGODB_URI:', MONGODB_URI ? 'Loaded' : 'Missing');
console.log('DEBUG: UNSPLASH_ACCESS_KEY:', UNSPLASH_ACCESS_KEY ? 'Loaded' : 'Missing');

const trendingTopics = [
    "AI-driven supply chain optimization",
    "Smart textiles in fashion",
    "Hydrogen-powered vehicles",
    "Brain-computer interfaces",
    "Zero-waste packaging innovations"
];

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80";

async function generateArticle(topic) {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'http://localhost:3000',
            'X-Title': 'TrendWise'
        },
        body: JSON.stringify({
            model: 'openai/gpt-4o',
            max_tokens: 1000,
            messages: [
                { role: 'user', content: `Write a 500-word SEO-optimized blog post about "${topic}". Use engaging subheadings, include recent examples, and keep it clear and helpful.` }
            ]
        })
    });
    const data = await res.json();
    const content = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content ? data.choices[0].message.content : 'Failed to generate content.';
    return content;
}

async function fetchUnsplashImage(topic) {
    if (!UNSPLASH_ACCESS_KEY) return DEFAULT_IMAGE;
    try {
        const res = await fetch(`https://api.unsplash.com/photos/random?query=${encodeURIComponent(topic)}&orientation=landscape&client_id=${UNSPLASH_ACCESS_KEY}`);
        const data = await res.json();
        if (data && data.urls && data.urls.regular) {
            return data.urls.regular;
        }
    } catch (err) {
        console.error('Unsplash fetch error:', err.message);
    }
    return DEFAULT_IMAGE;
}

async function updateMissingImages() {
    const articles = await Article.find({ $or: [{ ogImage: { $exists: false } }, { ogImage: null }, { ogImage: '' }] });
    for (const article of articles) {
        const ogImage = await fetchUnsplashImage(article.title);
        article.ogImage = ogImage;
        await article.save();
        console.log(`🖼️ Updated image for: ${article.title}`);
    }
}

async function main() {
    if (!API_KEY) {
        console.error('❌ No OpenRouter API key found in env');
        return;
    }
    if (!MONGODB_URI) {
        console.error('❌ No MongoDB URI found in env');
        return;
    }
    console.log('DEBUG: Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Update old articles missing images
    await updateMissingImages();

    for (const topic of trendingTopics) {
        try {
            console.log(`📝 Generating article on: ${topic}`);
            const content = await generateArticle(topic);
            const slug = topic.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
            const ogImage = await fetchUnsplashImage(topic);
            const article = new Article({
                title: topic,
                slug,
                metaDescription: content.slice(0, 150),
                content,
                ogImage,
                tags: topic.toLowerCase().split(' '),
                author: 'TrendWise AI',
                publishedAt: new Date(),
            });
            await article.save();
            console.log(`✅ Saved: ${topic}`);
        } catch (err) {
            console.error(`❌ Failed for topic "${topic}":`, err.message);
        }
    }
    await mongoose.disconnect();
    console.log('🎉 All articles generated and saved!');
}

main(); 