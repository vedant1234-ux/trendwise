import { NextAuthProvider } from "@/components/NextAuthProvider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TrendWise - AI-Powered Blog Platform",
  description: "Discover trending topics and AI-generated insights on the latest trends in technology, business, and more.",
  keywords: "trending topics, AI, blog, technology, insights",
  authors: [{ name: "TrendWise" }],
  openGraph: {
    title: "TrendWise - AI-Powered Blog Platform",
    description: "Discover trending topics and AI-generated insights on the latest trends in technology, business, and more.",
    type: "website",
    siteName: "TrendWise",
  },
  twitter: {
    card: "summary_large_image",
    title: "TrendWise - AI-Powered Blog Platform",
    description: "Discover trending topics and AI-generated insights on the latest trends in technology, business, and more.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthProvider>
          {children}
        </NextAuthProvider>
      </body>
    </html>
  );
}
