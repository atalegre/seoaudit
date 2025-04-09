
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Star } from 'lucide-react';

const TestimonialsSection = () => {
  const { language } = useLanguage();
  
  const testimonials = [
    {
      content: language === 'pt' 
        ? "A análise SEO foi extremamente detalhada e as recomendações foram muito úteis. Melhorei minha pontuação de 67 para 92 em apenas três semanas seguindo as sugestões." 
        : "The SEO analysis was extremely detailed and the recommendations were very helpful. I improved my score from 67 to 92 in just three weeks following the suggestions.",
      author: "Carlos Silva",
      role: language === 'pt' ? "Marketing Digital, TechBlog PT" : "Digital Marketing, TechBlog PT",
      image: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      content: language === 'pt'
        ? "O que mais me impressionou foi a parte de otimização para IA. Consegui fazer com que meu site fosse citado com muito mais frequência no ChatGPT, o que trouxe um aumento significativo de tráfego." 
        : "What impressed me the most was the AI optimization part. I was able to make my site cited much more frequently in ChatGPT, which brought a significant increase in traffic.",
      author: "Maria Costa",
      role: language === 'pt' ? "CEO, Loja Virtual Express" : "CEO, Virtual Store Express",
      image: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      content: language === 'pt'
        ? "Utilizamos o SEOAudit em mais de 15 sites de clientes e os resultados foram sempre impressionantes. A interface é intuitiva e as recomendações são práticas e eficazes." 
        : "We used SEOAudit on more than 15 client sites and the results were always impressive. The interface is intuitive and the recommendations are practical and effective.",
      author: "João Mendes",
      role: language === 'pt' ? "Diretor, Agência Digital Connect" : "Director, Digital Agency Connect",
      image: "https://randomuser.me/api/portraits/men/62.jpg"
    }
  ];
  
  return (
    <section className="py-20 bg-gradient-to-b from-indigo-50 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="inline-block text-indigo-600 font-semibold mb-2">
            {language === 'pt' ? 'DEPOIMENTOS' : 'TESTIMONIALS'}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {language === 'pt' ? 'O Que Nossos Clientes Dizem' : 'What Our Clients Say'}
          </h2>
          <p className="text-lg text-gray-600">
            {language === 'pt'
              ? 'Veja como nossa plataforma tem ajudado empresas e profissionais a melhorar sua presença online'
              : 'See how our platform has been helping businesses and professionals improve their online presence'
            }
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 flex flex-col h-full">
              <div className="flex-1">
                <div className="flex mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 font-medium italic">"{testimonial.content}"</p>
              </div>
              <div className="flex items-center mt-4 pt-4 border-t border-gray-100">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.author} 
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                />
                <div>
                  <h4 className="font-bold">{testimonial.author}</h4>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <div className="inline-flex items-center bg-white px-6 py-3 rounded-full shadow-sm">
            <span className="text-lg font-medium text-gray-900 mr-2">
              {language === 'pt' ? 'Avaliação média:' : 'Average rating:'}
            </span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-5 h-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <span className="ml-2 text-lg font-medium text-gray-900">4.8/5</span>
            <span className="ml-2 text-sm text-gray-500">
              ({language === 'pt' ? '344 avaliações' : '344 reviews'})
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
