
import type {Metadata} from 'next';
import './globals.css';
import { AIChat } from '@/components/ai/AIChat';
import { Toaster } from "@/components/ui/toaster";
import { FirebaseClientProvider } from '@/firebase';

export const metadata: Metadata = {
  metadataBase: new URL('https://infaithjourney.com'),
  title: {
    default: 'InFaith Journey',
    template: '%s | InFaith Journey',
  },
  description: 'Find your perfect wedding vendor. Browse curated & trusted vendors with couples actively planning their dream weddings now.',
  openGraph: {
    title: 'InFaith Journey',
    description: 'Find your perfect wedding vendor. Browse curated & trusted vendors with couples actively planning their dream weddings now.',
    url: 'https://infaithjourney.com/',
    siteName: 'InFaith Journey',
    images: [
      {
        url: 'https://infaithjourney.com/og-image.jpeg',
        width: 1200,
        height: 630,
        alt: 'InFaith Journey - Premium Wedding Marketplace',
      },
    ],
    locale: 'en_ZA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'InFaith Journey',
    description: 'Find your perfect wedding vendor. Browse curated & trusted vendors with couples actively planning their dream weddings now.',
    images: ['https://infaithjourney.com/og-image.jpeg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Montserrat:wght@300;400;500;600;700&family=Great+Vibes&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body selection:bg-primary/20">
        <FirebaseClientProvider>
          {children}
          <AIChat />
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
