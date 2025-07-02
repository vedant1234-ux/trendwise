const { MongoClient } = require('mongodb');
require('dotenv').config();

(async () => {
    let client;
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('Missing MONGODB_URI in environment variables');
        }

        client = new MongoClient(process.env.MONGODB_URI, {
            connectTimeoutMS: 5000,
            serverSelectionTimeoutMS: 5000
        });

        console.log('⌛ Connecting to MongoDB...');
        await client.connect();
        const adminDb = client.db().admin();
        const ping = await adminDb.ping();
        console.log('✅ MongoDB Connected Successfully');
        console.log('📊 Server Status:', ping);
    } catch (error) {
        console.error('❌ Connection Failed:');
        console.error(error.message);
        process.exit(1);
    } finally {
        if (client) await client.close();
    }
})(); 