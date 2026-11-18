import React, { useState, useEffect } from 'react';
import { Header, ActiveTab } from './components/Header';
import { AssessmentQuiz } from './components/AssessmentQuiz';
import { ResultReport } from './components/ResultReport';
import { SquadSimulator } from './components/SquadSimulator';
import { CareerExplorer } from './components/CareerExplorer';
import { TransitionExplorer } from './components/TransitionExplorer';
import { HistoryComparison } from './components/HistoryComparison';
import { AiCoachModal } from './components/AiCoachModal';
import { DiscLetter, QuizMode, TestRecord } from './types/disc';
import { calculateDiscResult, loadTestHistory, saveTestRecord, deleteTestRecord } from './utils/discCalculator';
import { decodeSharedProfile, buildAnswersFromPercentages } from './utils/shareUtils';
import { PROFILES } from './data/discData';
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
  const [quizMode, setQuizMode] = useState<QuizMode>('standard');
  const [answers, setAnswers] = useState<DiscLetter[]>([]);
  const [history, setHistory] = useState<TestRecord[]>([]);
  const [savedResultId, setSavedResultId] = useState<string | null>(null);
  const [isAiCoachOpen, setIsAiCoachOpen] = useState<boolean>(false);
  const [selectedTargetRole, setSelectedTargetRole] = useState<string>('Tech Lead');
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
    setSavedResultId(newRecord.id);
    setHistory(loadTestHistory());
  };

  const handleStartQuiz = (modeOverride?: QuizMode) => {
    if (modeOverride) {
      setQuizMode(modeOverride);
    }
    setAnswers([]);
    setSavedResultId(null);
    setQuizActive(true);
    setActiveTab('test');
  };

  const handleCancelQuiz = () => {
    setQuizActive(false);
    if (answers.length > 0) {
      setActiveTab('result');
    }
  };

  const handleManualSave = () => {
    if (!currentResult) return;
    const newRecord: TestRecord = {
      id: crypto.randomUUID(),
      name: userName.trim() || 'Profissional Tech',
      date: new Date().toISOString(),
      dominant: currentResult.dominant,
      secondary: currentResult.secondary,
      pct: currentResult.pct,
      mode: quizMode,
    };
    saveTestRecord(newRecord);
    setSavedResultId(newRecord.id);
    setHistory(loadTestHistory());
  };

  const handleDeleteHistory = (id: string) => {
    const updated = deleteTestRecord(id);
    setHistory(updated);
    if (savedResultId === id) {
      setSavedResultId(null);
    }
  };

  const handleSelectRecordFromHistory = (rec: TestRecord) => {
    setUserName(rec.name);
    setQuizMode(rec.mode || 'standard');
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
    setSavedResultId(rec.id);
    setActiveTab('result');
  };

  const handleSelectCareerForCoach = (careerTitle: string) => {
    setSelectedTargetRole(careerTitle);
    setIsAiCoachOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f17] text-slate-900 dark:text-slate-100 flex flex-col font-sans bg-tech-grid relative transition-colors">
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
        <div className="bg-indigo-50 dark:bg-indigo-950/60 border-b border-indigo-200 dark:border-indigo-500/30 px-4 py-3 text-xs flex flex-wrap items-center justify-between gap-3">
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
      <main className="flex-1 pb-16">
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
                  <div className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-300 text-xs font-mono">
                    <Terminal className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>Avaliação Comportamental para Carreiras em TI</span>
                  </div>

                  <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight text-balance">
                    Descubra seu perfil DISC para o{' '}
                    <span className="text-indigo-600 dark:text-indigo-400">
                      mercado tech
                    </span>
                  </h1>

                  <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                    20 perguntas de escolha forçada para quem já atua na área ou está começando do zero. Em 3 minutos você descobre seu perfil comportamental e quais caminhos em tecnologia mais combinam com você.
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
                  <div className="mx-auto max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 rounded-2xl shadow-sm space-y-4 text-left">
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
                        className="w-full px-4 py-3 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
                      />
                    </div>

                    {/* Quiz Mode Selector */}
                    <div className="space-y-2">
                      <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Qual é o seu momento atual?
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <button
                          type="button"
                          onClick={() => setQuizMode('beginner')}
                          className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                            quizMode === 'beginner'
                              ? 'bg-indigo-50 dark:bg-indigo-600/20 border-indigo-500 text-slate-900 dark:text-white'
                              : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700'
                          }`}
                        >
                          <div className="text-xs font-semibold">Iniciante ou em Transição</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            Linguagem simples, sem siglas técnicas
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => setQuizMode('standard')}
                          className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                            quizMode === 'standard'
                              ? 'bg-indigo-50 dark:bg-indigo-600/20 border-indigo-500 text-slate-900 dark:text-white'
                              : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700'
                          }`}
                        >
                          <div className="text-xs font-semibold">Já atuo em Tecnologia</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            Cenários de squad, PRs e produção
                          </div>
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleStartQuiz(quizMode)}
                      className="w-full py-3.5 px-6 rounded-xl font-semibold text-sm tracking-wide bg-indigo-600 hover:bg-indigo-700 dark:hover:bg-indigo-500 text-white border border-indigo-600/30 shadow-xs transition duration-150 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Iniciar Análise Comportamental</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 text-xs">
                      <span className="text-slate-600 dark:text-slate-400">
                        Ainda não sabe qual área de TI escolher?
                      </span>
                      <button
                        type="button"
                        onClick={() => setActiveTab('transition')}
                        className="inline-flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold transition cursor-pointer whitespace-nowrap shrink-0"
                      >
                        <Map className="w-3.5 h-3.5" />
                        Explorar Guia de Entrada
                      </button>
                    </div>
                  </div>
                </div>

                {/* 4 DISC Quadrants Preview Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
                  {(['D', 'I', 'S', 'C'] as DiscLetter[]).map((letter) => {
                    const p = PROFILES[letter];
                    return (
                      <div
                        key={letter}
                        className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition flex flex-col justify-between shadow-2xs"
                      >
                        <div>
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-xl mb-3 border"
                            style={{
                              backgroundColor: `${p.color}15`,
                              color: p.color,
                              borderColor: `${p.color}35`,
                            }}
                          >
                            {letter}
                          </div>
                          <h3 className="font-bold text-slate-900 dark:text-white text-base">{p.title}</h3>
                          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                            {p.tagline}
                          </p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] font-mono font-medium" style={{ color: p.color }}>
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
                <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xs">
                  <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wide mb-4">
                    O que você recebe ao concluir o teste
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-red-500/10 text-rose-600 dark:text-red-400 flex items-center justify-center shrink-0 border border-rose-200 dark:border-transparent">
                        <Zap className="w-4 h-4" />
                      </div>
                      <div>
                        <strong className="text-slate-900 dark:text-white block text-sm mb-0.5">
                          Superpoderes & Bugs
                        </strong>
                        Diagnóstico prático com pontos fortes, alertas comportamentais e recomendações para o dia a dia.
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0 border border-sky-200 dark:border-transparent">
                        <Users className="w-4 h-4" />
                      </div>
                      <div>
                        <strong className="text-slate-900 dark:text-white block text-sm mb-0.5">
                          Simulador de Squad
                        </strong>
                        Teste como o seu perfil interage com Tech Leads, POs, SREs e arquitetos para evitar gargalos na equipe.
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-200 dark:border-transparent">
                        <BrainCircuit className="w-4 h-4" />
                      </div>
                      <div>
                        <strong className="text-slate-900 dark:text-white block text-sm mb-0.5">
                          Carreiras & PDI 90 Dias
                        </strong>
                        Recomendações didáticas de cargos tech e plano personalizado de desenvolvimento de carreira.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="text-center text-xs text-slate-500 space-y-1">
                  <div>DISC Tech 2.0 · Análise Comportamental para Tecnologia</div>
                  <div>Metodologia adaptada para iniciantes, profissionais em transição e squads de software.</div>
                </div>
              </div>
            )}
          </>
        )}

        {/* TAB: TRANSITION & BEGINNERS GUIDE */}
        {activeTab === 'transition' && (
          <TransitionExplorer
            userPct={currentResult?.pct || null}
            userName={userName}
            onStartBeginnerQuiz={() => handleStartQuiz('beginner')}
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
            quizMode={quizMode}
            onRestart={() => handleStartQuiz(quizMode)}
            onOpenAiCoach={() => setIsAiCoachOpen(true)}
            onOpenTransitionGuide={() => setActiveTab('transition')}
            onSaveResult={handleManualSave}
            isSaved={!!savedResultId}
          />
        )}

        {/* TAB: CAREERS EXPLORER */}
        {activeTab === 'careers' && (
          <CareerExplorer
            userPct={currentResult?.pct || null}
            userName={userName}
            onSelectCareerForCoach={handleSelectCareerForCoach}
          />
        )}

        {/* TAB: SQUAD SIMULATOR */}
        {activeTab === 'squad' && (
          <SquadSimulator
            currentUserProfile={
              currentResult
                ? {
                    name: userName || 'Você',
                    dominant: currentResult.dominant,
                    secondary: currentResult.secondary,
                    pct: currentResult.pct,
                  }
                : null
            }
          />
        )}

        {/* TAB: HISTORY */}
        {activeTab === 'history' && (
          <HistoryComparison
            records={history}
            onDeleteRecord={handleDeleteHistory}
            onSelectRecord={handleSelectRecordFromHistory}
            onStartNewTest={() => handleStartQuiz(quizMode)}
          />
        )}
      </main>

      {/* AI Coaching Modal */}
      <AiCoachModal
        isOpen={isAiCoachOpen}
        onClose={() => setIsAiCoachOpen(false)}
        userName={userName}
        dominant={currentResult?.dominant || 'D'}
        pct={currentResult?.pct || { D: 35, I: 25, S: 20, C: 20 }}
        currentCareers={currentResult ? PROFILES[currentResult.dominant].careers : []}
        initialTargetRole={selectedTargetRole}
      />
    </div>
  );
}
