
export const checklistSections = [
  {
    id: 'fundamentos',
    title: 'Fundamentos técnicos',
    icon: 'rocket',
    items: [
      {
        title: 'Implementar HTTPS em todo o site',
        description: 'Garanta que seu site use conexão segura para proteger dados e melhorar rankings.',
        relevance: ['SEO', 'AIO'],
        link: {
          text: 'Saiba como implementar HTTPS',
          url: '/blog/como-implementar-https'
        }
      },
      {
        title: 'Otimizar velocidade de carregamento',
        description: 'Reduza o tempo de carregamento para melhor experiência do usuário e melhores rankings.',
        relevance: ['SEO'],
        link: {
          text: 'Técnicas de otimização de velocidade',
          url: '/blog/otimizacao-velocidade'
        }
      },
      {
        title: 'Garantir design responsivo',
        description: 'Seu site deve funcionar bem em todos os dispositivos, especialmente móveis.',
        relevance: ['SEO'],
        link: null
      },
      {
        title: 'Implementar dados estruturados (Schema.org)',
        description: 'Ajude motores de busca e IAs a entenderem o conteúdo do seu site de forma clara.',
        relevance: ['SEO', 'AIO'],
        link: {
          text: 'Guia de dados estruturados',
          url: '/glossario/schema-markup'
        }
      },
      {
        title: 'Criar e enviar sitemap XML',
        description: 'Facilite o trabalho dos crawlers para descobrir e indexar suas páginas.',
        relevance: ['SEO'],
        link: null
      }
    ]
  },
  {
    id: 'conteudo',
    title: 'Otimização de conteúdo',
    icon: 'globe',
    items: [
      {
        title: 'Usar estrutura de cabeçalhos HTML (H1-H6) adequadamente',
        description: 'Organize seu conteúdo com hierarquia clara usando tags de cabeçalho HTML.',
        relevance: ['SEO', 'AIO'],
        link: null
      },
      {
        title: 'Criar resumos claros no início dos artigos',
        description: 'Facilite a compreensão do conteúdo por humanos e sistemas de IA com um resumo inicial.',
        relevance: ['AIO'],
        link: {
          text: 'Ver exemplos de bons resumos',
          url: '/blog/como-escrever-resumos'
        }
      },
      {
        title: 'Incluir perguntas e respostas relevantes (FAQ)',
        description: 'Responda diretamente as principais dúvidas dos usuários em formato de FAQ.',
        relevance: ['SEO', 'AIO'],
        link: null
      },
      {
        title: 'Criar conteúdo original com informações verificáveis',
        description: 'Produza conteúdo único baseado em fontes confiáveis e dados verificáveis.',
        relevance: ['SEO', 'AIO'],
        link: null
      },
      {
        title: 'Otimizar meta tags (título e descrição)',
        description: 'Crie títulos e descrições atraentes e relevantes para os resultados de busca.',
        relevance: ['SEO'],
        link: {
          text: 'Como criar meta tags eficientes',
          url: '/blog/meta-tags-otimizadas'
        }
      },
      {
        title: 'Definir claramente termos técnicos ou específicos',
        description: 'Explique termos complexos para facilitar o entendimento por usuários e IA.',
        relevance: ['AIO'],
        link: null
      }
    ]
  },
  {
    id: 'autoridade',
    title: 'Construção de autoridade',
    icon: 'bot',
    items: [
      {
        title: 'Citar fontes confiáveis e estudos relevantes',
        description: 'Reforce suas afirmações com referências a fontes autoritativas no assunto.',
        relevance: ['SEO', 'AIO'],
        link: null
      },
      {
        title: 'Incluir informações do autor e credenciais',
        description: 'Destaque a experiência e autoridade de quem escreve o conteúdo.',
        relevance: ['SEO', 'AIO'],
        link: null
      },
      {
        title: 'Criar uma rede de links internos lógicos',
        description: 'Conecte páginas relacionadas com links internos bem estruturados.',
        relevance: ['SEO'],
        link: {
          text: 'Estratégias de linking interno',
          url: '/blog/estrategias-linking-interno'
        }
      },
      {
        title: 'Manter conteúdo atualizado regularmente',
        description: 'Revise e atualize informações para garantir precisão e relevância contínuas.',
        relevance: ['SEO', 'AIO'],
        link: null
      }
    ]
  },
  {
    id: 'usuario',
    title: 'Experiência do usuário',
    icon: 'rocket',
    items: [
      {
        title: 'Otimizar para Core Web Vitals',
        description: 'Melhore métricas de experiência do usuário como LCP, FID e CLS.',
        relevance: ['SEO'],
        link: {
          text: 'Guia de Core Web Vitals',
          url: '/glossario/core-web-vitals'
        }
      },
      {
        title: 'Melhorar acessibilidade do site',
        description: 'Torne seu site utilizável por pessoas com diferentes habilidades e necessidades.',
        relevance: ['SEO', 'AIO'],
        link: null
      },
      {
        title: 'Minimizar interrupções intrusivas',
        description: 'Evite popups e elementos que atrapalhem a experiência de leitura.',
        relevance: ['SEO'],
        link: null
      },
      {
        title: 'Otimizar para intenção de busca',
        description: 'Certifique-se de que seu conteúdo corresponda ao que os usuários realmente procuram.',
        relevance: ['SEO', 'AIO'],
        link: {
          text: 'Compreendendo a intenção de busca',
          url: '/blog/intencao-busca'
        }
      }
    ]
  }
];
