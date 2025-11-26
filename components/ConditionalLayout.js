'use client';

import { usePathname } from 'next/navigation';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();
  
  // Routes that should NOT have navbar and footer
  const hideNavFooter = pathname.startsWith('/admin') || pathname.startsWith('/auth');
  
  if (hideNavFooter) {
    return <>{children}</>;
  }
  
  return (
    <>
      <Navigation />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </>
  );
}
