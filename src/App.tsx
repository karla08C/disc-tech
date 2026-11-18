import React, { useState, useEffect } from 'react';
import { Header, ActiveTab } from './components/Header';
import { AssessmentQuiz } from './components/AssessmentQuiz';
import { ResultReport } from './components/ResultReport';
import { SquadSimulator } from './components/SquadSimulator';
import { CareerExplorer } from './components/CareerExplorer';
import { TransitionExplorer } from './components/TransitionExplorer';
import { HistoryComparison } from './components/HistoryComparison';
import { AiCoachModal } from './components/AiCoachModal';
import { DiscLetter, DiscPercentages, QuizMode, TestRecord } from './types/disc';
import { calculateDiscResult, loadTestHistory, saveTestRecord, deleteTestRecord } from './utils/discCalculator';
import { decodeSharedProfile, buildAnswersFromPercentages } from './utils/shareUtils';
import { PROFILES } from './data/discData';
import { ArrowRight, ShieldCheck, Zap, Users, BrainCircuit, Terminal, CheckCircle, Share2, X, Map } from 'lucide-react';

export default function App() {
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

  // Load history from localStorage or hydrate from share link on mount
  useEffect(() => {
    // Check for share query parameter
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

  // Compute active result
  const currentResult = answers.length > 0 ? calculateDiscResult(answers) : null;

  // Handle quiz complete
  const handleQuizComplete = (completedAnswers: DiscLetter[]) => {
    setAnswers(completedAnswers);
    setQuizActive(false);
    setActiveTab('result');

    // Auto-save to history
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
    // Approximate answers from record percentages
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
    <div className="min-h-screen bg-[#0c0a17] text-slate-100 flex flex-col font-sans bg-tech-grid relative">
      {/* Top Navigation */}
      <Header
        activeTab={activeTab}
        onSelectTab={(tab) => {
          if (tab === 'test' && answers.length > 0 && !quizActive) {
            // Keep on current or ask
            setQuizActive(true);
          }
          setActiveTab(tab);
        }}
        hasResult={answers.length > 0}
        historyCount={history.length}
      />

      {/* Shared Profile Notification Banner */}
      {sharedBanner && (
        <div className="bg-gradient-to-r from-purple-950/90 via-indigo-950/80 to-slate-900 border-b border-purple-500/30 px-4 py-3 text-xs flex flex-wrap items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2.5 text-slate-200">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse" />
            <span>
              Você está visualizando o perfil compartilhado de{' '}
              <strong className="text-white font-semibold">{sharedBanner.name}</strong>{' '}
              (Perfil Dominante: <span className="font-mono text-purple-300 font-bold">{sharedBanner.dominant} — {PROFILES[sharedBanner.dominant]?.title}</span>).
            </span>
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
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-sm transition cursor-pointer"
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
              className="text-slate-400 hover:text-white px-2 py-1 text-xs transition cursor-pointer"
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
              <div className="w-full max-w-5xl mx-auto px-4 py-12 space-y-12 animate-fadeIn">
                {/* Hero section */}
                <div className="text-center space-y-6 max-w-3xl mx-auto">
                  <div className="inline-flex items-center gap-2 text-slate-300 text-xs font-mono">
                    <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Avaliação Comportamental para Carreiras em TI</span>
                  </div>

                  <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight text-balance">
                    Descubra seu perfil DISC para o{' '}
                    <span className="text-indigo-400">
                      mercado tech
                    </span>
                  </h1>

                  <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                    20 perguntas de escolha forçada para quem já atua na área ou está começando do zero. Em 3 minutos você descobre seu perfil comportamental e quais caminhos em tecnologia mais combinam com você.
                  </p>

                  {/* Name & Moment Selection Box */}
                  <div className="mx-auto max-w-lg bg-slate-900 border border-slate-800 p-5 sm:p-6 rounded-2xl shadow-lg space-y-4 text-left">
                    <div>
                      <label htmlFor="name-input" className="block text-xs font-mono uppercase text-slate-300 font-semibold mb-1.5">
                        Como prefere ser chamado(a)?
                      </label>
                      <input
                        id="name-input"
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Ex: Lucas, Camila, Rafael..."
                        maxLength={60}
                        className="w-full px-4 py-3 text-sm rounded-xl border border-slate-700 bg-slate-950 text-white placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
                      />
                    </div>

                    {/* Quiz Mode Selector */}
                    <div className="space-y-2">
                      <span className="block text-xs font-semibold text-slate-300">
                        Qual é o seu momento atual?
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <button
                          type="button"
                          onClick={() => setQuizMode('beginner')}
                          className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                            quizMode === 'beginner'
                              ? 'bg-indigo-600/20 border-indigo-500 text-white'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                          }`}
                        >
                          <div className="text-xs font-semibold">Iniciante ou em Transição</div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            Linguagem simples, sem siglas técnicas
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => setQuizMode('standard')}
                          className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                            quizMode === 'standard'
                              ? 'bg-indigo-600/20 border-indigo-500 text-white'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                          }`}
                        >
                          <div className="text-xs font-semibold">Já atuo em Tecnologia</div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            Cenários de squad, PRs e produção
                          </div>
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => handleStartQuiz(quizMode)}
                      className="w-full py-3.5 px-6 rounded-xl font-semibold text-sm tracking-wide bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-500/40 shadow-sm transition duration-150 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Iniciar Análise Comportamental</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2 text-xs">
                      <span className="text-slate-400">Ainda não sabe qual área de TI escolher?</span>
                      <button
                        type="button"
                        onClick={() => setActiveTab('transition')}
                        className="inline-flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 font-semibold transition cursor-pointer whitespace-nowrap shrink-0"
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
                        className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between"
                      >
                        <div>
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-xl mb-3 border shadow-sm"
                            style={{
                              backgroundColor: `${p.color}15`,
                              color: p.color,
                              borderColor: `${p.color}40`,
                            }}
                          >
                            {letter}
                          </div>
                          <h3 className="font-bold text-white text-base">{p.title}</h3>
                          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                            {p.tagline}
                          </p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono" style={{ color: p.color }}>
                          {letter === 'D' && 'Dominância • Execução & Decisão'}
                          {letter === 'I' && 'Influência • Pessoas & Articulação'}
                          {letter === 'S' && 'Estabilidade • Resiliência & Ritmo'}
                          {letter === 'C' && 'Conformidade • Rigor & Arquitetura'}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Feature Highlights Grid */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8">
                  <h3 className="text-xs font-mono uppercase text-slate-400 tracking-wider font-semibold mb-4">
                    O que você recebe ao concluir o teste
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-slate-300">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center shrink-0">
                        <Zap className="w-4 h-4" />
                      </div>
                      <div>
                        <strong className="text-white block text-sm mb-0.5">Superpoderes & Bugs</strong>
                        Diagnóstico com metáforas de engenharia: memory leaks, deadlocks e scripts de hotfix para aplicar hoje.
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center shrink-0">
                        <Users className="w-4 h-4" />
                      </div>
                      <div>
                        <strong className="text-white block text-sm mb-0.5">Simulador de Squad</strong>
                        Teste como o seu perfil interage com Tech Leads, POs, SREs e arquitetos para evitar gargalos na equipe.
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
                        <BrainCircuit className="w-4 h-4" />
                      </div>
                      <div>
                        <strong className="text-white block text-sm mb-0.5">Co-Pilot & PDI com IA</strong>
                        Gere um Plano de Desenvolvimento Individual (PDI) 30-60-90 dias personalizado pelo Gemini AI.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Attribution Banner */}
                <div className="text-center text-xs text-slate-500 space-y-1">
                  <div>DISC Tech 2.0 • Perfil Comportamental para TI</div>
                  <div>Metodologia analítica adaptada aos ritos e dinâmicas do ecossistema de software.</div>
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

        {/* TAB: CAREERS EXPLORER (reordered before squad) */}
        {activeTab === 'careers' && (
          <CareerExplorer
            userPct={currentResult?.pct || null}
            userName={userName}
            onSelectCareerForCoach={handleSelectCareerForCoach}
          />
        )}

        {/* TAB: SQUAD SIMULATOR (reordered after careers) */}
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
