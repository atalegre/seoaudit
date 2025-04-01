
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-4">Página não encontrada</p>
          <Link to="/" className="text-blue-500 hover:text-blue-700 underline">
            Voltar à página inicial
          </Link>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFoundPage;
