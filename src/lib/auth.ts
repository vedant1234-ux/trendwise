import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import clientPromise from './mongodb-adapter';

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
        };
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || 'dummy-client-id',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy-client-secret',
        }),
    ],
    adapter: MongoDBAdapter(clientPromise),
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.sub!;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
    },
    pages: {
        signIn: '/login',
    },
    secret: process.env.NEXTAUTH_SECRET || 'dummy-secret-key',
    debug: process.env.NODE_ENV === 'development',
}; 