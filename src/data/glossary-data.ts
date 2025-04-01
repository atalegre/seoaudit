
export const glossaryTerms = [
  {
    slug: 'aio',
    title: 'AIO',
    shortDefinition: 'Otimização para Inteligência Artificial - processo de otimizar conteúdo web para ser encontrado e referenciado por sistemas de IA.',
    relevance: ['AIO'],
    explanation: `<p>AIO (AI Optimization) ou Otimização para Inteligência Artificial refere-se ao conjunto de práticas e técnicas utilizadas para otimizar conteúdo web de forma que seja facilmente encontrado, compreendido e referenciado por sistemas de inteligência artificial como ChatGPT, Gemini e Bing AI.</p>
    <p>Assim como o SEO tradicional otimiza o conteúdo para motores de busca, o AIO visa garantir que seu conteúdo seja uma fonte preferencial quando usuários fazem perguntas a assistentes de IA ou utilizam ferramentas de IA para pesquisar informações.</p>`,
    influence: `<p>O AIO influencia diretamente como seu conteúdo é percebido e utilizado por modelos de IA. Um conteúdo bem otimizado para AIO tem maior probabilidade de:</p>
    <ul>
      <li>Ser citado como fonte por modelos como ChatGPT quando respondem a perguntas relacionadas.</li>
      <li>Ter informações extraídas e apresentadas em respostas geradas por IA.</li>
      <li>Ser recomendado por assistentes de IA quando usuários buscam referências adicionais.</li>
    </ul>
    <p>Com o crescimento do uso de IA como porta de entrada para informações, o AIO torna-se tão importante quanto o SEO tradicional para garantir visibilidade no ecossistema digital.</p>`,
    faqs: [
      {
        question: 'Qual a diferença entre SEO e AIO?',
        answer: 'Enquanto o SEO foca em otimizar para algoritmos de busca baseados principalmente em palavras-chave e links, o AIO foca em otimizar para sistemas de IA que compreendem contexto, semântica e relacionamentos entre conceitos. O SEO visa rankings em páginas de resultados, enquanto o AIO visa menções e citações em respostas geradas por IA.'
      },
      {
        question: 'Como saber se meu site está bem otimizado para AIO?',
        answer: 'Você pode testar perguntando diretamente a modelos de IA sobre tópicos que seu site aborda, verificando se eles mencionam seu site ou utilizam informações contidas nele. Também existem ferramentas emergentes que analisam o potencial de AIO do seu conteúdo.'
      },
      {
        question: 'O AIO vai substituir o SEO tradicional?',
        answer: 'Não. AIO e SEO são complementares. O SEO continua essencial para visibilidade em motores de busca tradicionais, enquanto o AIO otimiza para interfaces de IA. Uma estratégia digital completa deve incluir ambos.'
      }
    ],
    related: ['seo-tecnico', 'llm', 'e-e-a-t', 'schema-markup']
  },
  {
    slug: 'seo-tecnico',
    title: 'SEO Técnico',
    shortDefinition: 'Conjunto de práticas de otimização focadas nos aspectos técnicos de um site para melhorar sua indexação e ranking nos motores de busca.',
    relevance: ['SEO'],
    explanation: `<p>SEO Técnico refere-se aos aspectos de otimização que focam na infraestrutura técnica de um site. Diferente do SEO de conteúdo, que se concentra no texto, imagens e outros elementos visíveis, o SEO técnico lida com os componentes "nos bastidores" que afetam a capacidade dos motores de busca de rastrear, indexar e ranquear um site.</p>
    <p>Isso inclui elementos como velocidade do site, estrutura de URLs, arquitetura do site, compatibilidade mobile, implementação de SSL, schemas de dados estruturados, entre outros.</p>`,
    influence: `<p>O SEO técnico tem um impacto profundo na forma como os motores de busca avaliam e classificam um site:</p>
    <ul>
      <li><strong>Rastreabilidade</strong>: Uma boa estrutura técnica garante que os crawlers dos motores de busca possam navegar eficientemente por todo o conteúdo do site.</li>
      <li><strong>Indexabilidade</strong>: Práticas técnicas adequadas ajudam a garantir que as páginas sejam corretamente indexadas.</li>
      <li><strong>Experiência do Usuário</strong>: Fatores como velocidade de carregamento e usabilidade em dispositivos móveis impactam diretamente o ranking.</li>
      <li><strong>Classificação</strong>: Elementos técnicos como os dados estruturados podem melhorar a apresentação nos resultados de busca (rich snippets).</li>
    </ul>
    <p>Problemas técnicos não resolvidos podem limitar significativamente a eficácia de outras estratégias de SEO, como criação de conteúdo de qualidade ou construção de links.</p>`,
    faqs: [
      {
        question: 'Quais são os elementos mais importantes do SEO técnico?',
        answer: 'Os elementos críticos incluem velocidade do site, design responsivo para dispositivos móveis, URLs amigáveis, sitemap XML, robots.txt adequado, uso de HTTPS, dados estruturados (schema.org) e uma arquitetura de site que facilite o rastreamento.'
      },
      {
        question: 'Como posso identificar problemas de SEO técnico no meu site?',
        answer: 'Ferramentas como Google Search Console, Screaming Frog, GTmetrix e PageSpeed Insights podem ajudar a identificar problemas técnicos que afetam o SEO. Uma auditoria técnica de SEO também pode revelar problemas menos óbvios.'
      },
      {
        question: 'O SEO técnico é mais importante que o SEO de conteúdo?',
        answer: 'Ambos são importantes e complementares. O SEO técnico garante que os motores de busca possam acessar e entender seu conteúdo adequadamente, enquanto o SEO de conteúdo garante que você tenha informações valiosas para oferecer. Um site precisa de ambos para ter bom desempenho nos motores de busca.'
      }
    ],
    related: ['aio', 'crawlability', 'core-web-vitals', 'schema-markup']
  },
  {
    slug: 'llm',
    title: 'LLM',
    shortDefinition: 'Large Language Model (Modelo de Linguagem de Grande Escala) - tipo de IA treinada em enormes datasets de texto capaz de gerar e compreender linguagem humana.',
    relevance: ['AIO', 'IA'],
    explanation: `<p>LLM (Large Language Model) ou Modelo de Linguagem de Grande Escala é uma classe de modelos de inteligência artificial especializados no processamento e geração de linguagem natural. Estes modelos são treinados em vastos conjuntos de dados textuais e aprendem padrões estatísticos que lhes permitem prever e gerar texto de forma coerente e contextualmente relevante.</p>
    <p>Exemplos populares de LLMs incluem o GPT-4 da OpenAI (que alimenta o ChatGPT), o Claude da Anthropic, o Gemini do Google, e o Llama da Meta.</p>`,
    influence: `<p>Os LLMs estão transformando significativamente o ecossistema digital e influenciam o AIO de várias formas:</p>
    <ul>
      <li>São a base de muitas ferramentas de busca e assistentes virtuais que usuários consultam para obter informações.</li>
      <li>Funcionam como "intermediários de informação", resumindo e referenciando conteúdo web em resposta a consultas dos usuários.</li>
      <li>Podem citar, recomendar ou parafrasear conteúdo web, determinando quais fontes recebem visibilidade e são consideradas autoridades.</li>
      <li>Estão mudando o comportamento de busca dos usuários, que cada vez mais esperam respostas diretas em vez de links para sites.</li>
    </ul>
    <p>Para criadores de conteúdo, entender como os LLMs processam e interpretam informações é crucial para otimizar conteúdo que possa ser efetivamente utilizado por estas tecnologias.</p>`,
    faqs: [
      {
        question: 'Como os LLMs encontram e utilizam informação da web?',
        answer: 'Existem múltiplos mecanismos. Alguns LLMs são treinados em snapshots da web e conteúdo publicado até uma certa data de corte. Outros têm capacidades de navegação web em tempo real ("web browsing") para acessar informação atualizada. Alguns combinam ambas as abordagens.'
      },
      {
        question: 'Os LLMs podem acessar todo o conteúdo da web?',
        answer: 'Não necessariamente. LLMs sem capacidade de navegação em tempo real dependem dos dados em que foram treinados. Mesmo aqueles com capacidades de navegação podem ter limitações técnicas, como dificuldade em acessar conteúdo por trás de paywalls ou em interpretar certas estruturas de páginas.'
      },
      {
        question: 'Como posso otimizar meu conteúdo para LLMs?',
        answer: 'Crie conteúdo claro, factual e bem estruturado. Use HTML semântico, forneça definições explícitas de termos técnicos, inclua dados estruturados (schema.org), organize informações em formato de perguntas e respostas, e mantenha informações factuais atualizadas e verificáveis.'
      }
    ],
    related: ['aio', 'e-e-a-t', 'schema-markup']
  },
  {
    slug: 'serp',
    title: 'SERP',
    shortDefinition: 'Search Engine Results Page (Página de Resultados de Mecanismo de Busca) - a página exibida por um motor de busca em resposta a uma consulta do usuário.',
    relevance: ['SEO'],
    explanation: `<p>SERP (Search Engine Results Page) ou Página de Resultados de Mecanismo de Busca é a página que um motor de busca exibe em resposta a uma consulta do usuário. As SERPs costumavam ser simplesmente uma lista de links para sites, mas evoluíram para incluir uma variedade de elementos e formatos.</p>
    <p>Uma SERP moderna pode conter resultados orgânicos (não pagos), resultados pagos (anúncios), rich snippets (resultados enriquecidos com informações adicionais), knowledge panels, carrosséis de imagens, mapas locais, vídeos, perguntas relacionadas e muitos outros elementos.</p>`,
    influence: `<p>As SERPs são o campo de batalha principal do SEO tradicional e continuam sendo extremamente relevantes mesmo na era da IA:</p>
    <ul>
      <li>A posição de um site na SERP afeta diretamente sua visibilidade e tráfego orgânico.</li>
      <li>Os elementos visuais de um resultado na SERP (como rich snippets) afetam a taxa de cliques.</li>
      <li>Compreender como as SERPs são construídas para diferentes tipos de consultas permite otimizar conteúdo para intenções específicas de busca.</li>
      <li>As SERPs estão evoluindo para incluir mais respostas diretas e conteúdo interativo, aproximando-se das interfaces de IA.</li>
    </ul>
    <p>Para uma estratégia de SEO eficaz, é essencial monitorar regularmente as SERPs para palavras-chave relevantes e entender como os resultados estão sendo apresentados.</p>`,
    faqs: [
      {
        question: 'Como melhorar a aparência do meu site nas SERPs?',
        answer: 'Implementar dados estruturados (schema.org) pode ajudar a obter rich snippets. Criar meta descrições otimizadas, usar títulos atraentes e responder diretamente a perguntas específicas também pode melhorar a apresentação nas SERPs.'
      },
      {
        question: 'As SERPs são iguais para todos os usuários?',
        answer: 'Não. Os resultados podem variar dependendo da localização, histórico de pesquisa, dispositivo, e outros fatores de personalização. Isto torna o acompanhamento de rankings mais complexo e ressalta a importância de otimizar para diversos tipos de usuários.'
      },
      {
        question: 'Como as SERPs estão mudando com a evolução da IA?',
        answer: 'As SERPs estão incorporando cada vez mais elementos baseados em IA, como respostas geradas diretamente, sugestões contextuais e interfaces conversacionais. Alguns motores de busca já estão experimentando com respostas de IA generativa diretamente na página de resultados.'
      }
    ],
    related: ['seo-tecnico', 'rich-snippets', 'zero-click-search', 'featured-snippet']
  },
  {
    slug: 'crawlability',
    title: 'Crawlability',
    shortDefinition: 'Capacidade de um site ser efetivamente rastreado por robôs de motores de busca para indexação e classificação.',
    relevance: ['SEO'],
    explanation: `<p>Crawlability refere-se à facilidade com que os crawlers (robôs ou spiders) dos motores de busca podem acessar e navegar por um website. É um conceito fundamental no SEO técnico, pois se um motor de busca não consegue rastrear adequadamente seu site, ele não conseguirá indexar suas páginas e, consequentemente, seu conteúdo não aparecerá nos resultados de busca.</p>
    <p>Fatores que afetam a crawlability incluem a estrutura do site, qualidade dos links internos, uso adequado do arquivo robots.txt, sitemap XML, tempo de resposta do servidor e erros de código HTTP.</p>`,
    influence: `<p>A crawlability impacta diretamente a visibilidade do seu site nos motores de busca:</p>
    <ul>
      <li>Um site com boa crawlability permite que os motores de busca descubram e indexem todas as páginas importantes.</li>
      <li>Problemas de crawlabilidade podem resultar em páginas importantes não sendo indexadas ou atualizadas.</li>
      <li>A eficiência do rastreamento influencia a frequência com que os motores de busca revisitam seu site para buscar atualizações.</li>
      <li>Uma arquitetura bem planejada ajuda os crawlers a entender a estrutura e hierarquia do seu conteúdo.</li>
    </ul>
    <p>Mesmo o conteúdo mais valioso e bem otimizado não terá desempenho nos motores de busca se houver problemas fundamentais de crawlability no site.</p>`,
    faqs: [
      {
        question: 'Como posso melhorar a crawlability do meu site?',
        answer: 'Crie uma estrutura de site clara e lógica, use links internos eficientes, forneça um sitemap XML atualizado, configure corretamente o arquivo robots.txt, elimine erros de servidor (como 404s), melhore a velocidade de carregamento e elimine redirecionamentos desnecessários.'
      },
      {
        question: 'Como sei se meu site tem problemas de crawlability?',
        answer: 'O Google Search Console oferece relatórios detalhados sobre como o Googlebot está rastreando seu site. Ferramentas como Screaming Frog podem simular o comportamento do crawler e identificar problemas. Sinais como queda na cobertura de indexação ou aumento de erros de rastreamento são indicadores de problemas.'
      },
      {
        question: 'Existe relação entre crawlability e AIO?',
        answer: 'Sim. Embora os modelos de IA possam acessar conteúdo de diferentes formas, muitos são treinados em dados obtidos por crawlers similares aos dos motores de busca. Além disso, alguns assistentes de IA com capacidades de navegação web em tempo real enfrentam desafios similares aos crawlers tradicionais ao acessar conteúdo web.'
      }
    ],
    related: ['seo-tecnico', 'indexabilidade', 'robots-txt', 'sitemap-xml']
  }
];

