import { EB_Garamond, Hanken_Grotesk } from 'next/font/google';
import './globals.css';
import AuthSessionGuard from './components/AuthSessionGuard';

const garamond = EB_Garamond({
  subsets: ['latin'],
  variable: '--font-garamond'
});

const hanken = Hanken_Grotesk({
  subsets: ['latin'],
  variable: '--font-hanken'
});

const materialSymbols = {
  url: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap'
};

export const metadata = {
  title: 'R Petals | Flowers That Speak',
  description: 'Premium floral storefront built with Next.js and Tailwind CSS.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`scroll-smooth ${garamond.variable} ${hanken.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href={materialSymbols.url} crossOrigin="anonymous" />
      </head>
      <body className="bg-background text-on-surface selection:bg-primary-fixed selection:text-on-primary-fixed">
        <AuthSessionGuard />
        {children}
      </body>
    </html>
  );
}
