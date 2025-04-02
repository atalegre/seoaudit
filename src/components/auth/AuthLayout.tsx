
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default AuthLayout;
