import puppeteer from 'puppeteer';

export interface TrendingTopic {
    title: string;
    description?: string;
    url?: string;
    category?: string;
}

export async function getGoogleTrends(): Promise<TrendingTopic[]> {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        const page = await browser.newPage();

        // Set user agent to avoid detection
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

        // Navigate to Google Trends
        await page.goto('https://trends.google.com/trends/trendingsearches/daily?geo=US', {
            waitUntil: 'networkidle2',
            timeout: 30000
        });

        // Wait for the trending topics to load
        await page.waitForSelector('[data-entity-type="QUERY"]', { timeout: 10000 });

        // Extract trending topics
        const trends = await page.evaluate(() => {
            const trendElements = document.querySelectorAll('[data-entity-type="QUERY"]');
            const topics: TrendingTopic[] = [];

            trendElements.forEach((element, index) => {
                if (index < 10) { // Limit to top 10 trends
                    const titleElement = element.querySelector('a');
                    const title = titleElement?.textContent?.trim();

                    if (title) {
                        topics.push({
                            title,
                            description: `Trending topic #${index + 1}`,
                            category: 'trending'
                        });
                    }
                }
            });

            return topics;
        });

        return trends;
    } catch (error) {
        console.error('Error fetching Google Trends:', error);

        // Fallback: return some default trending topics
        return [
            { title: 'Artificial Intelligence', description: 'AI technology trends', category: 'technology' },
            { title: 'Climate Change', description: 'Environmental awareness', category: 'environment' },
            { title: 'Remote Work', description: 'Work from home trends', category: 'business' },
            { title: 'Cryptocurrency', description: 'Digital currency trends', category: 'finance' },
            { title: 'Mental Health', description: 'Wellness and mindfulness', category: 'health' },
        ];
    } finally {
        await browser.close();
    }
}

export async function getTwitterTrends(): Promise<TrendingTopic[]> {
    // Note: Twitter API requires authentication
    // For now, return some tech-related topics
    return [
        { title: 'Web Development', description: 'Latest in web technologies', category: 'technology' },
        { title: 'Machine Learning', description: 'AI and ML advancements', category: 'technology' },
        { title: 'Startup Culture', description: 'Entrepreneurship trends', category: 'business' },
        { title: 'Digital Marketing', description: 'Online marketing strategies', category: 'marketing' },
        { title: 'Cybersecurity', description: 'Digital security trends', category: 'technology' },
    ];
}

export async function getAllTrendingTopics(): Promise<TrendingTopic[]> {
    try {
        const [googleTrends, twitterTrends] = await Promise.all([
            getGoogleTrends(),
            getTwitterTrends()
        ]);

        // Combine and deduplicate trends
        const allTrends = [...googleTrends, ...twitterTrends];
        const uniqueTrends = allTrends.filter((trend, index, self) =>
            index === self.findIndex(t => t.title.toLowerCase() === trend.title.toLowerCase())
        );

        return uniqueTrends.slice(0, 15); // Return top 15 unique trends
    } catch (error) {
        console.error('Error fetching trending topics:', error);
        return [];
    }
} 