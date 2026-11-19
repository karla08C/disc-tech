import { Question, ProfileDetails, DualProfile, TechCareer, DiscLetter } from '../types/disc';

export const QUESTIONS: Question[] = [
  {
    id: 1,
    prompt: "Em um novo projeto de tecnologia, eu costumo ser:",
    options: [
      { text: "Direto e resolutivo, foco em entregar resultado e MVP rápido", letter: "D" },
      { text: "Animado e articulador, mobilizo o time com novas ideias e energia", letter: "I" },
      { text: "Calmo e metódico, ajudo a organizar o ritmo e a harmonia da equipe", letter: "S" },
      { text: "Analítico e criterioso, investigo arquitetura e dados antes de agir", letter: "C" },
    ],
  },
  {
    id: 2,
    prompt: "Diante de um bug crítico que derrubou produção:",
    options: [
      { text: "Assumo o comando da war room e tomo decisões imediatas de contenção", letter: "D" },
      { text: "Reúno as pessoas, mantenho a tranquilidade e comunico os stakeholders", letter: "I" },
      { text: "Sigo o runbook passo a passo com calma sem entrar em desespero", letter: "S" },
      { text: "Isolo o ambiente, analiso logs, tracing e métricas na causa-raiz", letter: "C" },
    ],
  },
  {
    id: 3,
    prompt: "Em uma daily de squad ágil, minha postura típica é:",
    options: [
      { text: "Ir direto ao ponto, falar impedimentos e cobrar soluções", letter: "D" },
      { text: "Trazer energia, conectar assuntos e contextualizar o impacto no produto", letter: "I" },
      { text: "Escutar atenciosamente todos antes de me manifestar", letter: "S" },
      { text: "Reportar métricas exatas, status preciso e critérios de aceitação", letter: "C" },
    ],
  },
  {
    id: 4,
    prompt: "Ao aprender uma nova stack, ferramenta ou disciplina:",
    options: [
      { text: "Mergulho direto na prática e coloco um projeto real no ar rápido", letter: "D" },
      { text: "Assisto tech talks, troco ideias com a comunidade e vejo cases reais", letter: "I" },
      { text: "Sigo uma trilha guiada (estilo roadmap.sh) passo a passo com consistência", letter: "S" },
      { text: "Mapeio os fundamentos da trilha, leio a documentação oficial e RFCs a fundo", letter: "C" },
    ],
  },
  {
    id: 5,
    prompt: "Meu maior orgulho profissional no dia a dia é:",
    options: [
      { text: "Superar metas agressivas e destravar gargalos difíceis", letter: "D" },
      { text: "Inspirar o time e transformar o ambiente em um lugar engajador", letter: "I" },
      { text: "Ser um ponto de equilíbrio e estabilidade de confiança para a squad", letter: "S" },
      { text: "Entregar código com altíssima qualidade técnica, segurança e performance", letter: "C" },
    ],
  },
  {
    id: 6,
    prompt: "Quando surge um conflito de opiniões técnicas no time:",
    options: [
      { text: "Confronto abertamente na hora para resolver logo o impasse", letter: "D" },
      { text: "Uso bom humor e empatia para aproximar as partes e alinhar consensos", letter: "I" },
      { text: "Acalmo os ânimos, ouço os dois lados e busco um terreno comum", letter: "S" },
      { text: "Trago fatos, benchmarks, testes e processos objetivos para a mesa", letter: "C" },
    ],
  },
  {
    id: 7,
    prompt: "Em uma entrevista ou desafio técnico/de produto, sinto-me mais à vontade com:",
    options: [
      { text: "Desafios de System Design, arquitetura ou decisões de trade-offs", letter: "D" },
      { text: "Conversas sobre visão de produto, UX, cultura e liderança colaborativa", letter: "I" },
      { text: "Pair programming ou dinâmicas práticas guiadas em ambiente acolhedor", letter: "S" },
      { text: "Avaliação rigorosa de portfólio, testes automatizados, dados e critérios", letter: "C" },
    ],
  },
  {
    id: 8,
    prompt: "Meu estilo ao realizar Code Review é:",
    options: [
      { text: "Objetivo, prático e focado no impacto do merge sem burocracia", letter: "D" },
      { text: "Encorajador, deixando elogios e sugestões amigáveis de melhoria", letter: "I" },
      { text: "Cuidadoso, respeitoso e focado em manter o padrão já consolidado", letter: "S" },
      { text: "Detalhista, técnico, apontando edge cases, patterns e linting", letter: "C" },
    ],
  },
  {
    id: 9,
    prompt: "Diante de uma mudança súbita de prioridade no roadmap:",
    options: [
      { text: "Adoro a adrenalina, vejo como oportunidade de agir rápido", letter: "D" },
      { text: "Topo imediatamente se o novo rumo for instigante e inovador", letter: "I" },
      { text: "Preciso de um tempo para digerir e reorganizar o fluxo de trabalho", letter: "S" },
      { text: "Questiono as premissas e quero entender a lógica analítica do pivô", letter: "C" },
    ],
  },
  {
    id: 10,
    prompt: "Minha visão prática sobre documentação, padrões e Design Systems:",
    options: [
      { text: "Mínima e pragmática: o produto funcionando em produção fala por si", letter: "D" },
      { text: "Visual, interativa, com fluxos de UX, diagramas e guias de onboarding", letter: "I" },
      { text: "Padronizada, estável e sempre acessível como referência da equipe", letter: "S" },
      { text: "Completa, exata, cobrindo Design Tokens, contratos de API e edge cases", letter: "C" },
    ],
  },
  {
    id: 11,
    prompt: "Em hackathons e maratonas de programação, assumo:",
    options: [
      { text: "A liderança da execução e o foco implacável no cronômetro", letter: "D" },
      { text: "A ideação, storytelling e a apresentação arrasadora do pitch", letter: "I" },
      { text: "A retaguarda, garantindo que ninguém se esgote e o fluxo continue", letter: "S" },
      { text: "A engenharia do core, modelagem dos dados e consistência técnica", letter: "C" },
    ],
  },
  {
    id: 12,
    prompt: "Meu ambiente de trabalho ideal possui:",
    options: [
      { text: "Autonomia total para tomar decisões sem microgestão", letter: "D" },
      { text: "Time integrado, comunicativo, com trocas constantes e bom humor", letter: "I" },
      { text: "Rotina previsível, metas claras e ambiente com baixa turbulência", letter: "S" },
      { text: "Silêncio para deep work, padrões de excelência e processos claros", letter: "C" },
    ],
  },
  {
    id: 13,
    prompt: "Ao receber um feedback construtivo ou corretivo:",
    options: [
      { text: "Absorvo na hora, processo o ponto central e ajusto a rota imediatamente", letter: "D" },
      { text: "Converso para entender o contexto das pessoas e manter a sintonia", letter: "I" },
      { text: "Reflito internamente com calma antes de tirar conclusões precipitadas", letter: "S" },
      { text: "Avalio as evidências concretas, métricas e argumentos técnicos", letter: "C" },
    ],
  },
  {
    id: 14,
    prompt: "Em apresentações técnicas para a diretoria e stakeholders:",
    options: [
      { text: "Vou direto aos resultados, decisões recomendadas e ROI", letter: "D" },
      { text: "Crio uma narrativa envolvente, conectando o tech à visão de produto", letter: "I" },
      { text: "Apresento com calma, sendo atencioso a todas as dúvidas da plateia", letter: "S" },
      { text: "Apresento gráficos, volumetria, latência e dados comprobatórios", letter: "C" },
    ],
  },
  {
    id: 15,
    prompt: "Ao encarar um repositório legado cheio de débitos técnicos:",
    options: [
      { text: "Refatoro agressivamente as partes críticas para destravar o negócio", letter: "D" },
      { text: "Mobilizo uma guild ou dojo para que o time enfrente o desafio junto", letter: "I" },
      { text: "Preservo a estabilidade operacional, mexendo com extremo cuidado", letter: "S" },
      { text: "Mapeio toda a árvore de dependências e escrevo testes antes de tocar", letter: "C" },
    ],
  },
  {
    id: 16,
    prompt: "No fundo, o que mais me motiva profissionalmente é:",
    options: [
      { text: "Autonomia, poder de decisão e ver coisas concretas funcionando no ar", letter: "D" },
      { text: "Reconhecimento, relações humanas ricas e inspirar colegas de squad", letter: "I" },
      { text: "Segurança psicológica, cooperação mútua e harmonia duradoura", letter: "S" },
      { text: "Excelência técnica, precisão matemática e maestria na especialidade", letter: "C" },
    ],
  },
  {
    id: 17,
    prompt: "Em uma sessão de Planning Poker ou refinamento de backlog:",
    options: [
      { text: "Estimo rápido e impulsiono o time a fechar as pontuações sem rodeios", letter: "D" },
      { text: "Debato com entusiasmo as ideias e possibilidades de cada story", letter: "I" },
      { text: "Acompanho o consenso geral da squad respeitando o ritmo coletivo", letter: "S" },
      { text: "Quebro os itens em subtarefas atômicas e aponto ambiguidades técnicas", letter: "C" },
    ],
  },
  {
    id: 18,
    prompt: "Meu maior desconforto ou receio no trabalho:",
    options: [
      { text: "Sentir lentidão, burocracia excessiva ou perda de controle da entrega", letter: "D" },
      { text: "Ficar isolado, ser desconsiderado ou trabalhar em silos silenciosos", letter: "I" },
      { text: "Mudanças caóticas contínuas e conflitos destrutivos no time", letter: "S" },
      { text: "Cometer um erro de arquitetura grave por falta de validação", letter: "C" },
    ],
  },
  {
    id: 19,
    prompt: "Ao revisar uma entrega grande antes da publicação (Pull Request ou protótipo):",
    options: [
      { text: "Aprovo se os testes passaram e o fluxo principal resolve o problema", letter: "D" },
      { text: "Parabenizo a autoria pelo avanço e deixo sugestões agregadoras", letter: "I" },
      { text: "Reviso sem pressa, assegurando que nada quebre padrões já existentes", letter: "S" },
      { text: "Inspeciono cada detalhe: edge cases, acessibilidade, tipagem e cobertura", letter: "C" },
    ],
  },
  {
    id: 20,
    prompt: "Para planejar o próximo salto da minha carreira em tecnologia:",
    options: [
      { text: "Busco posições de liderança técnica, estratégia de produto ou escala", letter: "D" },
      { text: "Amplio meu networking, talks, mentorias e projetos de design/comunidade", letter: "I" },
      { text: "Sigo um roadmap estruturado passo a passo (como roadmap.sh) no meu ritmo", letter: "S" },
      { text: "Aprofundo fundamentos avançados, especializações e certificações sólidas", letter: "C" },
    ],
  },
];

