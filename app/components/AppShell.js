'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';

export default function AppShell({ children }) {
  const pathname = usePathname() || '';

  // Admin and DarkStore have their own complete layouts.
  // Never render the customer Header/Footer on these routes.
  const isBackOffice =
    pathname.startsWith('/admin') ||
    pathname.startsWith('/darkStore') ||
    pathname.startsWith('/shopkeeper');

  if (isBackOffice) {
    return children;
  }

  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
