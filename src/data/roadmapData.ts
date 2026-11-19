import { DiscLetter, DiscPercentages, RoadmapTrack } from '../types/disc';

export const ROADMAP_SH_DESIGN_HUB_URL = 'https://roadmap.sh/roadmaps?g=Design';

export const ROADMAP_TRACKS: RoadmapTrack[] = [
  // ============================================================================
  // DESIGN ROADMAPS (https://roadmap.sh/roadmaps?g=Design)
  // ============================================================================
  {
    id: 'ux-design',
    title: 'UX Design',
    category: 'design',
    categoryLabel: 'Design (roadmap.sh?g=Design)',
    url: 'https://roadmap.sh/ux-design',
    primaryDisc: 'I',
    secondaryDisc: 'S',
    weights: { D: 0.15, I: 0.40, S: 0.25, C: 0.20 },
    overview:
      'Trilha oficial de User Experience do roadmap.sh: cobre estratégia de negócio, pesquisa qualitativa com usuários, arquitetura de informação, wireframes e ciência comportamental.',
    discAdvice: {
      D: 'Use sua objetividade para transformar entrevistas em decisões rápidas de fluxo, evitando protótipos longos sem validação.',
      I: 'Sua empatia e comunicação brilham nas entrevistas de pesquisa e condução de dinâmicas com usuários e stakeholders.',
      S: 'Sua escuta paciente ajuda a captar dores sutis nas pesquisas sem induzir respostas dos participantes.',
      C: 'Seu rigor analítico fortalece heurísticas de usabilidade, acessibilidade e organização lógica da arquitetura de informação.',
    },
    stages: [
      {
        step: '01',
        title: 'Produto & Estratégia de Negócio',
        summary: 'Entender objetivos do negócio antes de desenhar telas.',
        topics: [
          'Resultados esperados, atores e ações-chave',
          'Business Model Canvas & Lean Canvas',
          'Análise de concorrentes (SWOT e Cinco Forças)',
        ],
      },
      {
        step: '02',
        title: 'UX Research & Definição do Usuário',
        summary: 'Investigar necessidades reais por meio de entrevistas e síntese.',
        topics: [
          'Objetivos de pesquisa e planejamento de recursos',
          'Perguntas abertas/fechadas, técnica de funil e testes piloto',
          'Criação de Personas e Mapas de Empatia',
        ],
      },
      {
        step: '03',
        title: 'Design Conceitual & Arquitetura',
        summary: 'Estruturar fluxos antes da interface visual.',
        topics: [
          'Backlog de produto e User Stories',
          'Fluxogramas (Flowcharts) e BPMN',
          'Mapas de Experiência do Cliente (Customer Journey)',
        ],
      },
      {
        step: '04',
        title: 'Prototipação & Wireframing',
        summary: 'Traduzir fluxos em telas testáveis.',
        topics: [
          'Regras de layout e hierarquia visual',
          'Wireframes de baixa fidelidade e fluxos interativos',
          'Prototipação no Figma e validação de acessibilidade',
        ],
      },
      {
        step: '05',
        title: 'Padrões de UX & Ciência Comportamental',
        summary: 'Reduzir atrito cognitivo e elevar conversão com ética.',
        topics: [
          'Redução de sobrecarga cognitiva e excesso de opções',
          'CTAs claros e feedback visual imediato',
          'Heurísticas de usabilidade e mudança de comportamento',
        ],
      },
    ],
  },
  {
    id: 'product-design',
    title: 'Product Design',
    category: 'design',
    categoryLabel: 'Design (roadmap.sh?g=Design)',
    url: 'https://roadmap.sh/product-design',
    primaryDisc: 'I',
    secondaryDisc: 'D',
    weights: { D: 0.25, I: 0.35, S: 0.20, C: 0.20 },
    overview:
      'Trilha completa de Product Designer do roadmap.sh: conecta pesquisa (Discover), definição de problema (JTBD), estratégia de produto (OKRs), validação, handoff e métricas HEART.',
    discAdvice: {
      D: 'Ótima trilha para quem gosta de cruzar design com estratégia de produto, priorização e metas de negócio.',
      I: 'Ideal para articular Product Discovery com PMs, devs e usuários finais, mantendo a visão centrada nas pessoas.',
      S: 'Sustente o ciclo contínuo de validação e design critique garantindo consistência entre entregas.',
      C: 'Destaque-se estruturando testes de usabilidade rigorosos, acessibilidade (a11y) e leitura analítica de testes A/B.',
    },
    stages: [
      {
        step: '01',
        title: 'Discover (Pesquisa & Contexto)',
        summary: 'Coletar evidências reais sobre comportamento e dores.',
        topics: [
          'Entrevistas com usuários e Contextual Inquiry',
          'Pesquisas quantitativas, mapas de calor e gravações de sessão',
          'Mapas de jornada e repositório de pesquisa',
        ],
      },
      {
        step: '02',
        title: 'Frame the Problem',
        summary: 'Transformar achados em problemas claros para resolver.',
        topics: [
          'Jobs-to-be-Done (JTBD) e síntese de personas',
          'Perguntas "How Might We" (HMW)',
          'Árvore de oportunidades (Opportunity Solution Trees)',
        ],
      },
      {
        step: '03',
        title: 'Estratégia & Lean UX',
        summary: 'Alinhar design com metas de produto e viabilidade técnica.',
        topics: [
          'Visão de produto, proposta de valor e OKRs/KPIs',
          'Mapeamento de suposições e riscos com engenharia',
          'Workshops ágeis de Design Sprint e ideação',
        ],
      },
      {
        step: '04',
        title: 'Execução, Validação & Handoff',
        summary: 'Desenhar, testar e entregar com clareza para o time dev.',
        topics: [
          'User flows, protótipos interativos e testes de usabilidade',
          'Acessibilidade (a11y) e Design Critiques em equipe',
          'Design Handoff estruturado e conexão com Design System',
        ],
      },
      {
        step: '05',
        title: 'Mensuração & Iteração Contínua',
        summary: 'Medir impacto após o lançamento em produção.',
        topics: [
          'Product Analytics e Framework HEART',
          'Experimentos e Testes A/B com Feature Flags',
          'Ciclos contínuos de melhoria baseados em dados reais',
        ],
      },
    ],
  },
  {
    id: 'design-system',
    title: 'Design System',
    category: 'design',
    categoryLabel: 'Design (roadmap.sh?g=Design)',
    url: 'https://roadmap.sh/design-system',
    primaryDisc: 'C',
    secondaryDisc: 'S',
    weights: { D: 0.15, I: 0.20, S: 0.25, C: 0.40 },
    overview:
      'Trilha especializada de Design System do roadmap.sh: ensina Atomic Design, auditoria visual, arquitetura de Design Tokens (claro/escuro), componentes reutilizáveis e governança Figma → Código.',
    discAdvice: {
      D: 'Foque em governança prática para destravar adoção do Design System entre várias squads sem virar gargalo.',
      I: 'Use sua comunicação para evangelizar designers e devs, documentando diretrizes de marca e tom de voz.',
      S: 'Sua consistência é essencial para manter bibliotecas padronizadas e evolução previsível de versões.',
      C: 'Trilha sob medida para perfis analíticos: exige precisão em tokens semânticos, breakpoints, contraste e acessibilidade.',
    },
    stages: [
      {
        step: '01',
        title: 'Fundamentos & Atomic Design',
        summary: 'Diferenciar UI Kit, biblioteca de componentes e sistema vivo.',
        topics: [
          'Design System vs. Component Library',
          'Metodologia Atomic Design (Átomos, Moléculas, Organismos)',
          'Modelo de governança e contribuição entre times',
        ],
      },
      {
        step: '02',
        title: 'Auditoria Visual & Linguagem',
        summary: 'Mapear inconsistências atuais e definir princípios.',
        topics: [
          'Inventário de UI (cores, ícones, espaçamentos e tipografia)',
          'Tom de voz, terminologia e diretrizes de marca',
          'Critérios de acessibilidade (WCAG) e clareza visual',
        ],
      },
      {
        step: '03',
        title: 'Design Tokens & Regras de Tema',
        summary: 'Criar a camada matemática compartilhada entre design e código.',
        topics: [
          'Tokens semânticos de cor e regras de Modo Claro / Escuro',
          'Grids, breakpoints responsivos e escalas de espaçamento',
          'Escalas tipográficas e tokens de elevação/borda',
        ],
      },
      {
        step: '04',
        title: 'Componentes, Versionamento & Handoff',
        summary: 'Escalar componentes documentados para produção.',
        topics: [
          'Anatomia de componentes base (botões, inputs, modais, tabelas)',
          'Estados interativos (hover, focus, disabled, erro)',
          'Plugins, controle de versão e sincronização Figma e React/CSS',
        ],
      },
    ],
  },

  // ============================================================================
  // ENGINEERING, PRODUCT, DATA & INFRA ROADMAPS (roadmap.sh)
  // ============================================================================
  {
    id: 'frontend',
    title: 'Frontend Developer',
    category: 'engineering',
    categoryLabel: 'Engenharia (roadmap.sh)',
    url: 'https://roadmap.sh/frontend',
    primaryDisc: 'I',
    secondaryDisc: 'C',
    weights: { D: 0.20, I: 0.30, S: 0.20, C: 0.30 },
    overview:
      'Trilha de Frontend do roadmap.sh: fundamentos da web, HTML/CSS semântico, JavaScript moderno, React/TypeScript, acessibilidade e performance.',
    discAdvice: {
      D: 'Coloque aplicações reais no ar cedo para manter o ritmo de aprendizado visual e prático.',
      I: 'Aproveite sua afinidade visual para unir UX, micro-interações e colaboração próxima com designers.',
      S: 'Construa uma base sólida em HTML, CSS e JavaScript puro antes de pular para frameworks avançados.',
      C: 'Aprofunde-se em TypeScript estrito, testes automatizados de UI e Core Web Vitals.',
    },
    stages: [
      {
        step: '01',
        title: 'Internet, HTML & CSS Moderno',
        summary: 'Como navegadores funcionam e layout responsivo.',
        topics: ['HTTP, DNS e browsers', 'HTML semântico e acessibilidade', 'Flexbox, Grid e Design Responsivo'],
      },
      {
        step: '02',
        title: 'JavaScript, Git & Ecossistema',
        summary: 'Lógica de programação no navegador e versionamento.',
        topics: ['DOM, eventos e Fetch API', 'ES6+, async/await e TypeScript', 'Git, GitHub e gerenciadores de pacotes'],
      },
      {
        step: '03',
        title: 'Frameworks, Estado & Qualidade',
        summary: 'Construção de interfaces escaláveis em produção.',
        topics: ['React / Next.js e Tailwind CSS', 'Testes (Vitest / Playwright)', 'Performance e segurança web'],
      },
    ],
  },
  {
    id: 'backend',
    title: 'Backend Developer',
    category: 'engineering',
    categoryLabel: 'Engenharia (roadmap.sh)',
    url: 'https://roadmap.sh/backend',
    primaryDisc: 'C',
    secondaryDisc: 'S',
    weights: { D: 0.15, I: 0.10, S: 0.35, C: 0.40 },
    overview:
      'Trilha de Backend do roadmap.sh: lógica no servidor, bancos SQL/NoSQL, APIs REST/GraphQL, autenticação, cache e mensageria.',
    discAdvice: {
      D: 'Construa uma API completa de ponta a ponta rápido, depois refine índices e arquitetura.',
      I: 'Documente bem seus contratos OpenAPI para facilitar a integração com toda a squad.',
      S: 'Sua constância ajuda a dominar modelagem relacional, migrations seguras e código sustentável.',
      C: 'Explore a fundo consistência transacional, segurança de APIs (OWASP) e padrões arquiteturais.',
    },
    stages: [
      {
        step: '01',
        title: 'Linguagem, SO & Git',
        summary: 'Base sólida de programação no servidor.',
        topics: ['Node.js, Python, Java ou Go', 'Terminal Linux e redes básicas', 'Git e controle de versão'],
      },
      {
        step: '02',
        title: 'Bancos de Dados & APIs',
        summary: 'Persistência segura e comunicação entre serviços.',
        topics: ['SQL (PostgreSQL) e modelagem', 'APIs REST, status HTTP e OpenAPI', 'Autenticação JWT, OAuth e sessões'],
      },
      {
        step: '03',
        title: 'Cache, Testes & Escalabilidade',
        summary: 'Confiabilidade e performance sob carga.',
        topics: ['Redis, filas e mensageria', 'Testes unitários e de integração', 'Docker, CI/CD e observabilidade'],
      },
    ],
  },
  {
    id: 'product-manager',
    title: 'Product Manager',
    category: 'product-data',
    categoryLabel: 'Produto & Dados (roadmap.sh)',
    url: 'https://roadmap.sh/product-manager',
    primaryDisc: 'I',
    secondaryDisc: 'D',
    weights: { D: 0.35, I: 0.40, S: 0.10, C: 0.15 },
    overview:
      'Trilha de Product Management do roadmap.sh: estratégia de produto, discovery com clientes, métricas de negócio, priorização e alinhamento ágil.',
    discAdvice: {
      D: 'Equilibre velocidade de priorização com validação de hipóteses reais junto aos clientes.',
      I: 'Excelente encaixe para articular visão de produto entre UX Design, Engenharia e Diretoria.',
      S: 'Use seu perfil colaborativo para proteger a cadência sustentável do time e evitar escopo inflado.',
      C: 'Apoie suas decisões de roadmap em funis de conversão, coortes e critérios objetivos.',
    },
    stages: [
      {
        step: '01',
        title: 'Product Thinking & Discovery',
        summary: 'Validar problemas antes de construir funcionalidades.',
        topics: ['Entrevistas de descoberta e personas', 'Proposta de valor e modelos de negócio', 'Análise de mercado'],
      },
      {
        step: '02',
        title: 'Priorização & Execução Ágil',
        summary: 'Transformar estratégia em backlog executável.',
        topics: ['OKRs, PRDs e User Stories', 'RICE, MoSCoW e Matriz Impacto x Esforço', 'Parceria com Design e Engenharia'],
      },
      {
        step: '03',
        title: 'Métricas & Crescimento',
        summary: 'Medir retenção, ativação e resultado de negócio.',
        topics: ['Funis de produto e retenção', 'Testes A/B e lançamento gradual', 'Go-to-market e feedback loops'],
      },
    ],
  },
  {
    id: 'qa',
    title: 'QA Engineer',
    category: 'engineering',
    categoryLabel: 'Engenharia (roadmap.sh)',
    url: 'https://roadmap.sh/qa',
    primaryDisc: 'C',
    secondaryDisc: 'S',
    weights: { D: 0.10, I: 0.10, S: 0.35, C: 0.45 },
    overview:
      'Trilha de Quality Assurance do roadmap.sh: fundamentos de testes manuais, planos de teste, testes de API, automação E2E e integração em CI/CD.',
    discAdvice: {
      D: 'Priorize automação nos fluxos críticos de negócio para gerar retorno rápido nas entregas.',
      I: 'Comunique bugs de forma construtiva e colaborativa aproximando QA, Design e Devs.',
      S: 'Sua paciência metódica mantém suítes de regressão estáveis e confiáveis a cada release.',
      C: 'Perfil natural para desenhar matrizes de edge cases, testes de contrato e validação rigorosa.',
    },
    stages: [
      {
        step: '01',
        title: 'Fundamentos & Testes Manuais',
        summary: 'Mentalidade crítica e documentação clara de falhas.',
        topics: ['Ciclo de vida de bugs e Bug Reports', 'Testes exploratórios e funcionais', 'Critérios de aceitação e BDD'],
      },
      {
        step: '02',
        title: 'Testes de API & Automação Web',
        summary: 'Evoluir de testes manuais para código automatizado.',
        topics: ['Postman e contratos REST', 'Playwright ou Cypress (E2E)', 'Seletores estáveis e massa de dados'],
      },
      {
        step: '03',
        title: 'Qualidade Contínua (CI/CD)',
        summary: 'Garantir qualidade automática antes de produção.',
        topics: ['Integração em GitHub Actions', 'Testes de carga e performance', 'Acessibilidade e segurança básica'],
      },
    ],
  },
  {
    id: 'data-analyst',
    title: 'Data Analyst',
    category: 'product-data',
    categoryLabel: 'Produto & Dados (roadmap.sh)',
    url: 'https://roadmap.sh/data-analyst',
    primaryDisc: 'C',
    secondaryDisc: 'S',
    weights: { D: 0.15, I: 0.20, S: 0.25, C: 0.40 },
    overview:
      'Trilha de Data Analyst do roadmap.sh: estatística aplicada, planilhas avançadas, SQL, visualização de dados (BI) e Python para análise.',
    discAdvice: {
      D: 'Sempre conecte os gráficos às decisões práticas que o negócio precisa tomar hoje.',
      I: 'Capriche no storytelling visual dos dashboards para engajar áreas não técnicas.',
      S: 'Mantenha rotinas organizadas de limpeza e validação para garantir confiança nos indicadores.',
      C: 'Sua precisão evita armadilhas estatísticas e garante integridade nos cruzamentos SQL.',
    },
    stages: [
      {
        step: '01',
        title: 'Planilhas & Estatística Básica',
        summary: 'Responder perguntas de negócio com base quantitativa.',
        topics: ['Excel / Google Sheets avançado', 'Média, mediana, dispersão e correlação', 'KPIs e métricas de negócio'],
      },
      {
        step: '02',
        title: 'SQL & Visualização (BI)',
        summary: 'Consultar bancos reais e construir painéis claros.',
        topics: ['SQL (JOINs, CTEs, Window Functions)', 'Power BI, Looker Studio ou Tableau', 'Boas práticas de gráficos'],
      },
      {
        step: '03',
        title: 'Python & Análise Exploratória',
        summary: 'Automatizar análises de grandes volumes de dados.',
        topics: ['Pandas e NumPy', 'Limpeza e tratamento de dados', 'Apresentação executiva de insights'],
      },
    ],
  },
  {
    id: 'devops',
    title: 'DevOps / SRE',
    category: 'infra-sec',
    categoryLabel: 'Infra & Segurança (roadmap.sh)',
    url: 'https://roadmap.sh/devops',
    primaryDisc: 'S',
    secondaryDisc: 'C',
    weights: { D: 0.15, I: 0.10, S: 0.45, C: 0.30 },
    overview:
      'Trilha de DevOps & SRE do roadmap.sh: Linux, redes, containers (Docker/Kubernetes), Infraestrutura como Código, CI/CD e observabilidade.',
    discAdvice: {
      D: 'Automatize primeiro os gargalos manuais que mais travam deploys da equipe.',
      I: 'Promova cultura de Blameless Post-Mortem e colaboração entre dev e operações.',
      S: 'Sua calma sob incidentes e disciplina operacional são o coração de times SRE.',
      C: 'Domine IaC, SLOs e segurança de pipelines com precisão reproduzível.',
    },
    stages: [
      {
        step: '01',
        title: 'Linux, Redes & Terminal',
        summary: 'Entender sistemas operacionais e conectividade.',
        topics: ['Administração Linux e Bash', 'DNS, HTTP/HTTPS, TLS e firewalls', 'Git e fluxos de trabalho'],
      },
      {
        step: '02',
        title: 'Containers, Cloud & CI/CD',
        summary: 'Empacotar e publicar software com previsibilidade.',
        topics: ['Docker e Kubernetes', 'AWS / GCP / Azure fundamentos', 'Pipelines automatizadas (GitHub Actions)'],
      },
      {
        step: '03',
        title: 'IaC & Observabilidade',
        summary: 'Infraestrutura versionada e monitoramento ativo.',
        topics: ['Terraform e gestão de configuração', 'Logs, métricas e tracing (Grafana/Prometheus)', 'SLIs, SLOs e resposta a incidentes'],
      },
    ],
  },
  {
    id: 'cyber-security',
    title: 'Cyber Security / AppSec',
    category: 'infra-sec',
    categoryLabel: 'Infra & Segurança (roadmap.sh)',
    url: 'https://roadmap.sh/cyber-security',
    primaryDisc: 'C',
    secondaryDisc: 'D',
    weights: { D: 0.25, I: 0.05, S: 0.20, C: 0.50 },
    overview:
      'Trilha de Cibersegurança do roadmap.sh: fundamentos de redes e criptografia, OWASP Top 10, gestão de vulnerabilidades, governança e resposta a incidentes.',
    discAdvice: {
      D: 'Comunique riscos críticos de forma firme e propositiva para não travar o negócio sem alternativa.',
      I: 'Traduza boas práticas de segurança e LGPD em treinamentos simples para toda a empresa.',
      S: 'Mantenha consistência em auditorias periódicas, controle de acessos e monitoramento.',
      C: 'Perfil ideal para Threat Modeling, investigação forense e conformidade rigorosa.',
    },
    stages: [
      {
        step: '01',
        title: 'Redes, Sistemas & Fundamentos',
        summary: 'Base sólida de protocolos, acessos e criptografia.',
        topics: ['Tríade CIA e gestão de identidade (IAM)', 'Redes TCP/IP, DNS e TLS', 'Linux e hardening básico'],
      },
      {
        step: '02',
        title: 'Segurança de Aplicações & Riscos',
        summary: 'Identificar falhas comuns antes da exploração.',
        topics: ['OWASP Top 10 e Threat Modeling', 'Scanners SAST/DAST e revisão de dependências', 'Governança, riscos e LGPD'],
      },
      {
        step: '03',
        title: 'Defesa, Monitoramento & Resposta',
        summary: 'Detectar anomalias e mitigar incidentes.',
        topics: ['SIEM e análise de logs suspeitos', 'Planos de resposta a incidentes', 'Cultura DevSecOps'],
      },
    ],
  },
  {
    id: 'software-architect',
    title: 'Software Architect',
    category: 'engineering',
    categoryLabel: 'Engenharia (roadmap.sh)',
    url: 'https://roadmap.sh/software-architect',
    primaryDisc: 'C',
    secondaryDisc: 'D',
    weights: { D: 0.25, I: 0.10, S: 0.15, C: 0.50 },
    overview:
      'Trilha de Arquitetura de Software do roadmap.sh: padrões arquiteturais, sistemas distribuídos, mensageria, segurança e análise de trade-offs.',
    discAdvice: {
      D: 'Equilibre decisões arquiteturais rápidas com validações práticas junto às squads.',
      I: 'Use diagramas C4 e RFCs claros para construir consenso em vez de impor normas.',
      S: 'Planeje evoluções graduais de sistemas legados sem rupturas operacionais.',
      C: 'Sua capacidade de antecipar gargalos de escala e concorrência é o maior ativo nesta trilha.',
    },
    stages: [
      {
        step: '01',
        title: 'Fundamentos & Padrões de Design',
        summary: 'Qualidade estrutural e modelagem de domínio.',
        topics: ['Clean Architecture, DDD e SOLID', 'Diagramação C4 e ADRs/RFCs', 'Análise de requisitos não funcionais'],
      },
      {
        step: '02',
        title: 'Sistemas Distribuídos & Dados',
        summary: 'Escala, consistência e comunicação assíncrona.',
        topics: ['Monólitos modulares vs. Microsserviços', 'Eventos, filas e idempotência', 'Bancos distribuídos, cache e particionamento'],
      },
      {
        step: '03',
        title: 'Segurança, Cloud & Governança',
        summary: 'Sustentabilidade técnica e custos em escala.',
        topics: ['Zero Trust, observabilidade e resiliência', 'FinOps e trade-offs de infraestrutura', 'Evolução de legados'],
      },
    ],
  },
  {
    id: 'engineering-manager',
    title: 'Engineering Manager',
    category: 'product-data',
    categoryLabel: 'Produto & Dados (roadmap.sh)',
    url: 'https://roadmap.sh/engineering-manager',
    primaryDisc: 'I',
    secondaryDisc: 'D',
    weights: { D: 0.30, I: 0.45, S: 0.15, C: 0.10 },
    overview:
      'Trilha de Gestão de Engenharia do roadmap.sh: liderança de pessoas, 1:1s, contratação, métricas DORA, segurança psicológica e estratégia organizacional.',
    discAdvice: {
      D: 'Direcione metas com clareza, mas pratique delegação de autonomia para o time crescer.',
      I: 'Sua habilidade relacional potencializa 1:1s, retenção e cultura de confiança.',
      S: 'Crie previsibilidade de carreira e estabilidade emocional para a equipe em períodos intensos.',
      C: 'Apoie suas decisões de gestão em métricas saudáveis de fluxo (DORA) e planos estruturados.',
    },
    stages: [
      {
        step: '01',
        title: 'Pessoas, 1:1s & Cultura',
        summary: 'Desenvolver engenheiros e sustentar segurança psicológica.',
        topics: ['1:1s efetivos e feedbacks contínuos', 'Planos de Desenvolvimento Individual (PDI)', 'Contratação e onboarding estruturado'],
      },
      {
        step: '02',
        title: 'Entrega, Processos & Métricas',
        summary: 'Manter fluxo previsível sem microgerenciamento.',
        topics: ['DORA Metrics e saúde de entrega', 'Gestão de débito técnico com produto', 'Gestão de conflitos e prioridades'],
      },
      {
        step: '03',
        title: 'Estratégia & Alinhamento Executivo',
        summary: 'Conectar engenharia aos objetivos da empresa.',
        topics: ['Topologias de time e escalabilidade', 'Orçamento, capacidade e roadmap', 'Comunicação com diretoria'],
      },
    ],
  },
  {
    id: 'devrel',
    title: 'Developer Relations (DevRel)',
    category: 'product-data',
    categoryLabel: 'Produto & Dados (roadmap.sh)',
    url: 'https://roadmap.sh/devrel',
    primaryDisc: 'I',
    secondaryDisc: 'C',
    weights: { D: 0.15, I: 0.50, S: 0.15, C: 0.20 },
    overview:
      'Trilha de DevRel do roadmap.sh: construção de comunidades técnicas, Developer Experience (DX), documentação interativa, palestras e feedback de produto.',
    discAdvice: {
      D: 'Mantenha métricas claras de adoção e impacto das ações de comunidade no produto.',
      I: 'Trilha de altíssima sinergia com comunicação empática, palco e criação de conteúdo técnico.',
      S: 'Cultive relacionamentos duradouros e consistentes nos canais da comunidade.',
      C: 'Garanta código de exemplo impecável e documentações sem ambiguidades.',
    },
    stages: [
      {
        step: '01',
        title: 'Developer Experience (DX) & Conteúdo',
        summary: 'Facilitar o primeiro sucesso de quem usa a ferramenta.',
        topics: ['Quickstarts, guias e exemplos práticos', 'Escrita técnica e storytelling', 'Demos e vídeos didáticos'],
      },
      {
        step: '02',
        title: 'Comunidade, Eventos & Feedback',
        summary: 'Construir ponte real entre devs externos e time de produto.',
        topics: ['Gestão de comunidades (Discord/GitHub)', 'Tech talks, workshops e open source', 'Coleta estruturada de feedback técnico'],
      },
    ],
  },
  {
    id: 'tech-lead',
    title: 'Tech Lead',
    category: 'engineering',
    categoryLabel: 'Liderança Técnica (roadmap.sh)',
    url: 'https://roadmap.sh/engineering-manager',
    primaryDisc: 'D',
    secondaryDisc: 'I',
    weights: { D: 0.45, I: 0.25, S: 0.15, C: 0.15 },
    overview:
      'Trilha de Tech Lead baseada no roadmap.sh (Engineering Manager + Software Architect): decisões arquiteturais pragmáticas, mentoria técnica, fluxo de entrega da squad e alinhamento com produto.',
    discAdvice: {
      D: 'Use sua velocidade para destravar impedimentos, mas abra espaço formal para o time propor soluções em RFCs.',
      I: 'Articule prioridades entre PM e desenvolvedores mantendo clareza sobre o impacto no negócio.',
      S: 'Construa rituais previsíveis de code review e pair programming sem microgerenciar.',
      C: 'Equilibre rigor em ADRs e qualidade de código com entregas incrementais em produção.',
    },
    stages: [
      {
        step: '01',
        title: 'Arquitetura Pragmática & ADRs',
        summary: 'Tomar decisões técnicas claras e documentar trade-offs.',
        topics: ['Escrita de RFCs e ADRs objetivos', 'Refinamento técnico de histórias e épicos', 'Gestão consciente de débito técnico'],
      },
      {
        step: '02',
        title: 'Fluxo de Squad & Qualidade',
        summary: 'Elevar a barra técnica sem virar gargalo de aprovação.',
        topics: ['Métricas DORA (Lead Time e Deploy Frequency)', 'Code Review construtivo e automação CI/CD', 'Mitigação rápida de incidentes e bloqueios'],
      },
      {
        step: '03',
        title: 'Mentoria & Alinhamento de Produto',
        summary: 'Multiplicar autonomia dos devs e negociar escopo com PM.',
        topics: ['Pair programming e feedback técnico 1:1', 'Negociação de escopo x prazo com stakeholders', 'Desenvolvimento de novos líderes na equipe'],
      },
    ],
  },
];

