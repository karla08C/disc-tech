import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Header, ActiveTab } from './components/Header';
import { DiscLetter, QuizMode, TestRecord } from './types/disc';

const AssessmentQuiz = lazy(() =>
  import('./components/AssessmentQuiz').then((m) => ({ default: m.AssessmentQuiz }))
);
const ResultReport = lazy(() =>
  import('./components/ResultReport').then((m) => ({ default: m.ResultReport }))
);
const TransitionExplorer = lazy(() =>
  import('./components/TransitionExplorer').then((m) => ({ default: m.TransitionExplorer }))
);
const HistoryComparison = lazy(() =>
  import('./components/HistoryComparison').then((m) => ({ default: m.HistoryComparison }))
);
const AiCoachModal = lazy(() =>
  import('./components/AiCoachModal').then((m) => ({ default: m.AiCoachModal }))
);
import { calculateDiscResult, loadTestHistory, saveTestRecord, deleteTestRecord } from './utils/discCalculator';
import { decodeSharedProfile, buildAnswersFromPercentages } from './utils/shareUtils';
import { PROFILES } from './data/discData';
import { PREVIOUS_BACKGROUNDS } from './data/transitionData';
import { ArrowRight, Zap, Users, BrainCircuit, Terminal, Map, FileText } from 'lucide-react';

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('disc_tech_theme');
      if (stored === 'dark' || stored === 'light') return stored;
    }
    return 'light';
  });
  const [activeTab, setActiveTab] = useState<ActiveTab>('test');
  const [userName, setUserName] = useState<string>('');
  const [quizActive, setQuizActive] = useState<boolean>(false);
  const quizMode: QuizMode = 'beginner';
  const [selectedBgId, setSelectedBgId] = useState<string>('first-job');
  const [answers, setAnswers] = useState<DiscLetter[]>([]);
  const [history, setHistory] = useState<TestRecord[]>([]);
  const [isAiCoachOpen, setIsAiCoachOpen] = useState<boolean>(false);
  const [selectedTargetRole, setSelectedTargetRole] = useState<string>('Primeira Vaga em TI (Júnior / Estágio)');
  const [sharedBanner, setSharedBanner] = useState<{ isShared: boolean; name: string; dominant: DiscLetter } | null>(null);

  // Sync theme class on documentElement and persist preference
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('disc_tech_theme', theme);
    }
  }, [theme]);

  // Load history from localStorage or hydrate from share link on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const shareCode = urlParams.get('share') || urlParams.get('p') || urlParams.get('profile');
      if (shareCode) {
        const decoded = decodeSharedProfile(shareCode);
        if (decoded) {
          setUserName(decoded.name);
          const reconstructed = buildAnswersFromPercentages(decoded.pct);
          setAnswers(reconstructed);
          setActiveTab('result');
          setSharedBanner({
            isShared: true,
            name: decoded.name,
            dominant: decoded.dominant,
          });
          return;
        }
      }
    }

    const records = loadTestHistory();
    setHistory(records);
    if (records.length > 0 && !userName) {
      setUserName(records[0].name);
    }
  }, []);

  const currentResult = answers.length > 0 ? calculateDiscResult(answers) : null;

  const handleQuizComplete = (completedAnswers: DiscLetter[]) => {
    setAnswers(completedAnswers);
    setQuizActive(false);
    setActiveTab('result');

    const result = calculateDiscResult(completedAnswers);
    const newRecord: TestRecord = {
      id: crypto.randomUUID(),
      name: userName.trim() || 'Profissional Tech',
      date: new Date().toISOString(),
      dominant: result.dominant,
      secondary: result.secondary,
      pct: result.pct,
      mode: quizMode,
    };
    saveTestRecord(newRecord);
    setHistory(loadTestHistory());
  };

  const handleStartQuiz = () => {
    setAnswers([]);
    setQuizActive(true);
    setActiveTab('test');
  };

  const handleCancelQuiz = () => {
    setQuizActive(false);
    if (answers.length > 0) {
      setActiveTab('result');
    }
  };

  const handleDeleteHistory = (id: string) => {
    const updated = deleteTestRecord(id);
    setHistory(updated);
    if (updated.length === 0 && activeTab === 'history') {
      setActiveTab(answers.length > 0 ? 'result' : 'test');
    }
  };

  const handleSelectRecordFromHistory = (rec: TestRecord) => {
    setUserName(rec.name);
    const mockAnswers: DiscLetter[] = [];
    const countD = Math.round((rec.pct.D / 100) * 20);
    const countI = Math.round((rec.pct.I / 100) * 20);
    const countS = Math.round((rec.pct.S / 100) * 20);
    const countC = 20 - (countD + countI + countS);

    for (let i = 0; i < countD; i++) mockAnswers.push('D');
    for (let i = 0; i < countI; i++) mockAnswers.push('I');
    for (let i = 0; i < countS; i++) mockAnswers.push('S');
    for (let i = 0; i < countC; i++) mockAnswers.push('C');

    setAnswers(mockAnswers);
    setActiveTab('result');
  };

  const handleSelectCareerForCoach = (careerTitle: string) => {
    setSelectedTargetRole(careerTitle);
    setIsAiCoachOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] dark:bg-[#0b0f17] text-slate-900 dark:text-slate-100 flex flex-col font-sans bg-tech-grid relative transition-colors">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:rounded-xl focus:bg-indigo-600 focus:text-white focus:text-xs focus:font-semibold focus:shadow-lg no-print"
      >
        Pular para o conteúdo principal
      </a>
      {/* Top Navigation */}
      <Header
        activeTab={activeTab}
        onSelectTab={(tab) => {
          if (tab === 'test') {
            setQuizActive(false);
          }
          setActiveTab(tab);
        }}
        hasResult={answers.length > 0}
        historyCount={history.length}
        theme={theme}
        onToggleTheme={() => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))}
      />

      {/* Shared Profile Notification Banner */}
      {sharedBanner && (
        <div className="bg-indigo-50 dark:bg-indigo-950/60 border-b border-indigo-200 dark:border-indigo-500/30 px-4 py-3 text-xs flex flex-wrap items-center justify-between gap-3 no-print">
          <div className="text-slate-700 dark:text-slate-200">
            Você está visualizando o perfil compartilhado de{' '}
            <strong className="text-slate-900 dark:text-white font-semibold">{sharedBanner.name}</strong>{' '}
            (Perfil Dominante:{' '}
            <span className="font-mono text-indigo-700 dark:text-indigo-300 font-bold">
              {sharedBanner.dominant} — {PROFILES[sharedBanner.dominant]?.title}
            </span>
            ).
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setSharedBanner(null);
                if (typeof window !== 'undefined') {
                  window.history.replaceState({}, '', window.location.pathname);
                }
                handleStartQuiz();
              }}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition cursor-pointer"
            >
              Fazer meu próprio teste DISC Tech
            </button>
            <button
              type="button"
              onClick={() => {
                setSharedBanner(null);
                if (typeof window !== 'undefined') {
                  window.history.replaceState({}, '', window.location.pathname);
                }
              }}
              className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-2 py-1 text-xs transition cursor-pointer"
            >
              Dispensar
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main id="main-content" tabIndex={-1} className="flex-1 pb-16 focus:outline-none">
        <Suspense
          fallback={
            <div
              role="status"
              aria-live="polite"
              className="w-full max-w-4xl mx-auto px-4 py-16 text-center text-xs text-slate-500 dark:text-slate-400"
            >
              Carregando módulo...
            </div>
          }
        >
        {/* TAB: TEST / ASSESSMENT */}
        {activeTab === 'test' && (
          <>
            {quizActive ? (
              <AssessmentQuiz
                userName={userName}
                quizMode={quizMode}
                onComplete={handleQuizComplete}
                onCancel={handleCancelQuiz}
              />
            ) : (
              /* Intro Landing Screen */
              <div className="w-full max-w-5xl mx-auto px-4 py-12 space-y-12">
                {/* Hero section */}
                <div className="text-center space-y-6 max-w-3xl mx-auto">
                  <div className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-mono">
                    <Terminal className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>Avaliação Comportamental · Iniciantes e Transição para TI</span>
                  </div>

                  <h1 className="text-3xl sm:text-5xl font-semibold text-slate-900 dark:text-white tracking-tight leading-[1.15] text-balance">
                    Descubra qual área de tecnologia{' '}
                    <span className="text-indigo-600 dark:text-indigo-400">
                      combina com você
                    </span>
                  </h1>

                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                    Não sabe programar ou está migrando de outra profissão? Em 3 minutos você descobre seu perfil comportamental DISC, aproveita o que já sabe da sua área atual e recebe um roteiro de entrada de 30 dias + roadmap passo a passo.
                  </p>

                  {currentResult && (
                    <div className="mx-auto max-w-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-500/30 px-4 py-3 rounded-xl flex flex-wrap items-center justify-between gap-3 text-left">
                      <div className="flex items-center gap-2.5 text-xs text-emerald-900 dark:text-emerald-200">
                        <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>
                          Você possui uma avaliação concluída ({PROFILES[currentResult.dominant].title}).
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveTab('result')}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:text-emerald-900 dark:hover:text-white transition cursor-pointer"
                      >
                        <span>Voltar para Meu Relatório</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Name & Moment Selection Box */}
                  <div className="mx-auto max-w-lg bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 rounded-2xl shadow-xs space-y-4 text-left">
                    <div>
                      <label htmlFor="name-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Como prefere ser chamado(a)?
                      </label>
                      <input
                        id="name-input"
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Ex: Lucas, Camila, Rafael..."
                        maxLength={60}
                        className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
                      />
                    </div>

                    {/* Previous Background Quick Picker */}
                    <div className="space-y-1.5">
                      <label htmlFor="bg-select" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Qual é o seu ponto de partida hoje?
                      </label>
                      <select
                        id="bg-select"
                        value={selectedBgId}
                        onChange={(e) => setSelectedBgId(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-950 text-slate-900 dark:text-white focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition cursor-pointer"
                      >
                        {PREVIOUS_BACKGROUNDS.map((bg) => (
                          <option key={bg.id} value={bg.id}>
                            {bg.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleStartQuiz()}
                      className="w-full py-3.5 px-6 rounded-xl font-semibold text-sm tracking-wide bg-indigo-600 hover:bg-indigo-700 dark:hover:bg-indigo-500 text-white border border-indigo-600/30 shadow-2xs transition duration-150 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Descobrir Minha Área em Tech</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-2 text-xs">
                      <span className="text-slate-500 dark:text-slate-400">
                        Prefere pesquisar áreas sem fazer o teste?
                      </span>
                      <button
                        type="button"
                        onClick={() => setActiveTab('transition')}
                        className="inline-flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold transition cursor-pointer whitespace-nowrap shrink-0"
                      >
                        <Map className="w-3.5 h-3.5" />
                        Explorar Áreas de TI
                      </button>
                    </div>
                  </div>
                </div>

                {/* 4 DISC Quadrants Preview Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                  {(['D', 'I', 'S', 'C'] as DiscLetter[]).map((letter) => {
                    const p = PROFILES[letter];
                    return (
                      <div
                        key={letter}
                        className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition flex flex-col justify-between shadow-2xs"
                      >
                        <div>
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center font-mono font-semibold text-lg mb-3 border"
                            style={{
                              backgroundColor: `${p.color}12`,
                              color: p.color,
                              borderColor: `${p.color}30`,
                            }}
                          >
                            {letter}
                          </div>
                          <h3 className="font-semibold text-slate-900 dark:text-white text-base">{p.title}</h3>
                          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                            {p.tagline}
                          </p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-200/80 dark:border-slate-800 text-[11px] font-mono font-medium" style={{ color: p.color }}>
                          {letter === 'D' && 'Dominância · Execução & Decisão'}
                          {letter === 'I' && 'Influência · Pessoas & Articulação'}
                          {letter === 'S' && 'Estabilidade · Resiliência & Ritmo'}
                          {letter === 'C' && 'Conformidade · Rigor & Arquitetura'}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Feature Highlights Grid */}
                <div className="bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xs">
                  <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wide mb-4">
                    Pensado para quem está entrando ou migrando para TI
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-red-500/10 text-rose-600 dark:text-red-400 flex items-center justify-center shrink-0 border border-rose-200 dark:border-transparent">
                        <Zap className="w-4 h-4" />
                      </div>
                      <div>
                        <strong className="text-slate-900 dark:text-white block text-sm mb-0.5">
                          Aproveite sua Experiência
                        </strong>
                        Traduza habilidades de vendas, administração, atendimento, saúde, direito ou design para vagas tech.
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0 border border-sky-200 dark:border-transparent">
                        <Users className="w-4 h-4" />
                      </div>
                      <div>
                        <strong className="text-slate-900 dark:text-white block text-sm mb-0.5">
                          Portas de Entrada Claras
                        </strong>
                        Compare áreas com e sem código obrigatório (UX/UI, Dados/BI, QA, Produto, Frontend, Backend e Cloud).
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-200 dark:border-transparent">
                        <BrainCircuit className="w-4 h-4" />
                      </div>
                      <div>
                        <strong className="text-slate-900 dark:text-white block text-sm mb-0.5">
                          Plano 30 Dias + Roadmap
                        </strong>
                        Receba seu 1º projeto de portfólio e trilha interativa conectada ao roadmap.sh para estudar com foco.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="text-center text-xs text-slate-500 space-y-1">
                  <div>DISC Tech 2.0 · Análise Comportamental para Tecnologia</div>
                  <div>Metodologia DISC adaptada para iniciantes e pessoas em transição de carreira para TI.</div>
                </div>
              </div>
            )}
          </>
        )}

        {/* TAB: EXPLORE ENTRY TECH AREAS */}
        {activeTab === 'transition' && (
          <TransitionExplorer
            userPct={currentResult?.pct || null}
            userName={userName}
            selectedBgId={selectedBgId}
            onSelectBgId={setSelectedBgId}
            onStartBeginnerQuiz={() => handleStartQuiz()}
            onSelectCareerForCoach={handleSelectCareerForCoach}
          />
        )}

        {/* TAB: RESULT */}
        {activeTab === 'result' && currentResult && (
          <ResultReport
            name={userName}
            dominant={currentResult.dominant}
            secondary={currentResult.secondary}
            dualCode={currentResult.dualCode}
            pct={currentResult.pct}
            selectedBgId={selectedBgId}
            onSelectBgId={setSelectedBgId}
            onRestart={() => handleStartQuiz()}
            onOpenAiCoach={() => setIsAiCoachOpen(true)}
            onOpenTransitionGuide={() => setActiveTab('transition')}
          />
        )}

        {/* TAB: HISTORY */}
        {activeTab === 'history' && (
          <HistoryComparison
            records={history}
            onDeleteRecord={handleDeleteHistory}
            onSelectRecord={handleSelectRecordFromHistory}
            onStartNewTest={() => handleStartQuiz()}
          />
        )}
        </Suspense>
      </main>

      {/* AI Coaching Modal */}
      {isAiCoachOpen && (
        <Suspense fallback={null}>
          <AiCoachModal
            isOpen={isAiCoachOpen}
            onClose={() => setIsAiCoachOpen(false)}
            userName={userName}
            dominant={currentResult?.dominant || 'D'}
            pct={currentResult?.pct || { D: 35, I: 25, S: 20, C: 20 }}
            currentCareers={currentResult ? PROFILES[currentResult.dominant].careers : []}
            initialTargetRole={selectedTargetRole}
            quizMode={quizMode}
          />
        </Suspense>
      )}
    </div>
  );
}