export const PROFILES: Record<DiscLetter, ProfileDetails> = {
  D: {
    letter: "D",
    title: "O Tech Lead Executor",
    tagline: "Decisão rápida, foco em resultado, impacto e entrega em produção.",
    summary: "Profissionais com alta Dominância são movidos por desafios e velocidade. Assumem riscos calculados, removem bloqueios e mantêm o time focado no objetivo final sem hesitação.",
    superpowers: [
      "Toma decisões importantes sob pressão sem paralisar o ritmo do time",
      "Transforma tarefas paradas em entregas reais com velocidade notável",
      "Encara problemas complexos como oportunidades imediatas de evolução",
      "Protege a equipe contra burocracias desnecessárias e perda de foco"
    ],
    debugs: [
      {
        issue: "Centralização de Opiniões: Pode atropelar discussões e ignorar sinais dos colegas",
        fix: "Ajuste prático: Adote a 'Regra dos 60 segundos'. Antes de concluir uma decisão, dê espaço para que pessoas mais reservadas falem primeiro. Você ganha contexto valioso sem perder agilidade."
      },
      {
        issue: "Impaciência com Processos: Baixa tolerância a rituais e documentação",
        fix: "Ajuste prático: Encare processos organizados como um acelerador da equipe: rotinas claras existem para escalar sua capacidade de delegar com segurança, não para travar entregas."
      }
    ],
    careers: ["Tech Lead", "Engineering Manager", "Head of Engineering", "Staff Engineer", "Product Owner"],
    growthAreas: [
      "Praticar escuta ativa: ouvir até o final da explicação antes de formular a resposta",
      "Empatia nas revisões e feedbacks: focar na melhoria e no aprendizado, preservando as pessoas",
      "Paciência com o tempo colaborativo de amadurecimento de ideias no time",
      "Aprender a delegar a condução das soluções sem centralizar cada detalhe"
    ],
    color: "#ef4444",
    accentColor: "from-rose-500 to-red-600",
    badgeBg: "bg-red-500/10 text-red-400 border-red-500/30",
    iconName: "Zap"
  },
  I: {
    letter: "I",
    title: "O Catalisador de Times",
    tagline: "Conecta pessoas, articula visões, contagia equipes e cria pontes entre tecnologia e negócios.",
    summary: "Profissionais com alta Influência impulsionam a cultura colaborativa. Transformam ideias abstratas em projetos envolventes, comunicam-se com facilidade com áreas não técnicas e mantêm o time engajado.",
    superpowers: [
      "Traduz conceitos técnicos complexos em linguagem simples para diferentes públicos",
      "Cria um ambiente de confiança, abertura e cooperação dentro da equipe",
      "Destaca-se em apresentações de produto, demonstrações e alinhamentos estratégicos",
      "Atrai talentos e engaja pessoas iniciantes com facilidade e entusiasmo"
    ],
    debugs: [
      {
        issue: "Dispersão de Foco: Atenção dividida em múltiplas frentes sem conclusão",
        fix: "Ajuste prático: Reserve blocos diários de 2 horas de foco contínuo, sem chat ou notificações abertas. A criatividade ganha força real quando combinada com execução constante."
      },
      {
        issue: "Prazos Otimistas Demais: Subestimar o tempo e a complexidade real das entregas",
        fix: "Ajuste prático: Valide suas estimativas com um colega de perfil mais analítico ('C') antes de confirmar prazos. Sua comunicação ganha ainda mais credibilidade com previsibilidade."
      }
    ],
    careers: ["Product Designer / UX", "Product Manager", "Developer Relations (DevRel)", "Scrum Master / Agile Coach", "Solutions Engineer"],
    growthAreas: [
      "Desenvolver rigor na finalização de tarefas até os últimos detalhes",
      "Aprofundar o acompanhamento de especificações, requisitos e documentação",
      "Gerenciar expectativas com base em métricas reais, evitando promessas precipitadas",
      "Cultivar disciplina em momentos de estudo e execução individual silenciosa"
    ],
    color: "#f59e0b",
    accentColor: "from-amber-400 to-orange-500",
    badgeBg: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    iconName: "MessageSquare"
  },
  S: {
    letter: "S",
    title: "O Engenheiro Estável",
    tagline: "Confiável, consistente, resiliente e o verdadeiro alicerce da equipe.",
    summary: "Profissionais com alta Estabilidade são a base de qualquer time de alta performance. Entregam com constância, apoiam novos integrantes e garantem que sistemas e rotinas operem com tranquilidade duradoura.",
    superpowers: [
      "Mantém serenidade e clareza mesmo em momentos críticos de pressão ou instabilidade",
      "Excepcional na integração de novos colegas, mentoria empática e troca de conhecimento",
      "Garante previsibilidade e ritmo saudável de entregas semana após semana",
      "Excelente colaborador, prevenindo conflitos destrutivos e mantendo o clima positivo"
    ],
    debugs: [
      {
        issue: "Resistência a Mudanças: Desconforto silencioso diante de novas ferramentas ou métodos",
        fix: "Ajuste prático: Encare cada novidade como um teste controlado em pequena escala por duas semanas antes de avaliar a adoção definitiva."
      },
      {
        issue: "Silêncio diante de Riscos: Evitar posicionamentos necessários mesmo percebendo problemas",
        fix: "Ajuste prático: Adote a fórmula construtiva 'Observo X (fato), me preocupo com Y (impacto), proponho Z (alternativa)'. Discordar com respeito e clareza é sinal de maturidade."
      }
    ],
    careers: ["Site Reliability Engineer (SRE)", "DevOps / Platform Engineer", "QA Engineer / SDET", "Senior Backend Developer", "Infrastructure Specialist"],
    growthAreas: [
      "Aumentar a flexibilidade diante de mudanças rápidas de prioridade no mercado",
      "Tomar iniciativa para expressar discordâncias construtivas e sugerir melhorias",
      "Dar mais visibilidade às próprias conquistas e ao impacto gerado no time",
      "Desenvolver conforto para decidir mesmo quando ainda existem incertezas"
    ],
    color: "#10b981",
    accentColor: "from-emerald-400 to-teal-500",
    badgeBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    iconName: "ShieldCheck"
  },
  C: {
    letter: "C",
    title: "O Arquiteto Analítico",
    tagline: "Precisão, excelência técnica, rigor estrutural e qualidade acima da média.",
    summary: "Profissionais com alta Conformidade são os guardiões da qualidade. Antecipam falhas discretas, estruturam soluções bem pensadas e garantem que produtos cresçam com segurança e critérios sólidos.",
    superpowers: [
      "Atenção minuciosa a cenários de exceção, consistência de dados e segurança",
      "Capacidade analítica para decompor problemas complexos em etapas claras",
      "Excelência em organização estrutural, testes, padronização e documentação",
      "Garante que a qualidade do trabalho seja mantida de forma sistemática"
    ],
    debugs: [
      {
        issue: "Paralisia por Análise: Perfeccionismo excessivo que adia a entrega de versões iniciais",
        fix: "Ajuste prático: Aplique o princípio de evolução contínua: defina critérios objetivos do que precisa estar pronto agora e planeje melhorias para as versões seguintes."
      },
      {
        issue: "Dificuldade em Delegar: Relutância em confiar tarefas técnicas a outras pessoas",
        fix: "Ajuste prático: Pratique sessões em dupla e utilize checklists automatizados de revisão. Automatizar padrões libera você para focar na estratégia e na lógica central."
      }
    ],
    careers: ["Software Architect", "Design System Specialist", "Data Engineer / Scientist", "Security / AppSec Engineer", "Principal Software Engineer"],
    growthAreas: [
      "Aceitar que uma entrega 'boa o suficiente' para validar valor cedo também é qualidade",
      "Desenvolver tolerância à ambiguidade nas fases iniciais de descoberta de projetos",
      "Aprimorar o tom ao dar feedbacks técnicos para incentivar quem está começando",
      "Investir em comunicação interpessoal para influenciar decisões além dos dados técnicos"
    ],
    color: "#06b6d4",
    accentColor: "from-cyan-400 to-blue-500",
    badgeBg: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
    iconName: "Cpu"
  }
};