export const AREA_TO_ROADMAP_ID: Record<string, string> = {
  // Portas de Entrada (Iniciantes / Transição)
  'data-analytics': 'data-analyst',
  'qa-entry': 'qa',
  'frontend-entry': 'frontend',
  'ux-ui-design': 'ux-design',
  'product-agile': 'product-manager',
  'backend-entry': 'backend',
  'support-cloud': 'devops',
  'cyber-grc': 'cyber-security',

  // Carreiras Consolidadas
  'tech-lead': 'tech-lead',
  'engineering-manager': 'engineering-manager',
  'software-architect': 'software-architect',
  'sre-devops': 'devops',
  'devrel': 'devrel',
  'qa-sdet': 'qa',
  'product-manager': 'product-manager',
  'backend-specialist': 'backend',
  'data-security': 'cyber-security',
  'agile-coach': 'product-manager',
  'product-designer': 'product-design',
  'design-system-specialist': 'design-system',
};

export interface ResultAreaInput {
  id: string;
  title: string;
  matchScore: number;
  roadmapUrl?: string;
}

export interface MatchedRoadmapTrack extends RoadmapTrack {
  areaId: string;
  areaTitle: string;
  rankIndex: number;
  matchScore: number;
}

export function getRoadmapsForResultAreas(areas: ResultAreaInput[]): MatchedRoadmapTrack[] {
  return areas
    .map((area, idx) => {
      const targetId = AREA_TO_ROADMAP_ID[area.id] || 'ux-design';
      const baseTrack =
        ROADMAP_TRACKS.find((t) => t.id === targetId) || ROADMAP_TRACKS[0];
      return {
        ...baseTrack,
        url: area.roadmapUrl || baseTrack.url,
        areaId: area.id,
        areaTitle: area.title,
        rankIndex: idx + 1,
        matchScore: area.matchScore,
      };
    });
}

export function rankRoadmapsByDisc(pct: DiscPercentages) {
  return [...ROADMAP_TRACKS]
    .map((track) => {
      const diff =
        Math.abs(pct.D - track.weights.D * 100) +
        Math.abs(pct.I - track.weights.I * 100) +
        Math.abs(pct.S - track.weights.S * 100) +
        Math.abs(pct.C - track.weights.C * 100);
      const matchScore = Math.max(52, Math.min(98, Math.round(100 - diff * 0.44)));
      return {
        ...track,
        matchScore,
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore);
}

export function getDesignRoadmaps(pct?: DiscPercentages | null) {
  const tracks = pct ? rankRoadmapsByDisc(pct) : ROADMAP_TRACKS.map((t) => ({ ...t, matchScore: 80 }));
  return tracks.filter((t) => t.category === 'design');
}

