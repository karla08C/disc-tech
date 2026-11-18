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
    prompt: "Ao aprender uma nova stack ou tecnologia:",
    options: [
      { text: "Mergulho direto na prática e coloco algo no ar o mais rápido possível", letter: "D" },
      { text: "Assisto tech talks, troco ideias com a comunidade e vejo cases reais", letter: "I" },
      { text: "Sigo um curso estruturado e tutoriais passo a passo com consistência", letter: "S" },
      { text: "Leio a documentação oficial, release notes e RFCs minuciosamente", letter: "C" },
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
    prompt: "Em uma entrevista técnica, sinto-me mais à vontade com:",
    options: [
      { text: "Desafios de System Design e decisões estratégicas de trade-offs", letter: "D" },
      { text: "Conversas sobre cultura, visão de produto e liderança colaborativa", letter: "I" },
      { text: "Pair programming colaborativo em um ambiente receptivo e acolhedor", letter: "S" },
      { text: "Live coding rigoroso com testes unitários, algoritmos e cobertura", letter: "C" },
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
    prompt: "Minha visão prática sobre documentação de software:",
    options: [
      { text: "Mínima e pragmática: o código limpo e o deploy contínuo falam por si", letter: "D" },
      { text: "Visual, interativa, com diagramas e tutoriais que facilitem o onboarding", letter: "I" },
      { text: "Padronizada, estável e sempre acessível como referência da equipe", letter: "S" },
      { text: "Completa, exata, cobrindo contratos de API, schemas e edge cases", letter: "C" },
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
    prompt: "Em um Pull Request com mais de 30 arquivos alterados:",
    options: [
      { text: "Aprovo se a pipeline passou verde e a funcionalidade principal roda", letter: "D" },
      { text: "Parabenizo o autor pelo esforço e deixo comentários agregadores", letter: "I" },
      { text: "Reviso sem pressa, assegurando que nada quebre fluxos já existentes", letter: "S" },
      { text: "Inspeciono cada linha, tipagem, complexidade ciclomática e testes", letter: "C" },
    ],
  },
  {
    id: 20,
    prompt: "Para planejar o próximo salto da minha carreira tech:",
    options: [
      { text: "Busco posições de liderança técnica, gestão ou novos desafios de escala", letter: "D" },
      { text: "Amplio meu networking, palestras, mentorias e comunidades de tech", letter: "I" },
      { text: "Aprofundo com consistência na empresa e fortaleço laços no time", letter: "S" },
      { text: "Estudo teorias avançadas, certificações sólidas e arquiteturas de ponta", letter: "C" },
    ],
  },
];

export const PROFILES: Record<DiscLetter, ProfileDetails> = {
  D: {
    letter: "D",
    title: "O Tech Lead Executor",
    tagline: "Decisão rápida, foco em resultado, impacto e entrega em produção.",
    summary: "Profissionais com alta Dominância são movidos por desafios e velocidade. Assumem riscos calculados, quebram bloqueios técnicos e mantêm a squad focada no objetivo final sem hesitação.",
    superpowers: [
      "Toma decisões técnicas críticas sob forte pressão sem paralisar a squad",
      "Converte backlogs estagnados em entregas em produção com velocidade notável",
      "Encara problemas de alta complexidade como oportunidades imediatas de evolução",
      "Protege a equipe contra bloqueios operacionais e burocracias desnecessárias"
    ],
    debugs: [
      {
        issue: "Stack Overflow de Opinião: Pode atropelar discussões e ignorar sinais dos colegas",
        fix: "Hotfix: Implemente a 'Regra dos 60 segundos'. Antes de deliberar, dê espaço formal para os membros mais introvertidos falarem. Você ganha contexto vital sem perder velocidade."
      },
      {
        issue: "Timeout com Processos: Baixa tolerância a ritos e documentação",
        fix: "Hotfix: Encare processos como o 'CI/CD comportamental do time': rituais bem feitos existem para escalar a sua capacidade de delegar, e não para amarrar suas mãos."
      }
    ],
    careers: ["Tech Lead", "Engineering Manager", "Head of Engineering", "Staff Engineer", "Product Owner"],
    growthAreas: [
      "Praticar escuta ativa: ouvir até o final da explicação antes de formular a resposta",
      "Empatia no code review e feedbacks: focar no código e no aprendizado, preservando as pessoas",
      "Paciência com os ciclos colaborativos de maturação de ideias no time",
      "Aprender a delegar a propriedade intelectual das soluções, sem microgerenciamento"
    ],
    color: "#ef4444",
    accentColor: "from-rose-500 to-red-600",
    badgeBg: "bg-red-500/10 text-red-400 border-red-500/30",
    iconName: "Zap"
  },
  I: {
    letter: "I",
    title: "O Catalisador de Times",
    tagline: "Conecta pessoas, articula visões, contagia squads e fecha pontes entre tech e negócios.",
    summary: "Profissionais com alta Influência são os polinizadores da cultura tech. Transformam ideias abstratas em projetos empolgantes, comunicam-se com maestria com áreas não técnicas e mantém o moral elevado.",
    superpowers: [
      "Traduz conceitos de computação de alta complexidade em linguagem clara para stakeholders",
      "Cria e fortalece segurança psicológica (psychological safety) e cooperação na squad",
      "Destaca-se em demos de produto, hackathons, tech talks e pitches estratégicos",
      "Atrai talentos para a equipe e engaja devs juniores e plenos com facilidade"
    ],
    debugs: [
      {
        issue: "Memory Leak de Atenção: Foco disperso em múltiplas frentes sem conclusão",
        fix: "Hotfix: Reserve blocos inegociáveis de 2h diárias de Deep Work sem Slack, Teams ou e-mails abertos. A criatividade ganha potência exponencial quando unida ao foco profundo."
      },
      {
        issue: "Overpromising em Sprint: Subestimar prazos e complexidade técnica real",
        fix: "Hotfix: Utilize uma checagem cruzada com um par 'C' antes de formalizar compromissos de entrega com POs. Sua palavra adquire credibilidade inabalável com precisão."
      }
    ],
    careers: ["Developer Relations (DevRel)", "Product Manager", "Scrum Master / Agile Coach", "Solutions Engineer", "Tech Evangelist"],
    growthAreas: [
      "Desenvolver rigor na finalização de tarefas sem delegar a parte burocrática por tédio",
      "Aprofundar nos detalhes técnicos e acompanhar documentações de arquitetura",
      "Gerenciar expectativas com realismo métrico, evitando promessas precipitadas",
      "Cultivar a disciplina de execução silenciosa e focada"
    ],
    color: "#f59e0b",
    accentColor: "from-amber-400 to-orange-500",
    badgeBg: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    iconName: "MessageSquare"
  },
  S: {
    letter: "S",
    title: "O Engenheiro Estável",
    tagline: "Confiável, consistente, resiliente e o verdadeiro alicerce da squad.",
    summary: "Profissionais com alta Estabilidade são a âncora de qualquer time de alta performance. Entregam com consistência contínua, apoiam novos integrantes e asseguram que os sistemas operem com confiabilidade duradoura.",
    superpowers: [
      "Mantém serenidade e sangue frio durante crises severas de infraestrutura e produção",
      "Excepcional em onboarding, mentoria empática e retenção de conhecimentos do time",
      "Garante estabilidade operacional e previsibilidade constante nas sprints",
      "Excelente jogador de equipe, prevenindo conflitos destrutivos e mantendo o clima saudável"
    ],
    debugs: [
      {
        issue: "Deprecation Warning: Resistência silenciosa a pivôs de tecnologia ou metodologia",
        fix: "Hotfix: Encare cada nova ferramenta como um 'Feature Flag': proponha testar em um microserviço isolado por 2 semanas antes de avaliar a migração definitiva."
      },
      {
        issue: "Silenced Exceptions: Evitar confrontos necessários mesmo com risco iminente",
        fix: "Hotfix: Adote a fórmula construtiva 'Eu observo X (fato), me preocupo com Y (impacto técnico), proponho Z (alternativa)'. Divergir com elegância é o maior sinal de senioridade."
      }
    ],
    careers: ["Site Reliability Engineer (SRE)", "DevOps / Platform Engineer", "QA Engineer / SDET", "Senior Backend Developer", "Infrastructure Specialist"],
    growthAreas: [
      "Aumentar a flexibilidade diante de mudanças dinâmicas do mercado tech",
      "Tomar a iniciativa para verbalizar discordâncias e propor novas soluções",
      "Dar visibilidade às próprias conquistas e impacto gerado para a empresa",
      "Desenvolver conforto em tomar decisões técnicas mesmo sob incerteza"
    ],
    color: "#10b981",
    accentColor: "from-emerald-400 to-teal-500",
    badgeBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    iconName: "ShieldCheck"
  },
  C: {
    letter: "C",
    title: "O Arquiteto Analítico",
    tagline: "Precisão, excelência técnica, rigor estrutural e qualidade inegociável.",
    summary: "Profissionais com alta Conformidade são os guardiões da integridade técnica. Antecipam falhas silenciosas, constroem arquiteturas resilientes e garantem que o software escale com segurança e padrões irrepreensíveis.",
    superpowers: [
      "Atenção cirúrgica a edge cases, falhas de concorrência, tipagens e segurança",
      "Capacidade analítica de decompor problemas matemáticos e computacionais complexos",
      "Excelência em modelagem de dados, automação de testes e governança de código",
      "Garante que o débito técnico seja auditado e controlado de forma sistemática"
    ],
    debugs: [
      {
        issue: "Paralisia por Análise (Deadlock): Perfeccionismo que adia o momento do deploy",
        fix: "Hotfix: Aplique o paradigma 'Done is Better Than Perfect': defina critérios objetivos de 'Definition of Done (DoD)' e itere as melhorias em releases subsequentes."
      },
      {
        issue: "Permission Denied: Relutância em delegar e ceticismo com código de outros",
        fix: "Hotfix: Faça sessões de Pair Programming e crie Linters automatizados na esteira. Deixe que a pipeline aponte o estilo, libertando você para focar na lógica de alto nível."
      }
    ],
    careers: ["Software Architect", "Data Engineer / Scientist", "Security / AppSec Engineer", "Principal Software Engineer", "Core Systems Specialist"],
    growthAreas: [
      "Aceitar que 'bom o suficiente' para atender a janela de negócio é uma virtude de engenharia",
      "Desenvolver tolerância à ambiguidade nas fases iniciais de experimentação",
      "Aprimorar a empatia ao fornecer apontamentos em code reviews para não desmotivar os juniores",
      "Investir em habilidades relacionais para influenciar decisões sem precisar apenas de dados brutos"
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
    salaryRange: "R$ 16.000 – R$ 26.000 / mês",
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
    discFitReason: "A alta Dominância (D) fornece a coragem necessária para tomar decisões difíceis sob pressão, enquanto a Influência (I) mobiliza os desenvolvedores em torno da visão técnica."
  },
  {
    id: "engineering-manager",
    title: "Engineering Manager (EM)",
    primaryDisc: "I",
    secondaryDisc: "D",
    description: "Responsável pelo desenvolvimento de pessoas, planos de carreira (1:1s), processos ágeis, contratação e alinhamento estratégico.",
    salaryRange: "R$ 18.000 – R$ 30.000 / mês",
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
    discFitReason: "A alta Influência (I) cria segurança psicológica e laços de confiança sólidos, enquanto a Dominância (D) garante assertividade na cobrança e defesa da equipe perante a liderança."
  },
  {
    id: "software-architect",
    title: "Software Architect",
    primaryDisc: "C",
    secondaryDisc: "D",
    description: "Desenha sistemas distribuídos, define diretrizes globais de arquitetura, contratos de microsserviços e governança de tecnologia.",
    salaryRange: "R$ 20.000 – R$ 32.000 / mês",
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
    discFitReason: "A alta Conformidade (C) garante rigor analítico e antecipação de falhas catastróficas, enquanto a Dominância (D) sustenta a autoridade para padronizar diretrizes técnicas."
  },
  {
    id: "sre-devops",
    title: "Site Reliability Engineer (SRE)",
    primaryDisc: "S",
    secondaryDisc: "C",
    description: "Garante alta disponibilidade, observabilidade, esteiras de CI/CD, gestão de incidentes e tolerância a falhas na infraestrutura.",
    salaryRange: "R$ 14.000 – R$ 24.000 / mês",
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
    discFitReason: "A alta Estabilidade (S) confere sangue frio e compostura em crises, enquanto a Conformidade (C) assegura a precisão cirúrgica para diagnosticar causas-raiz."
  },
  {
    id: "devrel",
    title: "Developer Relations (DevRel)",
    primaryDisc: "I",
    secondaryDisc: "C",
    description: "A ponte entre a empresa e a comunidade dev. Cria documentações, palestras, SDKs de exemplo e dá voz aos desenvolvedores.",
    salaryRange: "R$ 13.000 – R$ 22.000 / mês",
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
    discFitReason: "A altíssima Influência (I) brilha no contato humano e na comunicação pública, amparada pela Conformidade (C) para manter o rigor e a exatidão técnica dos códigos de demonstração."
  },
  {
    id: "qa-sdet",
    title: "QA Engineer / SDET",
    primaryDisc: "C",
    secondaryDisc: "S",
    description: "Desenvolve esteiras automatizadas de testes (E2E, carga, contrato), previne regressões e garante a integridade dos deploys.",
    salaryRange: "R$ 10.000 – R$ 18.000 / mês",
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
    discFitReason: "A alta Conformidade (C) faz desse profissional um radar vivo de edge cases, enquanto a Estabilidade (S) confere paciência para testes repetitivos e consistentes."
  },
  {
    id: "product-manager",
    title: "Product Manager (Tech PM)",
    primaryDisc: "I",
    secondaryDisc: "D",
    description: "Descobre dores de usuários, orquestra o roadmap, prioriza hipóteses e conecta métricas de negócio às capacidades técnicas.",
    salaryRange: "R$ 15.000 – R$ 25.000 / mês",
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
    discFitReason: "A energia comunicativa (I) engaja os desenvolvedores na missão do produto, enquanto a Dominância (D) impulsiona o senso de urgência e foco implacável em resultados."
  },
  {
    id: "backend-specialist",
    title: "Senior Backend Developer",
    primaryDisc: "C",
    secondaryDisc: "S",
    description: "Constrói APIs performáticas, regras de negócio complexas, otimiza consultas em banco de dados e mantém a consistência transacional.",
    salaryRange: "R$ 12.000 – R$ 22.000 / mês",
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
    discFitReason: "A alta Conformidade (C) garante integridade de dados e arquitetura defensiva, enquanto a Estabilidade (S) mantém a cadência de entrega sólida dia após dia."
  },
  {
    id: "data-security",
    title: "Security / AppSec Engineer",
    primaryDisc: "C",
    secondaryDisc: "D",
    description: "Protege a aplicação contra vulnerabilidades (OWASP), realiza threat modeling, auditorias criptográficas e políticas de zero trust.",
    salaryRange: "R$ 16.000 – R$ 28.000 / mês",
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
    discFitReason: "A Conformidade (C) garante a detecção milimétrica de brechas de segurança, enquanto a Dominância (D) dá a firmeza necessária para barrar deploys que representem risco inaceitável."
  },
  {
    id: "agile-coach",
    title: "Scrum Master / Agile Coach",
    primaryDisc: "S",
    secondaryDisc: "I",
    description: "Facilita cerimônias ágeis, remove impedimentos, promove melhoria contínua e estimula a auto-organização da equipe.",
    salaryRange: "R$ 12.000 – R$ 20.000 / mês",
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
    discFitReason: "A alta Estabilidade (S) traz paciência e capacidade de escuta profunda para mediar atritos, combinada com a Influência (I) que engaja as pessoas na cultura de colaboração."
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