export const DUAL_PROFILES: Record<string, DualProfile> = {
  "DI": {
    code: "DI",
    title: "O Visionário Empreendedor",
    subtitle: "Dominância + Influência",
    description: "Combina velocidade de decisão com forte capacidade de persuasão e entusiasmo. Ideal para liderar startups, squads de inovação e produtos do zero (0 to 1).",
    naturalStrength: "Capacidade ímpar de engajar desenvolvedores e convencer diretores a comprar a visão técnica."
  },
  "DC": {
    code: "DC",
    title: "O Arquiteto Estrategista",
    subtitle: "Dominância + Conformidade",
    description: "Une pragmatismo de entrega à alta exigência técnica. Focado em resultados escaláveis, com métricas sólidas e arquiteturas eficientes.",
    naturalStrength: "Toma decisões duras baseadas em fatos incontestáveis, unindo velocidade e rigor analítico."
  },
  "DS": {
    code: "DS",
    title: "O Gestor de Entregas (Delivery Lead)",
    subtitle: "Dominância + Estabilidade",
    description: "Pragmático e persistente. Conduz o time com firmeza e estabilidade sem deixar a peteca cair durante maratonas longas de produto.",
    naturalStrength: "Capacidade de sustentar o ritmo de entregas contínuas mantendo a integridade da equipe."
  },
  "ID": {
    code: "ID",
    title: "O Tech Evangelist",
    subtitle: "Influência + Dominância",
    description: "Carismático e focado em metas. Excelente em abrir novos mercados técnicos, mobilizar comunidades open-source e fechar parcerias.",
    naturalStrength: "Move squads inteiras com energia contagiante e liderança participativa e dinâmica."
  },
  "IS": {
    code: "IS",
    title: "O Champion de Cultura & Squad",
    subtitle: "Influência + Estabilidade",
    description: "O parceiro ideal de qualquer time. Cuida da saúde emocional da equipe, resolve conflitos antes que explodam e cria um ambiente acolhedor.",
    naturalStrength: "Criação de times coesos onde as pessoas adoram trabalhar e a taxa de turnover é mínima."
  },
  "IC": {
    code: "IC",
    title: "O Consultor Técnico / Solutions Architect",
    subtitle: "Influência + Conformidade",
    description: "Articula aspectos técnicos minuciosos com elegância didática. Muito requisitado para consultorias de soluções, pré-vendas e arquitetura de clientes.",
    naturalStrength: "Consegue defender especificações técnicas profundas de forma cativante e crível."
  },
  "SD": {
    code: "SD",
    title: "O Operador de Alta Confiabilidade",
    subtitle: "Estabilidade + Dominância",
    description: "Metódico porém determinado. Quando assume um compromisso, entrega mesmo com intempéries. Excelente em sustentar infraestruturas críticas.",
    naturalStrength: "Execução resiliente de planos estratégicos sem desvios operacionais."
  },
  "SI": {
    code: "SI",
    title: "O Mentor de Engenharia",
    subtitle: "Estabilidade + Influência",
    description: "Paciência infinita para formar novos talentos, empatia exemplar e capacidade de gerar consenso suave e sustentável.",
    naturalStrength: "Desenvolvimento humano de engenheiros e consolidação de boas práticas interpessoais."
  },
  "SC": {
    code: "SC",
    title: "O Guardião da Qualidade & Confiabilidade",
    subtitle: "Estabilidade + Conformidade",
    description: "Disciplinado, meticuloso e focado no longo prazo. Garante que sistemas legados e esteiras CI/CD operem como um relógio suíço.",
    naturalStrength: "Previsibilidade absoluta e manutenção de padrões técnicos impecáveis sob qualquer cenário."
  },
  "CD": {
    code: "CD",
    title: "O Diretor Técnico de Padrões",
    subtitle: "Conformidade + Dominância",
    description: "Exige perfeição técnica e não tem medo de rejeitar soluções subótimas. Define padrões globais de engenharia e compliance.",
    naturalStrength: "Imposição de qualidade técnica incontestável e erradicação de débito arquitetural."
  },
  "CI": {
    code: "CI",
    title: "O Pesquisador & Educador Tech",
    subtitle: "Conformidade + Influência",
    description: "Analisa a fundo e adora compartilhar os achados. Excelente escrevendo documentação primorosa, RFCs e dando treinamentos avançados.",
    naturalStrength: "Transforma pesquisas complexas em guias e especificações claras e inspiradoras."
  },
  "CS": {
    code: "CS",
    title: "O Engenheiro de Missão Crítica",
    subtitle: "Conformidade + Estabilidade",
    description: "Rigoroso, silencioso e extremamente meticuloso. Ideal para sistemas financeiros, infraestruturas bancárias e segurança defensiva.",
    naturalStrength: "Zero tolerância a falhas e atenção irrepreensível a cada vírgula do código e do contrato."
  }
};

