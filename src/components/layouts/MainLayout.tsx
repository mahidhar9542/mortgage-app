import { ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface MainLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export default function MainLayout({ 
  children, 
  title = 'Quick Close Mortgage',
  description = 'Fast and reliable mortgage solutions'
}: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.ico" />
      </Helmet>
      
      <Header />
      
      <main className="flex-grow">
        {children}
      </main>
      
      <Footer />
    </div>
  );
}
