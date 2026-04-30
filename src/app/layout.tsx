
import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'InFaith Journey | Premium Wedding Vendor Marketplace',
  description: 'Find your perfect wedding vendor in South Africa. Luxurious, romantic, and bespoke wedding services.',
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
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased selection:bg-primary/20">
        {children}
      </body>
    </html>
  );
}
