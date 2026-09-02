import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Microsoft Clip Gallery',
  description: 'Retro 90s vector art gallery with lazy loading and instant search for the legendary Microsoft Office Clip Art SVG archive.',
  openGraph: {
    title: 'Microsoft Clip Gallery',
    description: 'Retro 90s vector art gallery with lazy loading and instant search for the legendary Microsoft Office Clip Art SVG archive.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Microsoft Clip Gallery',
    description: 'Retro 90s vector art gallery with lazy loading and instant search for the legendary Microsoft Office Clip Art SVG archive.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full antialiased font-sans select-none" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
