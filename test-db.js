const { MongoClient } = require('mongodb');
require('dotenv').config();

(async () => {
    try {
        const client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();
        console.log('✅ MongoDB connected successfully');
        await client.close();
    } catch (err) {
        console.error('❌ MongoDB connection failed:', err.message);
    }
})(); 