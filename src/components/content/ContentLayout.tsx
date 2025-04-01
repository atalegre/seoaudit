
import React, { ReactNode } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { cn } from '@/lib/utils';

interface ContentLayoutProps {
  children: ReactNode;
  className?: string;
  sidebar?: ReactNode;
}

const ContentLayout = ({ children, sidebar, className }: ContentLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className={cn("flex-1 py-8 md:py-12", className)}>
        <div className="container">
          {sidebar ? (
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-3/4">{children}</div>
              <aside className="w-full md:w-1/4 mt-8 md:mt-0">
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
