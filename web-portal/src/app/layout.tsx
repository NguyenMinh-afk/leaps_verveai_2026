import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { Providers } from '@/app/providers';
import '@/styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'VerveAI - AI-Powered Platform',
    template: '%s | VerveAI',
  },
  description:
    'VerveAI is an advanced AI platform that helps you build, deploy, and scale AI applications with ease.',
  keywords: ['AI', 'Artificial Intelligence', 'Machine Learning', 'NLP', 'Chatbot', 'VerveAI'],
  authors: [{ name: 'VerveAI Team' }],
  creator: 'VerveAI',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'VerveAI',
    title: 'VerveAI - AI-Powered Platform',
    description:
      'VerveAI is an advanced AI platform that helps you build, deploy, and scale AI applications with ease.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VerveAI - AI-Powered Platform',
    description:
      'VerveAI is an advanced AI platform that helps you build, deploy, and scale AI applications with ease.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-background antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
