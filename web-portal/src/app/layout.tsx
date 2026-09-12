import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import { Providers } from '@/components/providers';
import '@/styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',D
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'VerveAI - LEAPS Platform',
    template: '%s | VerveAI',
  },
  description:
    'VerveAI is an AI-powered learning platform that helps students master skills through adaptive diagnostics and personalized intervention.',
  keywords: ['AI', 'Education', 'Learning', 'Adaptive Learning', 'BKT', 'Mastery Learning', 'LEAPS'],
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

/**
 * Inline script to prevent flash of wrong theme
 * This runs before React hydrates
 */
const themeScript = `
  (function() {
    try {
      var theme = localStorage.getItem('verveai-theme');
      var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      var resolved = theme === 'dark' || (theme !== 'light' && systemDark);
      if (resolved) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.add('light');
      }
    } catch (e) {
      document.documentElement.classList.add('light');
    }
  })();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${inter.variable} ${plusJakarta.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen bg-background antialiased font-sans">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
