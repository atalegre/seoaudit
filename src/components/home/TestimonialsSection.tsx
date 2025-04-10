
import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TestimonialsSection = () => {
  const { language } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);
  
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
  
  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };
  
  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };
  
  useEffect(() => {
    // Auto-slide effect
    if (!isPaused) {
      timerRef.current = setInterval(() => {
        nextTestimonial();
      }, 5000);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPaused, testimonials.length]);
  
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
        
        <div 
          className="max-w-4xl mx-auto relative" 
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="overflow-hidden">
            <div 
              className="transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)`, display: 'flex' }}
            >
              {testimonials.map((testimonial, index) => (
                <div 
                  key={index} 
                  className="w-full flex-shrink-0 px-4"
                >
                  <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                    <div className="flex mb-6">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-6 font-medium italic min-h-[100px]">"{testimonial.content}"</p>
                    <div className="flex items-center mt-4 pt-4 border-t border-gray-100">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.author} 
                        className="w-14 h-14 rounded-full mr-4 object-cover"
                      />
                      <div>
                        <h4 className="font-bold text-lg">{testimonial.author}</h4>
                        <p className="text-sm text-gray-500">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-center mt-8 items-center gap-4">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={prevTestimonial}
              className="rounded-full"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            
            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-2.5 h-2.5 rounded-full ${
                    index === activeIndex ? 'bg-indigo-600' : 'bg-gray-300'
                  }`}
                  onClick={() => setActiveIndex(index)}
                />
              ))}
            </div>
            
            <Button 
              variant="outline" 
              size="icon" 
              onClick={nextTestimonial}
              className="rounded-full"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="text-center mt-8">
            <Button variant="outline">
              {language === 'pt' ? 'Ver mais histórias de clientes' : 'See more client stories'}
            </Button>
          </div>
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
