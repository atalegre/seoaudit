
import React from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    content: "Esta ferramenta deu-me uma visão profunda do meu site. Consegui identificar problemas que nem sabia que existiam e melhorei significativamente o meu ranking.",
    author: "Miguel Santos",
    role: "Consultor Digital"
  },
  {
    content: "A análise de IA foi reveladora. Descobri como os modelos como ChatGPT e Claude vêem o meu conteúdo e pude fazer ajustes que aumentaram a visibilidade.",
    author: "Ana Ferreira",
    role: "Content Manager"
  },
  {
    content: "Ferramenta incrível! Resultados instantâneos e recomendações práticas. Já implementei várias mudanças e meu tráfego orgânico aumentou 40%.",
    author: "Pedro Oliveira",
    role: "E-commerce Manager"
  }
];

const TestimonialsSection = () => {
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">O Que Dizem Sobre Nós</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Centenas de empresas e profissionais já melhoraram a sua presença digital com a nossa análise.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">{testimonial.content}</p>
              <div>
                <p className="font-semibold">{testimonial.author}</p>
                <p className="text-gray-500 text-sm">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
