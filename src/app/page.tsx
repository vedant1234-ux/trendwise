'use client';

import ArticleList from '@/components/ArticleList';
import Navbar from '@/components/Navbar';
import SearchBar from '@/components/SearchBar';
import Link from 'next/link';
import { Suspense, useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    const autoGenerateArticle = async () => {
      try {
        // Check if we need to generate a new article
        const response = await fetch('/api/article');
        const data = await response.json();

        if (data.success && data.articles) {
          const articles = data.articles;

          // Generate new article if:
          // 1. No articles exist, OR
          // 2. Last article is older than 1 hour
          const shouldGenerate = articles.length === 0 ||
            (articles.length > 0 &&
              new Date().getTime() - new Date(articles[0].publishedAt).getTime() > 1 * 60 * 60 * 1000);

          if (shouldGenerate) {
            console.log('Auto-generating new article...');

            // List of trending topics to choose from
            const trendingTopics = [
              'AI in healthcare 2024',
              'Sustainable technology trends',
              'Remote work future',
              'Cybersecurity threats',
              'Blockchain applications',
              'Quantum computing progress',
              'Digital transformation',
              'Cloud computing trends',
              'IoT innovations',
              'Machine learning breakthroughs',
              'Green energy solutions',
              'Smart cities development',
              'Virtual reality applications',
              '5G technology impact',
              'Data privacy regulations'
            ];

            // Pick a random topic
            const randomTopic = trendingTopics[Math.floor(Math.random() * trendingTopics.length)];

            // Generate the article
            const generateResponse = await fetch('/api/article', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                topic: randomTopic,
                generateContent: true
              }),
            });

            if (generateResponse.ok) {
              console.log('New article generated successfully!');
              // Refresh the page to show the new article
              window.location.reload();
            }
          }
        }
      } catch (error) {
        console.error('Error in auto-generation:', error);
      }
    };

    autoGenerateArticle();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to <span className="text-blue-600">TrendWise</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            AI-powered insights on trending topics, delivered fresh daily
          </p>
          <SearchBar />
        </div>

        {/* Featured Article */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Featured Article</h2>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                The Future of Artificial Intelligence in 2024
              </h3>
              <p className="text-gray-600 mb-4">
                Discover how AI is transforming industries and reshaping our digital landscape...
              </p>
              <Link
                href="/article/ai-future-2024"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Read more →
              </Link>
            </div>
          </div>
        </div>

        {/* Article List */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Latest Articles</h2>
          <Suspense fallback={<div className="text-center py-8">Loading articles...</div>}>
            <ArticleList />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
