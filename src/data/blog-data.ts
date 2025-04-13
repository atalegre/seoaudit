export const categories = ['SEO', 'AIO', 'IA', 'Técnico', 'Exemplos', 'Marketing Digital', 'E-commerce'];

export const blogPosts = [
  {
    slug: 'como-saber-se-seu-site-aparece-no-chatgpt',
    title: 'Como saber se o seu site aparece no ChatGPT',
    excerpt: 'Descubra se o seu conteúdo está sendo utilizado pelo ChatGPT e outros modelos de IA e como melhorar sua visibilidade.',
    date: '2023-11-15',
    category: 'AIO',
    imageSrc: 'https://images.unsplash.com/photo-1693760692649-dea1de44c0b1?q=80&w=3164&auto=format&fit=crop&ixlib=rb-4.0.3',
    popularity: 95,
    tags: ['ChatGPT', 'AIO', 'Visibilidade', 'Conteúdo'],
    headings: [
      { id: 'introducao', text: 'Introdução', level: 2 },
      { id: 'como-modelos-ia-acessam', text: 'Como os modelos de IA acessam conteúdo', level: 2 },
      { id: 'verificacao-no-chatgpt', text: 'Verificando se o seu site aparece no ChatGPT', level: 2 },
      { id: 'tecnicas-diretas', text: 'Técnicas diretas de verificação', level: 3 },
      { id: 'tecnicas-indiretas', text: 'Técnicas indiretas de verificação', level: 3 },
      { id: 'melhorar-visibilidade', text: 'Como melhorar a visibilidade para IA', level: 2 },
      { id: 'estrutura-conteudo', text: 'Estrutura de conteúdo', level: 3 },
      { id: 'conclusao', text: 'Conclusão', level: 2 },
    ],
    content: `
      <h2 id="introducao">Introdução</h2>
      <p>Com o avanço dos modelos de linguagem como o ChatGPT, uma nova preocupação surge para criadores de conteúdo: será que meu site está sendo encontrado e referenciado pelos grandes modelos de inteligência artificial?</p>
      <p>Esta questão é fundamental para a Otimização para Inteligência Artificial (AIO), um conceito relativamente novo mas cada vez mais importante no marketing digital.</p>

      <h2 id="como-modelos-ia-acessam">Como os modelos de IA acessam conteúdo</h2>
      <p>Antes de verificarmos se seu site aparece no ChatGPT, é importante entender como estes modelos acessam informação:</p>
      <ul>
        <li>Modelos como o GPT-4 são treinados com dados até uma data limite (conhecida como "knowledge cutoff")</li>
        <li>Alguns modelos possuem capacidade de navegar na web em tempo real para buscar informações atualizadas</li>
        <li>A maioria dos modelos de IA aprende de datasets massivos que incluem páginas web, livros e outros textos</li>
      </ul>

      <h2 id="verificacao-no-chatgpt">Verificando se o seu site aparece no ChatGPT</h2>
      
      <h3 id="tecnicas-diretas">Técnicas diretas de verificação</h3>
      <p>Existem algumas maneiras diretas de verificar se seu conteúdo está sendo utilizado pelo ChatGPT:</p>
      <ol>
        <li><strong>Pergunte diretamente</strong>: Faça perguntas específicas sobre informações que só existem no seu site</li>
        <li><strong>Solicite referências</strong>: Peça ao ChatGPT para citar fontes sobre um tema que você aborda</li>
        <li><strong>Teste conteúdo único</strong>: Se você tem conteúdo verdadeiramente original, teste com perguntas relacionadas</li>
      </ol>

      <h3 id="tecnicas-indiretas">Técnicas indiretas de verificação</h3>
      <p>Métodos indiretos também podem ajudar:</p>
      <ul>
        <li>Analise o tráfego vindo de bots que podem estar coletando dados para treinamento de IA</li>
        <li>Verifique menções do seu domínio em respostas da IA quando questionada sobre fontes</li>
        <li>Observe se há correlação entre seu conteúdo específico e as respostas geradas</li>
      </ul>

      <h2 id="melhorar-visibilidade">Como melhorar a visibilidade para IA</h2>
      <p>Se você descobriu que seu conteúdo não está sendo bem representado nos modelos de IA, aqui estão algumas estratégias para melhorar:</p>

      <h3 id="estrutura-conteudo">Estrutura de conteúdo</h3>
      <ul>
        <li>Use marcação semântica adequada (HTML5 com tags apropriadas)</li>
        <li>Organize informação em formato de perguntas e respostas</li>
        <li>Inclua resumos claros e concisos no início de artigos importantes</li>
        <li>Utilize metadados estruturados (Schema.org)</li>
        <li>Crie conteúdo factual e verificável que possa ser facilmente citado</li>
      </ul>

      <p>Além disso, estar presente em sites de alta autoridade e ter boas métricas de SEO tradicional também ajuda na visibilidade para IA, já que muitos crawlers de treinamento priorizam conteúdo bem classificado nos motores de busca.</p>

      <h2 id="conclusao">Conclusão</h2>
      <p>Verificar se seu site aparece no ChatGPT e outros modelos de IA não é uma ciência exata, mas com as técnicas acima você pode ter uma boa ideia da sua presença neste novo ecossistema digital.</p>
      <p>Lembre-se que a otimização para IA (AIO) trabalha em conjunto com o SEO tradicional. Um site bem otimizado para ambos terá maior chance de sucesso tanto nos resultados de busca quanto nas respostas geradas por IA.</p>
    `,
    keyLearning: `
      <ul>
        <li>Os modelos de IA como o ChatGPT acessam informações através de seus dados de treinamento e, em alguns casos, navegação web em tempo real.</li>
        <li>Você pode verificar se seu site está sendo usado pelo ChatGPT através de perguntas específicas sobre seu conteúdo único.</li>
        <li>Para melhorar a visibilidade para IA, estruture seu conteúdo com HTML semântico, use esquemas de dados estruturados e crie conteúdo que responda questões diretamente.</li>
        <li>A otimização para SEO tradicional e AIO se complementam e devem ser trabalhadas em conjunto.</li>
      </ul>
    `
  },
  {
    slug: 'checklist-otimizacao-seo-aio',
    title: 'Checklist para otimizar o seu site para motores de busca e IA',
    excerpt: 'Um guia completo com as principais ações para garantir que seu site seja bem classificado em motores de busca e modelos de IA.',
    date: '2023-12-05',
    category: 'SEO',
    imageSrc: 'https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3',
    popularity: 89,
    tags: ['SEO', 'AIO', 'Checklist', 'Otimização'],
    headings: [
      { id: 'introducao', text: 'Introdução', level: 2 },
      { id: 'tecnico', text: 'Otimização técnica', level: 2 },
      { id: 'velocidade', text: 'Velocidade de carregamento', level: 3 },
      { id: 'mobile', text: 'Otimização para dispositivos móveis', level: 3 },
      { id: 'conteudo', text: 'Otimização de conteúdo', level: 2 },
      { id: 'estrutura', text: 'Estrutura de conteúdo', level: 3 },
      { id: 'semantica', text: 'Semântica e contexto', level: 3 },
      { id: 'links', text: 'Links internos e externos', level: 2 },
      { id: 'especifico-ia', text: 'Otimização específica para IA', level: 2 },
      { id: 'metricas', text: 'Métricas para acompanhar', level: 2 },
      { id: 'conclusao', text: 'Conclusão', level: 2 },
    ],
    content: `
      <h2 id="introducao">Introdução</h2>
      <p>Otimizar um site hoje significa não apenas pensar nos motores de busca tradicionais como Google e Bing, mas também considerar como os modelos de IA interpretam e referenciam seu conteúdo.</p>
      <p>Este checklist abrangente ajudará você a garantir que seu site esteja otimizado tanto para SEO tradicional quanto para AIO (AI Optimization).</p>

      <h2 id="tecnico">Otimização técnica</h2>
      
      <h3 id="velocidade">Velocidade de carregamento</h3>
      <ul>
        <li>✅ Comprima imagens sem perder qualidade</li>
        <li>✅ Utilize CDN para distribuição de conteúdo</li>
        <li>✅ Minimize CSS e JavaScript</li>
        <li>✅ Implemente carregamento lazy para imagens e vídeos</li>
        <li>✅ Otimize o cache do navegador</li>
      </ul>

      <h3 id="mobile">Otimização para dispositivos móveis</h3>
      <ul>
        <li>✅ Garanta que o site seja responsivo</li>
        <li>✅ Teste em múltiplos dispositivos e tamanhos de tela</li>
        <li>✅ Certifique-se de que botões e links sejam facilmente clicáveis em telas touch</li>
        <li>✅ Priorize o conteúdo mais importante na visualização inicial</li>
      </ul>

      <h2 id="conteudo">Otimização de conteúdo</h2>
      
      <h3 id="estrutura">Estrutura de conteúdo</h3>
      <ul>
        <li>🤖 Use tags HTML semânticas (h1, h2, article, aside, etc.)</li>
        <li>🚀 Crie títulos claros e informativos</li>
        <li>✅ Utilize listas ordenadas e não ordenadas para organizar informações</li>
        <li>🤖 Inclua tabela de conteúdo para artigos longos</li>
        <li>🚀 Estruture conteúdo em formato de perguntas e respostas</li>
      </ul>

      <h3 id="semantica">Semântica e contexto</h3>
      <ul>
        <li>✅ Desenvolva conteúdo abrangente que responda às principais dúvidas</li>
        <li>🤖 Use entidades nomeadas para estabelecer contexto</li>
        <li>🚀 Defina termos técnicos ou específicos do seu nicho</li>
        <li>🤖 Estabeleça conexões claras entre conceitos relacionados</li>
      </ul>

      <h2 id="links">Links internos e externos</h2>
      <ul>
        <li>✅ Crie uma estrutura lógica de links internos</li>
        <li>✅ Use texto âncora descritivo e relevante</li>
        <li>✅ Cite fontes confiáveis com links externos</li>
        <li>✅ Mantenha links quebrados sob controle</li>
        <li>🤖 Conecte conteúdos relacionados de forma explícita</li>
      </ul>

      <h2 id="especifico-ia">Otimização específica para IA</h2>
      <ul>
        <li>🤖 Inclua resumos claros no início de artigos importantes</li>
        <li>🤖 Utilize Schema.org para marcar conteúdo estruturado</li>
        <li>🤖 Forneça dados em formato tabular quando apropriado</li>
        <li>🤖 Crie seções de FAQs para questões comuns</li>
        <li>🤖 Mantenha informações factuais atualizadas e verificáveis</li>
      </ul>

      <h2 id="metricas">Métricas para acompanhar</h2>
      <ul>
        <li>✅ Ranking nos motores de busca para palavras-chave relevantes</li>
        <li>✅ Tráfego orgânico (tanto geral quanto por página)</li>
        <li>🤖 Menções do seu site em ferramentas baseadas em IA</li>
        <li>🚀 Tempo de permanência e taxa de rejeição</li>
        <li>🚀 Compartilhamentos e citações externas</li>
      </ul>

      <h2 id="conclusao">Conclusão</h2>
      <p>A otimização para SEO e AIO compartilha muitos princípios fundamentais, mas também tem suas especificidades. O mais importante é criar conteúdo valioso, bem estruturado e facilmente acessível tanto para humanos quanto para máquinas.</p>
      <p>Seguindo este checklist e adaptando-o às necessidades específicas do seu site, você estará bem posicionado para ter sucesso tanto nos resultados de busca tradicionais quanto nas novas interfaces baseadas em IA que estão se tornando cada vez mais populares.</p>
    `,
    keyLearning: `
      <ul>
        <li>A otimização técnica como velocidade de carregamento e responsividade é fundamental tanto para SEO quanto para AIO.</li>
        <li>Estruture seu conteúdo com tags HTML semânticas e organize informações em formatos facilmente processáveis.</li>
        <li>Para otimização específica para IA, utilize resumos claros, dados estruturados e informações factuais verificáveis.</li>
        <li>Acompanhe métricas específicas de SEO e AIO para avaliar e ajustar sua estratégia continuamente.</li>
      </ul>
    `
  },
  {
    slug: 'aio-o-que-e-como-funciona',
    title: 'AIO: O que é e como funciona?',
    excerpt: 'Entenda o conceito de Otimização para Inteligência Artificial e como implementá-lo em sua estratégia de marketing digital.',
    date: '2024-01-20',
    category: 'AIO',
    imageSrc: 'https://images.unsplash.com/photo-1677442136019-21780ecad495?q=80&w=2832&auto=format&fit=crop&ixlib=rb-4.0.3',
    popularity: 97,
    tags: ['AIO', 'Inteligência Artificial', 'Estratégia', 'Digital'],
    headings: [
      { id: 'introducao', text: 'Introdução ao AIO', level: 2 },
      { id: 'ia-conteudo', text: 'Como a IA consome conteúdo', level: 2 },
      { id: 'diferenca-seo', text: 'Diferenças entre SEO e AIO', level: 2 },
      { id: 'principios', text: 'Princípios fundamentais do AIO', level: 2 },
      { id: 'estrategias', text: 'Estratégias práticas de AIO', level: 2 },
      { id: 'estrutura', text: 'Estruturação de conteúdo', level: 3 },
      { id: 'dados', text: 'Dados estruturados', level: 3 },
      { id: 'autoridade', text: 'Construção de autoridade', level: 3 },
      { id: 'futuro', text: 'O futuro do AIO', level: 2 },
      { id: 'conclusao', text: 'Conclusão', level: 2 },
    ],
    content: `
      <h2 id="introducao">Introdução ao AIO</h2>
      <p>AIO (AI Optimization) ou Otimização para Inteligência Artificial é um conjunto de práticas para garantir que seu conteúdo seja facilmente encontrado, interpretado e referenciado por sistemas de IA como ChatGPT, Bard e Bing Chat.</p>
      <p>Com o crescente uso destas ferramentas para busca de informações, ignorar o AIO significa potencialmente perder visibilidade em uma nova e importante forma de descoberta de conteúdo.</p>

      <h2 id="ia-conteudo">Como a IA consome conteúdo</h2>
      <p>Para entender o AIO, primeiro precisamos compreender como os sistemas de IA processam e utilizam conteúdo web:</p>
      <ul>
        <li>Treinamento inicial com grandes datasets que incluem conteúdo web</li>
        <li>Capacidade de navegação web em tempo real (em alguns modelos)</li>
        <li>Processamento de linguagem natural para compreensão de contexto</li>
        <li>Análise de relacionamentos entre entidades e conceitos</li>
        <li>Processamento de dados estruturados e metadados</li>
      </ul>

      <h2 id="diferenca-seo">Diferenças entre SEO e AIO</h2>
      <p>Embora SEO e AIO tenham semelhanças, existem diferenças importantes:</p>
      
      <table>
        <tr>
          <th>SEO</th>
          <th>AIO</th>
        </tr>
        <tr>
          <td>Foco em palavras-chave</td>
          <td>Foco em contexto semântico</td>
        </tr>
        <tr>
          <td>Otimiza para classificação em SERPs</td>
          <td>Otimiza para menções e citações por IA</td>
        </tr>
        <tr>
          <td>Links são cruciais</td>
          <td>Informação factual verificável é crucial</td>
        </tr>
        <tr>
          <td>Conteúdo otimizado para cliques</td>
          <td>Conteúdo otimizado para responder perguntas</td>
        </tr>
      </table>

      <h2 id="principios">Princípios fundamentais do AIO</h2>
      <p>O AIO se baseia em alguns princípios fundamentais:</p>
      <ol>
        <li><strong>Clareza:</strong> Informação direta e facilmente processável</li>
        <li><strong>Estrutura:</strong> Organização lógica do conteúdo</li>
        <li><strong>Contexto:</strong> Relações claras entre conceitos</li>
        <li><strong>Verificabilidade:</strong> Informações factuais e rastreáveis</li>
        <li><strong>Autoridade:</strong> Estabelecimento como fonte confiável</li>
      </ol>

      <h2 id="estrategias">Estratégias práticas de AIO</h2>
      
      <h3 id="estrutura">Estruturação de conteúdo</h3>
      <ul>
        <li>Use HTML semântico (h1-h6, article, section, etc.)</li>
        <li>Crie resumos claros no início dos artigos</li>
        <li>Estruture informações em lista de tópicos quando apropriado</li>
        <li>Utilize formato de perguntas e respostas (FAQ)</li>
        <li>Forneça definições claras para termos específicos</li>
      </ul>

      <h3 id="dados">Dados estruturados</h3>
      <ul>
        <li>Implemente Schema.org para marcar conteúdo</li>
        <li>Use marcações específicas para tipos de conteúdo (artigos, produtos, FAQs)</li>
        <li>Forneça dados em formato tabular quando relevante</li>
        <li>Inclua metadados descritivos e explícitos</li>
      </ul>

      <h3 id="autoridade">Construção de autoridade</h3>
      <ul>
        <li>Crie conteúdo factual e bem pesquisado</li>
        <li>Cite fontes confiáveis e autoridades no assunto</li>
        <li>Atualize regularmente conteúdo para manter precisão</li>
        <li>Construa uma rede de menções e referências cruzadas</li>
      </ul>

      <h2 id="futuro">O futuro do AIO</h2>
      <p>O campo de AIO está em constante evolução, com algumas tendências emergentes:</p>
      <ul>
        <li>Maior integração entre SEO tradicional e AIO</li>
        <li>Desenvolvimento de ferramentas específicas para análise de AIO</li>
        <li>Aumento da importância de dados estruturados</li>
        <li>Crescente relevância de marcação semântica avançada</li>
        <li>Foco em respostas diretas para consultas específicas</li>
      </ul>

      <h2 id="conclusao">Conclusão</h2>
      <p>O AIO representa uma evolução natural do marketing digital na era da IA. Ao compreender como os sistemas de IA processam e utilizam informações, você pode otimizar seu conteúdo para maximizar visibilidade não apenas em motores de busca tradicionais, mas também nas novas interfaces baseadas em inteligência artificial.</p>
      <p>Implementar estratégias de AIO agora pode dar a sua empresa ou site uma vantagem competitiva significativa em um campo que ainda está se desenvolvendo, mas que certamente terá um papel cada vez mais importante no futuro do marketing digital.</p>
    `,
    keyLearning: `
      <ul>
        <li>AIO (AI Optimization) é um conjunto de práticas para tornar seu conteúdo facilmente encontrado e referenciado por sistemas de IA.</li>
        <li>Diferente do SEO tradicional, o AIO foca mais em contexto semântico, informação factual verificável e estrutura clara para responder perguntas diretamente.</li>
        <li>Estratégias práticas incluem usar HTML semântico, implementar Schema.org e construir autoridade com conteúdo bem pesquisado e fontes confiáveis.</li>
        <li>O AIO está em evolução constante e representará uma parte cada vez mais importante da estratégia de marketing digital no futuro.</li>
      </ul>
    `
  },
  {
    slug: 'inteligencia-artificial-marketing-digital-2025',
    title: 'O Futuro da Inteligência Artificial no Marketing Digital em 2025',
    excerpt: 'Descubra como a IA vai revolucionar as estratégias de marketing digital nos próximos anos e como se preparar para essas mudanças.',
    date: '2024-03-15',
    category: 'IA',
    imageSrc: 'https://images.unsplash.com/photo-1677442136019-21780ecad495?q=80&w=2832&auto=format&fit=crop&ixlib=rb-4.0.3',
    popularity: 88,
    tags: ['IA', 'Marketing Digital', 'Tendências', 'Futuro'],
    headings: [
      { id: 'introducao', text: 'Introdução', level: 2 },
      { id: 'tendencias-ia-2025', text: 'Tendências de IA para 2025', level: 2 },
      { id: 'aplicacoes-praticas', text: 'Aplicações práticas no marketing', level: 2 },
      { id: 'desafios-oportunidades', text: 'Desafios e oportunidades', level: 2 },
      { id: 'conclusao', text: 'Conclusão', level: 2 },
    ],
    content: `
      <h2 id="introducao">Introdução</h2>
      <p>A inteligência artificial está transformando rapidamente o cenário do marketing digital, e até 2025, essas mudanças serão ainda mais profundas...</p>
    `,
    keyLearning: `
      <ul>
        <li>A IA preditiva será fundamental para personalização em escala até 2025.</li>
        <li>Chatbots e assistentes virtuais serão indistinguíveis de atendentes humanos.</li>
        <li>Análise de dados em tempo real permitirá ajustes instantâneos de campanhas.</li>
        <li>Empresas sem estratégia de IA ficarão significativamente para trás da concorrência.</li>
      </ul>
    `
  },
  {
    slug: 'otimizacao-ecommerce-aio-seo',
    title: 'Guia Completo: Otimização de E-commerce com AIO e SEO',
    excerpt: 'Estratégias avançadas para aumentar a visibilidade do seu e-commerce tanto em buscadores tradicionais quanto em interfaces de IA.',
    date: '2024-03-20',
    category: 'E-commerce',
    imageSrc: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3',
    popularity: 92,
    tags: ['E-commerce', 'SEO', 'AIO', 'Vendas Online'],
    headings: [
      { id: 'introducao', text: 'Introdução', level: 2 },
      { id: 'desafios-ecommerce', text: 'Desafios específicos de e-commerce', level: 2 },
      { id: 'estrategias-seo', text: 'Estratégias de SEO para lojas virtuais', level: 2 },
      { id: 'aio-ecommerce', text: 'AIO aplicado ao e-commerce', level: 2 },
      { id: 'casos-sucesso', text: 'Casos de sucesso', level: 2 },
      { id: 'conclusao', text: 'Conclusão', level: 2 },
    ],
    content: `
      <h2 id="introducao">Introdução</h2>
      <p>O e-commerce está em constante evolução e as estratégias de otimização precisam acompanhar esse ritmo para garantir visibilidade e conversões...</p>
    `,
    keyLearning: `
      <ul>
        <li>A estrutura do site e a arquitetura da informação são cruciais para e-commerce.</li>
        <li>Metadados de produtos bem estruturados ajudam tanto no SEO quanto no AIO.</li>
        <li>Reviews e UGC aumentam significativamente a visibilidade em interfaces de IA.</li>
        <li>A velocidade da página é um fator crítico para rankings e taxas de conversão.</li>
      </ul>
    `
  },
  {
    slug: 'estrategias-marketing-conteudo-2024',
    title: 'Estratégias de Marketing de Conteúdo que Realmente Funcionam em 2024',
    excerpt: 'Descubra as abordagens mais eficazes para criar conteúdo que engaja, converte e posiciona sua marca como autoridade no mercado atual.',
    date: '2024-03-25',
    category: 'Marketing Digital',
    imageSrc: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.0.3',
    popularity: 90,
    tags: ['Marketing de Conteúdo', 'Engajamento', 'Conversão', 'Autoridade'],
    headings: [
      { id: 'introducao', text: 'Introdução', level: 2 },
      { id: 'estado-atual', text: 'O estado atual do marketing de conteúdo', level: 2 },
      { id: 'tipos-conteudo', text: 'Tipos de conteúdo com maior impacto', level: 2 },
      { id: 'distribuicao', text: 'Estratégias de distribuição', level: 2 },
      { id: 'medicao-resultados', text: 'Medição de resultados', level: 2 },
      { id: 'casos-estudo', text: 'Casos de estudo', level: 2 },
      { id: 'conclusao', text: 'Conclusão', level: 2 },
    ],
    content: `
      <h2 id="introducao">Introdução</h2>
      <p>O marketing de conteúdo continua sendo uma das estratégias mais eficazes para atrair e reter clientes, mas o que realmente funciona em 2024?</p>
    `,
    keyLearning: `
      <ul>
        <li>Conteúdo interativo gera 2x mais engajamento que conteúdo estático.</li>
        <li>Estratégias multicanal aumentam significativamente o alcance e as conversões.</li>
        <li>Conteúdo gerado por usuários (UGC) aumenta a confiança e autenticidade da marca.</li>
        <li>Métricas de engajamento são tão importantes quanto métricas de conversão.</li>
      </ul>
    `
  },
  {
    slug: 'seo-para-voice-search',
    title: 'SEO para Pesquisa por Voz: O Guia Definitivo',
    excerpt: 'Como otimizar seu site para assistentes virtuais como Alexa, Google Assistant e Siri, capturando o crescente tráfego de pesquisas por voz.',
    date: '2024-04-01',
    category: 'SEO',
    imageSrc: 'https://images.unsplash.com/photo-1519558260268-cde7e03a0152?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3',
    popularity: 85,
    tags: ['Voice Search', 'SEO', 'Assistentes Virtuais', 'Mobile'],
    headings: [
      { id: 'introducao', text: 'Introdução', level: 2 },
      { id: 'comportamento', text: 'Comportamento de pesquisa por voz', level: 2 },
      { id: 'palavras-chave', text: 'Estratégia de palavras-chave para voz', level: 2 },
      { id: 'schema', text: 'Dados estruturados e schema', level: 2 },
      { id: 'faq-optimization', text: 'Otimização de FAQs', level: 2 },
      { id: 'mobile-speed', text: 'Velocidade mobile', level: 2 },
      { id: 'local-seo', text: 'SEO local para voice search', level: 2 },
      { id: 'conclusao', text: 'Conclusão', level: 2 },
    ],
    content: `
      <h2 id="introducao">Introdução</h2>
      <p>A pesquisa por voz está transformando a maneira como os usuários encontram informações online, com previsões indicando que mais de 50% das buscas serão feitas por voz nos próximos anos...</p>
    `,
    keyLearning: `
      <ul>
        <li>Pesquisas por voz são tipicamente mais longas e conversacionais que pesquisas digitadas.</li>
        <li>Featured snippets são frequentemente a fonte das respostas dos assistentes de voz.</li>
        <li>Otimização para perguntas específicas (quem, o que, quando, onde, por que, como) é essencial.</li>
        <li>Velocidade de carregamento mobile e dados estruturados são fatores cruciais para ranking em voice search.</li>
      </ul>
    `
  }
];