export const TECH_CAREERS: TechCareer[] = [
  {
    id: "tech-lead",
    title: "Tech Lead",
    primaryDisc: "D",
    secondaryDisc: "I",
    description: "Lidera tecnicamente a squad, desbloqueia decisões arquiteturais, alinha entregas com o negócio e apoia a evolução do time.",
    salaryRange: "R$ 13.000 – R$ 20.000 / mês",
    keySkills: ["Tomada de Decisão", "System Design", "Mentoria", "Pragmatismo"],
    weights: { D: 0.45, I: 0.25, S: 0.15, C: 0.15 },
    dailyRoutine: [
      "09h30: Daily Scrum & destravamento imediato de bloqueadores operacionais da squad",
      "11h00: Revisão de RFCs e aprovação de PRs de alto impacto arquitetural",
      "14h00: Alinhamento de viabilidade e trade-offs de roadmap com Product Manager (PM)",
      "16h30: Sessão de 1:1 técnico ou Pair Programming com desenvolvedores da squad"
    ],
    typicalDeliverables: [
      "Documentos de Decisão Arquitetural (ADRs e RFCs)",
      "Métricas de entrega da engenharia (DORA metrics: Lead Time, Deploy Frequency)",
      "Refinamento técnico de histórias e desenho de soluções escaláveis"
    ],
    commonChallenges: "Risco de centralizar decisões e não dar espaço para a equipe crescer; equilibrar tempo entre codificar e liderar pessoas.",
    discFitReason: "A alta Dominância (D) fornece a coragem necessária para tomar decisões difíceis sob pressão, enquanto a Influência (I) mobiliza os desenvolvedores em torno da visão técnica.",
    roadmapUrl: "https://roadmap.sh/engineering-manager",
    roadmapLabel: "Roadmap Engineering Manager (roadmap.sh)",
  },
  {
    id: "engineering-manager",
    title: "Engineering Manager (EM)",
    primaryDisc: "I",
    secondaryDisc: "D",
    description: "Responsável pelo desenvolvimento de pessoas, planos de carreira (1:1s), processos ágeis, contratação e alinhamento estratégico.",
    salaryRange: "R$ 15.000 – R$ 24.000 / mês",
    keySkills: ["Gestão de Pessoas", "Comunicação", "Resolução de Conflitos", "Estratégia"],
    weights: { D: 0.30, I: 0.45, S: 0.15, C: 0.10 },
    dailyRoutine: [
      "09h00: Checagem de clima e saúde da equipe após incidentes ou sprints intensas",
      "10h30: Reuniões 1:1 focadas em feedback, plano de desenvolvimento (PDI) e retenção",
      "14h00: Planejamento de capacidade da equipe (headcount), contratações e entrevistas",
      "16h00: Alinhamento de expectativas estratégicas com diretores e heads de tecnologia"
    ],
    typicalDeliverables: [
      "Matriz de competências e plano de evolução de carreira dos liderados",
      "Planejamento orçamentário de equipe e estratégias de retenção de talentos",
      "Retrospectivas e planos de ação para melhoria do ambiente e segurança psicológica"
    ],
    commonChallenges: "Sensação de não produzir coisas tangíveis (código) e risco de se afastar demais dos desafios técnicos da operação.",
    discFitReason: "A alta Influência (I) cria segurança psicológica e laços de confiança sólidos, enquanto a Dominância (D) garante assertividade na cobrança e defesa da equipe perante a liderança.",
    roadmapUrl: "https://roadmap.sh/engineering-manager",
    roadmapLabel: "Roadmap Engineering Manager (roadmap.sh)",
  },
  {
    id: "software-architect",
    title: "Software Architect",
    primaryDisc: "C",
    secondaryDisc: "D",
    description: "Desenha sistemas distribuídos, define diretrizes globais de arquitetura, contratos de microsserviços e governança de tecnologia.",
    salaryRange: "R$ 15.000 – R$ 24.000 / mês",
    keySkills: ["Sistemas Distribuídos", "Modelagem", "Trade-off Analysis", "Escalabilidade"],
    weights: { D: 0.25, I: 0.10, S: 0.15, C: 0.50 },
    dailyRoutine: [
      "09h00: Estudo de volumetria, gargalos de latência e consumo de recursos em produção",
      "10h30: Elaboração e revisão de RFCs arquiteturais para novos domínios de negócio",
      "14h00: Definição de contratos de API, schemas de eventos (Kafka/RabbitMQ) e governança",
      "16h30: Alinhamento com Tech Leads para garantir aderência aos padrões arquiteturais"
    ],
    typicalDeliverables: [
      "Diagramas arquiteturais C4 (Contexto, Containers, Componentes)",
      "Provas de Conceito (PoCs) de novas ferramentas e bancos de dados",
      "Planos de mitigação de débito técnico e modernização de legado"
    ],
    commonChallenges: "Cair na armadilha da 'arquitetura de torre de marfim' distante da realidade prática do código dos times.",
    discFitReason: "A alta Conformidade (C) garante rigor analítico e antecipação de falhas catastróficas, enquanto a Dominância (D) sustenta a autoridade para padronizar diretrizes técnicas.",
    roadmapUrl: "https://roadmap.sh/software-architect",
    roadmapLabel: "Roadmap Software Architect (roadmap.sh)",
  },
  {
    id: "sre-devops",
    title: "Site Reliability Engineer (SRE)",
    primaryDisc: "S",
    secondaryDisc: "C",
    description: "Garante alta disponibilidade, observabilidade, esteiras de CI/CD, gestão de incidentes e tolerância a falhas na infraestrutura.",
    salaryRange: "R$ 10.000 – R$ 17.500 / mês",
    keySkills: ["Observabilidade", "Kubernetes", "Post-Mortems", "Resiliência"],
    weights: { D: 0.15, I: 0.10, S: 0.45, C: 0.30 },
    dailyRoutine: [
      "08h30: Revisão de painéis de observabilidade (Datadog/Grafana), alertas e SLOs da noite",
      "10h00: Automação de infraestrutura como código (Terraform, Helm, Kubernetes)",
      "14h00: Otimização de pipelines CI/CD e testes de resiliência (Chaos Engineering)",
      "16h00: Condução de Post-Mortem sem culpados (Blameless) de incidentes recentes"
    ],
    typicalDeliverables: [
      "Dashboards e alertas com base nos 4 Golden Signals (Latência, Tráfego, Erros, Saturação)",
      "Runbooks detalhados para atendimento de plantões e contenção de crises",
      "Infraestrutura elástica com auto-scaling e esteiras de deploy seguro (Canary/Blue-Green)"
    ],
    commonChallenges: "Fadiga de alertas e plantões, além da pressão contínua em momentos de instabilidade severa de produção.",
    discFitReason: "A alta Estabilidade (S) confere sangue frio e compostura em crises, enquanto a Conformidade (C) assegura a precisão cirúrgica para diagnosticar causas-raiz.",
    roadmapUrl: "https://roadmap.sh/devops",
    roadmapLabel: "Roadmap DevOps / SRE (roadmap.sh)",
  },
  {
    id: "devrel",
    title: "Developer Relations (DevRel)",
    primaryDisc: "I",
    secondaryDisc: "C",
    description: "A ponte entre a empresa e a comunidade dev. Cria documentações, palestras, SDKs de exemplo e dá voz aos desenvolvedores.",
    salaryRange: "R$ 9.000 – R$ 16.000 / mês",
    keySkills: ["Storytelling Tech", "Oratória", "Open Source", "Empatia"],
    weights: { D: 0.15, I: 0.50, S: 0.15, C: 0.20 },
    dailyRoutine: [
      "09h30: Monitoramento e resposta de dúvidas em canais da comunidade (Discord, GitHub, Reddit)",
      "11h00: Criação de artigos técnicos, tutoriais passo a passo e gravações de demos",
      "14h30: Desenvolvimento de projetos de exemplo e melhorias na documentação de APIs",
      "17h00: Participação em meetups, podcasts ou preparação de slides para conferências"
    ],
    typicalDeliverables: [
      "Documentação de integração, Quickstarts e SDKs de exemplo no GitHub",
      "Tech talks, webinars e workshops em grandes conferências de tecnologia",
      "Relatórios de feedback da comunidade repassados para a equipe interna de produto"
    ],
    commonChallenges: "Dificuldade de mensurar impacto direto em receita e risco de esgotamento social em viagens frequentes.",
    discFitReason: "A altíssima Influência (I) brilha no contato humano e na comunicação pública, amparada pela Conformidade (C) para manter o rigor e a exatidão técnica dos códigos de demonstração.",
    roadmapUrl: "https://roadmap.sh/devrel",
    roadmapLabel: "Roadmap DevRel (roadmap.sh)",
  },
  {
    id: "qa-sdet",
    title: "QA Engineer / SDET",
    primaryDisc: "C",
    secondaryDisc: "S",
    description: "Desenvolve esteiras automatizadas de testes (E2E, carga, contrato), previne regressões e garante a integridade dos deploys.",
    salaryRange: "R$ 7.500 – R$ 14.000 / mês",
    keySkills: ["Automação de Testes", "Edge Cases", "Paciência", "Rigor Metódico"],
    weights: { D: 0.10, I: 0.10, S: 0.35, C: 0.45 },
    dailyRoutine: [
      "09h00: Checagem dos relatórios de execução das suítes de testes noturnas (Cypress/Playwright)",
      "10h30: Refinamento de critérios de aceitação e escrita de cenários BDD (Gherkin)",
      "14h00: Implementação de automações de testes de regressão e testes de contrato de API",
      "16h30: Testes exploratórios em novos fluxos críticos antes do rollout gradual"
    ],
    typicalDeliverables: [
      "Suítes de automação de testes com cobertura de fluxos ponta a ponta (E2E)",
      "Métricas de qualidade: taxa de escape de bugs para produção e cobertura de testes",
      "Matriz de testes de compatibilidade e segurança de dados"
    ],
    commonChallenges: "Pressão de times de desenvolvimento para liberar deploys rápidos em detrimento da validação exaustiva.",
    discFitReason: "A alta Conformidade (C) faz desse profissional um radar vivo de edge cases, enquanto a Estabilidade (S) confere paciência para testes repetitivos e consistentes.",
    roadmapUrl: "https://roadmap.sh/qa",
    roadmapLabel: "Roadmap QA Engineer (roadmap.sh)",
  },
  {
    id: "product-manager",
    title: "Product Manager (Tech PM)",
    primaryDisc: "I",
    secondaryDisc: "D",
    description: "Descobre dores de usuários, orquestra o roadmap, prioriza hipóteses e conecta métricas de negócio às capacidades técnicas.",
    salaryRange: "R$ 11.000 – R$ 18.500 / mês",
    keySkills: ["Product Discovery", "Comunicação", "Data-Driven", "Negociação"],
    weights: { D: 0.35, I: 0.40, S: 0.10, C: 0.15 },
    dailyRoutine: [
      "09h00: Análise de métricas de uso do produto (Mixpanel/Amplitude) e conversão de funis",
      "10h30: Entrevistas com clientes reais para descoberta contínua de dores (Discovery)",
      "14h00: Sessão de refinamento de backlog e alinhamento de escopo com a engenharia",
      "16h00: Apresentação de progresso do roadmap e métricas de negócio aos executivos"
    ],
    typicalDeliverables: [
      "Roadmap trimestral orientado a objetivos e resultados-chave (OKRs)",
      "Documentos de Requisitos de Produto (PRDs) com critérios claros de valor",
      "Análises de concorrência e pesquisas quantitativas/qualitativas com usuários"
    ],
    commonChallenges: "Equilibrar demandas concorrentes de stakeholders e saber dizer 'não' com firmeza e empatia.",
    discFitReason: "A energia comunicativa (I) engaja os desenvolvedores na missão do produto, enquanto a Dominância (D) impulsiona o senso de urgência e foco implacável em resultados.",
    roadmapUrl: "https://roadmap.sh/product-manager",
    roadmapLabel: "Roadmap Product Manager (roadmap.sh)",
  },
  {
    id: "backend-specialist",
    title: "Senior Backend Developer",
    primaryDisc: "C",
    secondaryDisc: "S",
    description: "Constrói APIs performáticas, regras de negócio complexas, otimiza consultas em banco de dados e mantém a consistência transacional.",
    salaryRange: "R$ 10.500 – R$ 17.500 / mês",
    keySkills: ["Clean Code", "SQL/NoSQL", "Testes Unitários", "Consistência"],
    weights: { D: 0.15, I: 0.10, S: 0.35, C: 0.40 },
    dailyRoutine: [
      "09h30: Daily da squad e alinhamento de dependências com os desenvolvedores frontend",
      "10h30: Bloco focado de desenvolvimento de regras de negócio complexas e microsserviços",
      "14h00: Otimização de queries SQL, índices de bancos de dados e estratégias de cache (Redis)",
      "16h30: Code review minucioso de pull requests da equipe e escrita de testes unitários"
    ],
    typicalDeliverables: [
      "APIs RESTful e gRPC escaláveis com contratos OpenAPI/Swagger documentados",
      "Código limpo coberto por testes unitários e de integração com alta confiabilidade",
      "Migrações de esquema de banco de dados sem indisponibilidade (Zero-Downtime)"
    ],
    commonChallenges: "Resistir à pressão para entregar 'código rápido e sujo' quando o prazo da sprint está apertado.",
    discFitReason: "A alta Conformidade (C) garante integridade de dados e arquitetura defensiva, enquanto a Estabilidade (S) mantém a cadência de entrega sólida dia após dia.",
    roadmapUrl: "https://roadmap.sh/backend",
    roadmapLabel: "Roadmap Backend Developer (roadmap.sh)",
  },
  {
    id: "data-security",
    title: "Security / AppSec Engineer",
    primaryDisc: "C",
    secondaryDisc: "D",
    description: "Protege a aplicação contra vulnerabilidades (OWASP), realiza threat modeling, auditorias criptográficas e políticas de zero trust.",
    salaryRange: "R$ 11.500 – R$ 19.500 / mês",
    keySkills: ["Threat Modeling", "Criptografia", "Compliance", "Rigor Investigativo"],
    weights: { D: 0.25, I: 0.05, S: 0.20, C: 0.50 },
    dailyRoutine: [
      "09h00: Triagem de alertas de scanners de vulnerabilidades estáticas e dinâmicas (SAST/DAST)",
      "10h30: Threat Modeling com squads que estão desenhando novas funcionalidades críticas",
      "14h00: Revisão de políticas de acesso (IAM), gestão de segredos e conformidade (LGPD/SOC2)",
      "16h30: Simulação de ataques e auditoria em dependências vulneráveis de pacotes open source"
    ],
    typicalDeliverables: [
      "Políticas corporativas de segurança da informação e esteiras de DevSecOps automatizadas",
      "Relatórios de pentest e planos de remediação de falhas com SLA de correção",
      "Diretrizes de proteção contra fraudes, vazamentos de credenciais e ataques comuns"
    ],
    commonChallenges: "Ser visto pela engenharia como um 'bloqueador de entregas' em vez de um parceiro de negócio.",
    discFitReason: "A Conformidade (C) garante a detecção milimétrica de brechas de segurança, enquanto a Dominância (D) dá a firmeza necessária para barrar deploys que representem risco inaceitável.",
    roadmapUrl: "https://roadmap.sh/cyber-security",
    roadmapLabel: "Roadmap Cyber Security (roadmap.sh)",
  },
  {
    id: "agile-coach",
    title: "Scrum Master / Agile Coach",
    primaryDisc: "S",
    secondaryDisc: "I",
    description: "Facilita cerimônias ágeis, remove impedimentos, promove melhoria contínua e estimula a auto-organização da equipe.",
    salaryRange: "R$ 8.500 – R$ 15.000 / mês",
    keySkills: ["Facilitação", "Escuta Ativa", "Métricas Ágeis", "Resolução de Conflitos"],
    weights: { D: 0.10, I: 0.40, S: 0.40, C: 0.10 },
    dailyRoutine: [
      "09h30: Facilitação e observação dinâmica das Dailies das squads sob sua mentoria",
      "11h00: Análise de métricas de fluxo (Lead Time, Throughput, Cumulative Flow Diagram)",
      "14h00: Preparação de dinâmicas interativas para Retrospectivas e Planning Meetings",
      "16h00: Conversas individuais de alinhamento com membros da squad para desatar nós relacionais"
    ],
    typicalDeliverables: [
      "Dashboards de métricas de fluxo e previsibilidade da entrega das equipes",
      "Planos de ação derivados de retrospectivas para melhoria contínua dos processos",
      "Treinamentos de práticas ágeis e workshops de segurança psicológica"
    ],
    commonChallenges: "Evitar que cerimônias ágeis virem rituais burocráticos vazios e desengajados para os engenheiros.",
    discFitReason: "A alta Estabilidade (S) traz paciência e capacidade de escuta profunda para mediar atritos, combinada com a Influência (I) que engaja as pessoas na cultura de colaboração.",
    roadmapUrl: "https://roadmap.sh/product-manager",
    roadmapLabel: "Roadmap Product Manager (roadmap.sh)",
  },
  {
    id: "product-designer",
    title: "Product Designer (UX/UI)",
    primaryDisc: "I",
    secondaryDisc: "D",
    description: "Conduz pesquisas com usuários (Discovery), define fluxos e protótipos interativos no Figma, testa usabilidade e acompanha métricas HEART.",
    salaryRange: "R$ 8.500 – R$ 15.500 / mês",
    keySkills: ["UX Research", "Prototipação Figma", "Arquitetura de Informação", "Testes A/B"],
    weights: { D: 0.25, I: 0.35, S: 0.20, C: 0.20 },
    dailyRoutine: [
      "09h30: Alinhamento de Discovery com PM e Tech Lead sobre hipóteses da sprint",
      "11h00: Entrevistas com usuários, síntese de personas e mapeamento de jornadas",
      "14h00: Criação de fluxos e protótipos interativos no Figma aplicando heurísticas",
      "16h30: Design Critique com o time de design e handoff detalhado para engenharia"
    ],
    typicalDeliverables: [
      "Fluxos de navegação, wireframes e protótipos validados em testes de usabilidade",
      "Relatórios de pesquisa qualitativa (JTBD, mapas de empatia e oportunidades)",
      "Especificações de interface acessíveis (WCAG) prontas para desenvolvimento"
    ],
    commonChallenges: "Defender tempo para pesquisa e validação antes de partir direto para telas finais quando há pressão por entregas rápidas.",
    discFitReason: "A Influência (I) favorece empatia nas entrevistas e articulação com stakeholders, enquanto a Dominância (D) conecta o design a metas concretas de produto.",
    roadmapUrl: "https://roadmap.sh/product-design",
    roadmapLabel: "Roadmap Product Design (roadmap.sh)"
  },
  {
    id: "design-system-specialist",
    title: "Design System Specialist",
    primaryDisc: "C",
    secondaryDisc: "S",
    description: "Arquiteta tokens de design (cores, claro/escuro, tipografia), bibliotecas de componentes acessíveis e governança entre Figma e código.",
    salaryRange: "R$ 10.000 – R$ 17.000 / mês",
    keySkills: ["Design Tokens", "Atomic Design", "Acessibilidade (a11y)", "Figma e Código"],
    weights: { D: 0.15, I: 0.20, S: 0.25, C: 0.40 },
    dailyRoutine: [
      "09h30: Auditoria visual de componentes em produção buscando inconsistências",
      "11h00: Evolução de Design Tokens semânticos para temas claro/escuro e responsividade",
      "14h00: Pareamento com devs Frontend para versionar componentes acessíveis",
      "16h30: Documentação de diretrizes de uso, estados interativos e suporte às squads"
    ],
    typicalDeliverables: [
      "Biblioteca centralizada no Figma sincronizada com componentes em código",
      "Documentação técnica de tokens, grids, espaçamento e contraste WCAG",
      "Processo de governança e versionamento para contribuições de outras squads"
    ],
    commonChallenges: "Equilibrar padronização rigorosa sem bloquear a velocidade criativa das equipes de produto.",
    discFitReason: "A Conformidade (C) assegura rigor estrutural em tokens e acessibilidade, enquanto a Estabilidade (S) garante manutenção contínua e previsível do sistema.",
    roadmapUrl: "https://roadmap.sh/design-system",
    roadmapLabel: "Roadmap Design System (roadmap.sh)"
  }
];