export const relatedTerms = {
  'e-e-a-t': {
    title: 'E-E-A-T',
    slug: 'e-e-a-t',
    shortDefinition: 'Experience, Expertise, Authority, Trustworthiness'
  },
  'schema-markup': {
    title: 'Schema Markup',
    slug: 'schema-markup',
    shortDefinition: 'Código que ajuda motores de busca a entender o conteúdo'
  },
  'core-web-vitals': {
    title: 'Core Web Vitals',
    slug: 'core-web-vitals',
    shortDefinition: 'Métricas de experiência do usuário usadas pelo Google'
  },
  'rich-snippets': {
    title: 'Rich Snippets',
    slug: 'rich-snippets',
    shortDefinition: 'Resultados de busca com informações adicionais'
  },
  'zero-click-search': {
    title: 'Zero-click Search',
    slug: 'zero-click-search',
    shortDefinition: 'Pesquisas onde o usuário obtém resposta sem clicar'
  },
  'featured-snippet': {
    title: 'Featured Snippet',
    slug: 'featured-snippet',
    shortDefinition: 'Box destacado no topo dos resultados de busca'
  },
  'indexabilidade': {
    title: 'Indexabilidade',
    slug: 'indexabilidade',
    shortDefinition: 'Capacidade de uma página ser adicionada ao índice'
  },
  'robots-txt': {
    title: 'Robots.txt',
    slug: 'robots-txt',
    shortDefinition: 'Arquivo que instrui crawlers sobre o que rastrear'
  },
  'sitemap-xml': {
    title: 'Sitemap XML',
    slug: 'sitemap-xml',
    shortDefinition: 'Arquivo que lista páginas para rastreamento'
  }
};
