
import React, { ReactNode } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface ContentLayoutProps {
  children: ReactNode;
  className?: string;
  sidebar?: ReactNode;
}

const ContentLayout = ({ children, sidebar, className }: ContentLayoutProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className={cn("flex-1 py-6 md:py-8 lg:py-12", className)}>
        <div className="container px-4 sm:px-6">
          {sidebar ? (
            <div className="flex flex-col md:flex-row gap-6 md:gap-8">
              <div className="w-full md:w-3/4">{children}</div>
              <aside className="w-full md:w-1/4 mt-6 md:mt-0">
                {sidebar}
              </aside>
            </div>
          ) : (
            children
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContentLayout;