// Tech Role Benchmarks
export interface BenchmarkProfile {
  id: string;
  name: string;
  shortName: string;
  description: string;
  scores: Record<DiscLetter, number>;
}

export const PLENO_DEV_BENCHMARK: Record<DiscLetter, number> = {
  D: 20, // Autonomia na sprint para entregar sem travar
  I: 15, // Comunicação clara e objetiva em dailies/code reviews
  S: 30, // Consistência, previsibilidade de entrega e rotina
  C: 35, // Rigor técnico, testes unitários, clean code e edge cases
};

export const BENCHMARK_PROFILES: Record<string, BenchmarkProfile> = {
  pleno: {
    id: "pleno",
    name: "Perfil Ideal — Desenvolvedor Pleno",
    shortName: "Dev Pleno",
    description: "Foco prioritário em qualidade técnica (C: 35%) e consistência operacional (S: 30%), com boa autonomia para executar tarefas (D: 20%) e comunicação colaborativa (I: 15%).",
    scores: PLENO_DEV_BENCHMARK,
  },
  senior: {
    id: "senior",
    name: "Perfil Ideal — Desenvolvedor Sênior",
    shortName: "Dev Sênior",
    description: "Equilíbrio entre tomada de decisão técnica sob incerteza (D: 30%), mentoria técnica (I: 20%), estabilidade (S: 20%) e excelência arquitetural (C: 30%).",
    scores: { D: 30, I: 20, S: 20, C: 30 },
  },
  industry: {
    id: "industry",
    name: "Média Geral da Indústria Tech",
    shortName: "Média Tech",
    description: "Média observada em times gerais de engenharia de software no mercado de tecnologia.",
    scores: { D: 24, I: 20, S: 26, C: 30 },
  },
};

// Tech Industry Benchmarks (backward compatibility)
export const INDUSTRY_BENCHMARKS: Record<DiscLetter, number> = PLENO_DEV_BENCHMARK;

