import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export interface GeneratedArticle {
    title: string;
    slug: string;
    metaDescription: string;
    content: string;
    ogImage: string;
    tags: string[];
}

export async function generateArticleFromTopic(topic: string): Promise<GeneratedArticle> {
    try {
        const prompt = `Create a comprehensive, SEO-optimized blog article about "${topic}". 

The article should be:
- Engaging and informative
- 800-1200 words long
- Include relevant headings and subheadings
- SEO-optimized with natural keyword usage
- Include a compelling meta description (150-160 characters)

Please return the response in the following JSON format:
{
  "title": "SEO-optimized title",
  "slug": "url-friendly-slug",
  "metaDescription": "SEO meta description",
  "content": "Full article content with HTML formatting",
  "ogImage": "https://images.unsplash.com/photo-...",
  "tags": ["tag1", "tag2", "tag3"]
}

Make sure the content is well-structured with proper HTML tags like <h2>, <h3>, <p>, <ul>, <li>, etc.`;

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are an expert content writer and SEO specialist. Create engaging, informative, and SEO-optimized blog content."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 2000,
        });

        const response = completion.choices[0]?.message?.content;

        if (!response) {
            throw new Error('No response from OpenAI');
        }

        // Try to parse JSON response
        try {
            const articleData = JSON.parse(response);
            return articleData as GeneratedArticle;
        } catch (parseError) {
            // If JSON parsing fails, create a basic structure
            return {
                title: `Latest Trends: ${topic}`,
                slug: topic.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
                metaDescription: `Discover the latest trends and insights about ${topic}. Stay updated with comprehensive analysis and expert opinions.`,
                content: `<h2>${topic}</h2><p>${response}</p>`,
                ogImage: `https://images.unsplash.com/photo-${Math.random().toString(36).substring(2)}?w=1200&h=630&fit=crop`,
                tags: [topic.toLowerCase()],
            };
        }
    } catch (error) {
        console.error('Error generating article:', error);
        throw error;
    }
}

export default openai; 