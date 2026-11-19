import React, { useMemo, useState } from 'react';
import {
  Compass,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertCircle,
  BrainCircuit,
  RotateCcw,
  BookOpen,
  Layers,
  Code2,
  Database,
  Users,
  ExternalLink,
  ArrowUpRight,
  Clock,
} from 'lucide-react';
import { ROADMAP_SH_DESIGN_HUB_URL } from '../data/roadmapData';
import { DiscLetter, DiscPercentages, EntryTechArea } from '../types/disc';
import { PREVIOUS_BACKGROUNDS, ENTRY_TECH_AREAS } from '../data/transitionData';
import { PROFILES } from '../data/discData';

interface TransitionExplorerProps {
  userPct?: DiscPercentages | null;
  userName?: string;
  selectedBgId?: string;
  onSelectBgId?: (id: string) => void;
  onStartBeginnerQuiz: () => void;
  onSelectCareerForCoach?: (careerTitle: string) => void;
}

type FocusChoice = 'visual' | 'data' | 'logic' | 'people' | null;
type CodeComfort = 'no-code' | 'low-code' | 'code' | null;
type CodeFilter = 'all' | 'no-code' | 'low-code' | 'code';

export const TransitionExplorer: React.FC<TransitionExplorerProps> = ({
  userPct,
  userName,
  selectedBgId: controlledBgId,
  onSelectBgId,
  onStartBeginnerQuiz,
  onSelectCareerForCoach,
}) => {
  const [internalBgId, setInternalBgId] = useState<string>('first-job');
  const selectedBgId = controlledBgId ?? internalBgId;
  const setSelectedBgId = (id: string) => {
    setInternalBgId(id);
    onSelectBgId?.(id);
  };
  const [preferredFocus, setPreferredFocus] = useState<FocusChoice>(null);
  const [codeComfort, setCodeComfort] = useState<CodeComfort>(null);
  const [problemStyle, setProblemStyle] = useState<FocusChoice>(null);
  const [codeFilter, setCodeFilter] = useState<CodeFilter>('all');
  const [expandedAreaId, setExpandedAreaId] = useState<string | null>('data-analytics');

  const selectedBg = useMemo(
    () => PREVIOUS_BACKGROUNDS.find((b) => b.id === selectedBgId) || PREVIOUS_BACKGROUNDS[0],
    [selectedBgId]
  );

  const dominantLetter = useMemo<DiscLetter | null>(() => {
    if (!userPct) return null;
    return (['D', 'I', 'S', 'C'] as DiscLetter[]).reduce((a, b) =>
      userPct[a] >= userPct[b] ? a : b
    );
  }, [userPct]);

  const rankedAreas = useMemo(() => {
    const scored = ENTRY_TECH_AREAS.map((area) => {
      let score = 60;
      const reasons: string[] = [];

      if (userPct) {
        const dDiff = Math.abs(userPct.D - area.weights.D * 100);
        const iDiff = Math.abs(userPct.I - area.weights.I * 100);
        const sDiff = Math.abs(userPct.S - area.weights.S * 100);
        const cDiff = Math.abs(userPct.C - area.weights.C * 100);
        const totalDiff = dDiff + iDiff + sDiff + cDiff;
        const discScore = Math.max(45, Math.min(96, Math.round(100 - totalDiff * 0.42)));
        score = Math.round(discScore * 0.6 + 22);
        if (dominantLetter && (area.primaryDisc === dominantLetter || area.secondaryDisc === dominantLetter)) {
          reasons.push(`Alinhada ao seu perfil ${dominantLetter}`);
        }
      }

      if (selectedBg.recommendedAreaIds.includes(area.id)) {
        score += 14;
        reasons.push('Aproveita sua experiência anterior');
      }

      if (preferredFocus) {
        if (area.affinityFocus === preferredFocus) {
          score += 12;
          reasons.push('Combina com sua preferência de rotina');
        } else {
          score -= 4;
        }
      }

      if (problemStyle) {
        if (area.affinityFocus === problemStyle) {
          score += 8;
        }
      }

      if (codeComfort) {
        if (area.codeLevel === codeComfort) {
          score += 12;
          reasons.push(`Nível de código compatível (${area.codeLevelLabel})`);
        } else if (codeComfort === 'no-code' && area.codeLevel === 'code') {
          score -= 14;
        } else if (codeComfort === 'code' && area.codeLevel === 'no-code') {
          score -= 6;
        }
      }

      const finalScore = Math.max(42, Math.min(99, score));
      return {
        ...area,
        matchScore: finalScore,
        matchReasons: reasons,
      };
    });

    return scored
      .filter((a) => codeFilter === 'all' || a.codeLevel === codeFilter)
      .sort((a, b) => b.matchScore - a.matchScore);
  }, [userPct, dominantLetter, selectedBg, preferredFocus, problemStyle, codeComfort, codeFilter]);

  const handleResetTriage = () => {
    setPreferredFocus(null);
    setCodeComfort(null);
    setProblemStyle(null);
    setCodeFilter('all');
  };

  const hasTriageInput = Boolean(preferredFocus || codeComfort || problemStyle);

  const getCodeIcon = (level: EntryTechArea['codeLevel']) => {
    if (level === 'code') return <Code2 className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />;
    if (level === 'low-code') return <Database className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />;
    return <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />;
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Intro Banner */}
      <div className="bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                Explorar Áreas de TI
              </span>
              <span aria-hidden="true">·</span>
              <span>Iniciantes e Transição de Carreira</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white tracking-tight text-balance">
              Pesquise e compare portas de entrada em tecnologia
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Você não precisa saber programar para descobrir seu espaço na tecnologia. Escolha de onde você vem, ajuste 3 preferências simples e compare as áreas de entrada — com plano de 30 dias, evolução na carreira e trilhas no{' '}
              <a
                href={ROADMAP_SH_DESIGN_HUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
              >
                roadmap.sh
                <ExternalLink className="w-3 h-3" />
              </a>
              .
            </p>
          </div>

          {/* User DISC Status Box */}
          <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shrink-0 lg:w-80 space-y-3">
            {userPct && dominantLetter ? (
              <>
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>Perfil DISC conectado</span>
                  <span className="font-mono tabular-nums text-emerald-700 dark:text-emerald-400 font-semibold">
                    Ativo
                  </span>
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    {userName ? `${userName} · ` : ''}
                    {PROFILES[dominantLetter].title} ({dominantLetter})
                  </div>
                  <div className="text-xs font-mono tabular-nums text-slate-600 dark:text-slate-400 mt-1">
                    D:{userPct.D}% · I:{userPct.I}% · S:{userPct.S}% · C:{userPct.C}%
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onStartBeginnerQuiz}
                  className="w-full py-2 px-3 rounded-lg text-xs font-medium bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 transition cursor-pointer whitespace-nowrap"
                >
                  Refazer Avaliação DISC
                </button>
              </>
            ) : (
              <>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Teste DISC comportamental opcional
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  Quer recomendações ainda mais precisas? Faça o teste de 20 situações do dia a dia sem siglas técnicas.
                </p>
                <button
                  type="button"
                  onClick={onStartBeginnerQuiz}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 dark:hover:bg-indigo-500 text-white border border-indigo-600/30 transition flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                >
                  <Compass className="w-3.5 h-3.5" />
                  Fazer Avaliação DISC
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Step 1 & Step 2 Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Step 1: Previous Background */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-5 shadow-2xs">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              01. Qual é o seu ponto de partida hoje?
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Selecione sua experiência atual para traduzirmos o que você já sabe para o mercado de TI.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5" role="group" aria-label="Selecionar experiência anterior">
            {PREVIOUS_BACKGROUNDS.map((bg) => {
              const active = bg.id === selectedBgId;
              return (
                <button
                  key={bg.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setSelectedBgId(bg.id)}
                  className={`text-left p-3.5 rounded-xl border transition cursor-pointer ${
                    active
                      ? 'bg-indigo-50/70 dark:bg-indigo-600/15 border-indigo-500 text-slate-900 dark:text-white'
                      : 'bg-slate-50/60 dark:bg-slate-950 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-950 dark:hover:text-white'
                  }`}
                >
                  <div className="text-xs font-semibold leading-snug">{bg.label}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                    {bg.examples}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Transferable Skills Display */}
          <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 space-y-3">
            <div className="text-xs font-semibold text-slate-900 dark:text-slate-200">
              Vantagens que você já traz nessa transição:
            </div>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
              {selectedBg.transferableSkills.map((skill, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>{skill}</span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-indigo-700 dark:text-indigo-300 pt-2 border-t border-slate-200/80 dark:border-slate-800/70 leading-relaxed">
              <strong className="font-semibold">Dica prática:</strong> {selectedBg.transitionTip}
            </p>
          </div>
        </div>

        {/* Step 2: Quick 3-Question Discovery Triage */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-5 shadow-2xs">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                02. Triagem rápida de afinidade
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Ajuste as preferências abaixo para recalcular as áreas recomendadas em tempo real.
              </p>
            </div>
            {hasTriageInput && (
              <button
                type="button"
                onClick={handleResetTriage}
                className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer whitespace-nowrap shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Limpar
              </button>
            )}
          </div>

          {/* Q1 */}
          <div className="space-y-2">
            <span className="block text-xs font-semibold text-slate-800 dark:text-slate-200">
              Com o que você prefere lidar na maior parte do dia?
            </span>
            <div className="grid grid-cols-2 gap-2" role="group" aria-label="Com o que você prefere lidar na maior parte do dia?">
              {[
                { id: 'visual', label: 'Telas, visual e experiência' },
                { id: 'data', label: 'Números, planilhas e padrões' },
                { id: 'logic', label: 'Lógica, regras e testar falhas' },
                { id: 'people', label: 'Pessoas, negócios e organização' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  aria-pressed={preferredFocus === opt.id}
                  onClick={() => setPreferredFocus(preferredFocus === opt.id ? null : (opt.id as FocusChoice))}
                  className={`p-2.5 rounded-xl border text-left text-xs font-medium transition cursor-pointer ${
                    preferredFocus === opt.id
                      ? 'bg-indigo-50 dark:bg-indigo-600/20 border-indigo-500 text-indigo-900 dark:text-white'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Q2 */}
          <div className="space-y-2">
            <span className="block text-xs font-semibold text-slate-800 dark:text-slate-200">
              Qual a sua vontade em relação a programar código?
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2" role="group" aria-label="Qual a sua vontade em relação a programar código?">
              {[
                { id: 'no-code', label: 'Prefiro pouco ou nenhum código' },
                { id: 'low-code', label: 'Topo lógica simples e consultas' },
                { id: 'code', label: 'Quero programar código todo dia' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  aria-pressed={codeComfort === opt.id}
                  onClick={() => setCodeComfort(codeComfort === opt.id ? null : (opt.id as CodeComfort))}
                  className={`p-2.5 rounded-xl border text-left text-xs font-medium transition cursor-pointer ${
                    codeComfort === opt.id
                      ? 'bg-indigo-50 dark:bg-indigo-600/20 border-indigo-500 text-indigo-900 dark:text-white'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Q3 */}
          <div className="space-y-2">
            <span className="block text-xs font-semibold text-slate-800 dark:text-slate-200">
              O que te dá mais satisfação ao concluir uma tarefa?
            </span>
            <div className="grid grid-cols-2 gap-2" role="group" aria-label="O que te dá mais satisfação ao concluir uma tarefa?">
              {[
                { id: 'visual', label: 'Ver algo bonito funcionando na tela' },
                { id: 'logic', label: 'Descobrir um erro antes do usuário' },
                { id: 'data', label: 'Encontrar uma resposta nos dados' },
                { id: 'people', label: 'Destravar alguém ou organizar o time' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  aria-pressed={problemStyle === opt.id}
                  onClick={() => setProblemStyle(problemStyle === opt.id ? null : (opt.id as FocusChoice))}
                  className={`p-2.5 rounded-xl border text-left text-xs font-medium transition cursor-pointer ${
                    problemStyle === opt.id
                      ? 'bg-indigo-50 dark:bg-indigo-600/20 border-indigo-500 text-indigo-900 dark:text-white'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Step 3: Personalized Entry Areas */}
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              03. Carreiras Tech Recomendadas para Você
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Portas de entrada ordenadas pela sua bagagem anterior{userPct ? ', seu perfil DISC' : ''} e suas preferências acima · Faixas iniciais referenciais CLT Brasil.
            </p>
          </div>

          {/* Filter by Code Requirement */}
          <div
            role="group"
            aria-label="Filtrar áreas por nível de programação"
            className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-x-auto"
          >
            {[
              { id: 'all', label: 'Todas' },
              { id: 'no-code', label: 'Sem código' },
              { id: 'low-code', label: 'Lógica e Dados' },
              { id: 'code', label: 'Programação' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                aria-pressed={codeFilter === tab.id}
                onClick={() => setCodeFilter(tab.id as CodeFilter)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap shrink-0 cursor-pointer ${
                  codeFilter === tab.id
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Areas List */}
        {rankedAreas.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-8 text-center space-y-3">
            <p className="text-sm text-slate-700 dark:text-slate-300">
              Nenhuma área encontrada para este filtro específico.
            </p>
            <button
              type="button"
              onClick={() => setCodeFilter('all')}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition cursor-pointer"
            >
              Mostrar todas as áreas
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {rankedAreas.map((area, index) => {
              const isExpanded = expandedAreaId === area.id;

              return (
                <div
                  key={area.id}
                  className={`bg-white dark:bg-slate-900/90 border rounded-2xl transition-colors shadow-2xs ${
                    isExpanded
                      ? 'border-indigo-500/70'
                      : 'border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <span className="font-mono tabular-nums text-slate-700 dark:text-slate-300 font-semibold">
                            0{index + 1}.
                          </span>
                          <span>{area.entryCurve}</span>
                          <span aria-hidden="true">·</span>
                          <span>{area.codeLevelLabel}</span>
                          <span aria-hidden="true">·</span>
                          <span className="inline-flex items-center gap-1">
                            <Clock className="w-3 h-3" aria-hidden="true" />
                            1º projeto em {area.timeToFirstProject}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono tabular-nums text-emerald-700 dark:text-emerald-400 font-medium">
                            Inicial: {area.salaryEntryRange}
                          </span>
                        </div>

                        <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2.5">
                          {getCodeIcon(area.codeLevel)}
                          <span>{area.title}</span>
                        </h3>

                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
                          {area.summary}
                        </p>

                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed flex items-start gap-1.5">
                          <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
                          <span>
                            <strong className="font-semibold text-slate-800 dark:text-slate-200">Evolução na carreira:</strong>{' '}
                            {area.careerProgression}
                          </span>
                        </p>

                        {area.matchReasons.length > 0 && (
                          <div className="text-xs text-indigo-700 dark:text-indigo-300 pt-1 font-medium">
                            Por que aparece no topo: {area.matchReasons.join(' · ')}
                          </div>
                        )}
                      </div>

                      <div className="flex md:flex-col items-center md:items-end justify-between gap-3 shrink-0">
                        <div className="text-right">
                          <div className="text-xs text-slate-500 dark:text-slate-400">Afinidade estimada</div>
                          <div className="text-2xl font-semibold font-mono tabular-nums text-slate-900 dark:text-white">
                            {area.matchScore}%
                          </div>
                        </div>

                        <button
                          type="button"
                          aria-expanded={isExpanded}
                          onClick={() => setExpandedAreaId(isExpanded ? null : area.id)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition cursor-pointer whitespace-nowrap shrink-0"
                        >
                          {isExpanded ? (
                            <>
                              Ocultar roteiro
                              <ChevronUp className="w-3.5 h-3.5" />
                            </>
                          ) : (
                            <>
                              Ver roteiro 30 dias e 1º projeto
                              <ChevronDown className="w-3.5 h-3.5" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="px-6 pb-6 pt-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 rounded-b-2xl space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 space-y-4">
                          <div>
                            <div className="text-xs font-semibold text-slate-900 dark:text-slate-200 mb-1.5 flex items-center gap-1.5">
                              <Layers className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                              O que você faz na prática no dia a dia
                            </div>
                            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                              {area.dayToDay}
                            </p>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                            <div className="space-y-2">
                              <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                                Você vai se identificar se:
                              </div>
                              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                                {area.likeIf.map((item, i) => (
                                  <li key={i} className="flex items-start gap-2">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="space-y-2">
                              <div className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                                Fique atento se:
                              </div>
                              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                                {area.avoidIf.map((item, i) => (
                                  <li key={i} className="flex items-start gap-2">
                                    <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 pt-4 md:pt-0 md:pl-6">
                          <div>
                            <div className="text-xs font-semibold text-slate-900 dark:text-slate-200 mb-1.5">
                              Nomes das vagas para buscar
                            </div>
                            <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                              {area.entryRoles.map((role, rIdx) => (
                                <li key={rIdx}>· {role}</li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <div className="text-xs font-semibold text-slate-900 dark:text-slate-200 mb-1.5">
                              Ferramentas gratuitas para testar
                            </div>
                            <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                              {area.freeTools.join(' · ')}
                            </div>
                          </div>

                          <div>
                            <div className="text-xs font-semibold text-slate-900 dark:text-slate-200 mb-1">
                              Perfil DISC típico na área
                            </div>
                            <div className="text-xs font-mono tabular-nums text-slate-600 dark:text-slate-400">
                              D:{Math.round(area.weights.D * 100)}% · I:{Math.round(area.weights.I * 100)}% · S:{Math.round(area.weights.S * 100)}% · C:{Math.round(area.weights.C * 100)}%
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 30-Day Step-by-Step Roadmap */}
                      <div className="pt-5 border-t border-slate-200 dark:border-slate-800 space-y-3">
                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-900 dark:text-white">
                          <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                          Plano prático dos seus primeiros 30 dias (passo a passo)
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                          {area.first30Days.map((step, sIdx) => (
                            <div
                              key={sIdx}
                              className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5"
                            >
                              <div className="text-xs font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                                {step.week}
                              </div>
                              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                                {step.focus}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Starter Portfolio Project & CTA */}
                      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1 max-w-2xl">
                          <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                            Seu 1º Projeto de Portfólio Sugerido:
                          </div>
                          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                            {area.starterProject}
                          </p>
                          {area.roadmapUrl && (
                            <div className="pt-1">
                              <a
                                href={area.roadmapUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300 hover:text-indigo-900 dark:hover:text-white underline underline-offset-2 transition"
                              >
                                <span>{area.roadmapLabel || 'Abrir trilha oficial no roadmap.sh'}</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          )}
                        </div>

                        {onSelectCareerForCoach && (
                          <button
                            type="button"
                            onClick={() =>
                              onSelectCareerForCoach(`${area.title} (Iniciante / Transição de ${selectedBg.label})`)
                            }
                            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition cursor-pointer whitespace-nowrap shrink-0"
                          >
                            <BrainCircuit className="w-4 h-4" />
                            Gerar Plano de 90 Dias
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
