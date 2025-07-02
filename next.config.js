/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        appDir: true,
    },
    images: {
        domains: [
            'images.unsplash.com',
            'picsum.photos',
            'via.placeholder.com',
            'lh3.googleusercontent.com', // Google profile images
        ],
    },
    async headers() {
        return [
            {
                source: '/robots.txt',
                headers: [
                    {
                        key: 'Content-Type',
                        value: 'text/plain',
                    },
                ],
            },
        ];
    },
};

module.exports = nextConfig; 