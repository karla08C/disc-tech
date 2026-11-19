import React, { useEffect, useState, Suspense, lazy } from 'react';
import { DiscLetter, DiscPercentages } from '../types/disc';
import { PROFILES, DUAL_PROFILES } from '../data/discData';
import { ENTRY_TECH_AREAS, PREVIOUS_BACKGROUNDS } from '../data/transitionData';
import { RadarChart } from './RadarChart';
import { TransitionToolkit } from './TransitionToolkit';

const SocialShareModal = lazy(() =>
  import('./SocialShareModal').then((m) => ({ default: m.SocialShareModal }))
);
import {
  Download,
  Share2,
  Activity,
  Award,
  AlertCircle,
  SlidersHorizontal,
  CheckCircle2,
  Briefcase,
  RotateCcw,
  TrendingUp,
  BrainCircuit,
  Map,
  ChevronDown,
  ChevronUp,
  BookOpen,
  ExternalLink,
  Route,
  ArrowUpRight,
  Clock
} from 'lucide-react';
import { RoadmapSection } from './RoadmapSection';

interface ResultReportProps {
  name: string;
  dominant: DiscLetter;
  secondary: DiscLetter;
  dualCode: string;
  pct: DiscPercentages;
  selectedBgId?: string;
  onSelectBgId?: (id: string) => void;
  onRestart: () => void;
  onOpenAiCoach: () => void;
  onOpenTransitionGuide?: () => void;
}

export const ResultReport: React.FC<ResultReportProps> = ({
  name,
  dominant,
  secondary,
  dualCode,
  pct,
  selectedBgId: controlledBgId,
  onSelectBgId,
  onRestart,
  onOpenAiCoach,
  onOpenTransitionGuide,
}) => {
  const [printNotice, setPrintNotice] = useState<string | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [internalBgId, setInternalBgId] = useState<string>('first-job');
  const activeBgId = controlledBgId ?? internalBgId;
  const setActiveBgId = (id: string) => {
    setInternalBgId(id);
    onSelectBgId?.(id);
  };
  const selectedBg =
    PREVIOUS_BACKGROUNDS.find((b) => b.id === activeBgId) || PREVIOUS_BACKGROUNDS[0];

  const [expandedCareerId, setExpandedCareerId] = useState<string | null>(null);
  const [selectedRoadmapAreaId, setSelectedRoadmapAreaId] = useState<string | null>(null);

  const profile = PROFILES[dominant];
  const secondaryProfile = PROFILES[secondary];
  const dual = DUAL_PROFILES[dualCode] || DUAL_PROFILES[`${dominant}${secondary}`];
  const entryMatches = [...ENTRY_TECH_AREAS]
    .map((entry) => {
      const diff =
        Math.abs(pct.D - entry.weights.D * 100) +
        Math.abs(pct.I - entry.weights.I * 100) +
        Math.abs(pct.S - entry.weights.S * 100) +
        Math.abs(pct.C - entry.weights.C * 100);
      const baseScore = Math.max(55, Math.min(94, Math.round(100 - diff * 0.42)));
      const matchesBg = selectedBg.recommendedAreaIds.includes(entry.id);
      const matchScore = Math.min(98, baseScore + (matchesBg ? 7 : 0));
      return { ...entry, matchScore, matchesBg };
    })
    .sort((a, b) => b.matchScore - a.matchScore);

  const top3EntryAreas = entryMatches.slice(0, 3);

  const activeResultAreas = top3EntryAreas.map((e) => ({
    id: e.id,
    title: e.title,
    matchScore: e.matchScore,
    roadmapUrl: e.roadmapUrl,
  }));

  const handleJumpToRoadmap = (areaId: string) => {
    setSelectedRoadmapAreaId(areaId);
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setTimeout(() => {
      document
        .getElementById('result-roadmap')
        ?.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
    }, 40);
  };

  const buildPdfFileTitle = () => {
    const safeName =
      (name || 'resultado')
        .trim()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9_-]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'resultado';
    return `DISC-Tech-${dominant}-${safeName}`;
  };

  useEffect(() => {
    let originalTitle: string | null = null;
    const handleBeforePrint = () => {
      originalTitle = document.title;
      document.title = buildPdfFileTitle();
    };
    const handleAfterPrint = () => {
      if (originalTitle !== null) {
        document.title = originalTitle;
        originalTitle = null;
      }
    };
    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('afterprint', handleAfterPrint);
    return () => {
      if (originalTitle !== null) {
        document.title = originalTitle;
      }
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('afterprint', handleAfterPrint);
    };
  }, [dominant, name]);

  const handleDownloadReport = () => {
    const previousTitle = document.title;
    document.title = buildPdfFileTitle();
    setPrintNotice(
      'Na janela de impressão, selecione "Salvar como PDF" no campo Destino para baixar o relatório em A4.'
    );

    const restoreTitle = () => {
      document.title = previousTitle;
      window.removeEventListener('afterprint', restoreTitle);
    };
    window.addEventListener('afterprint', restoreTitle);

    window.print();

    window.setTimeout(() => {
      setPrintNotice(null);
    }, 8000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Top Action Bar */}
      <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-xs no-print">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onRestart}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            Refazer Teste
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleDownloadReport}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white border border-indigo-600/30 shadow-2xs transition cursor-pointer whitespace-nowrap"
            title="Exportar relatório formatado em PDF (A4)"
            aria-label="Baixar Relatório em PDF"
          >
            <Download className="w-3.5 h-3.5" aria-hidden="true" />
            Baixar Relatório
          </button>

          <button
            type="button"
            onClick={() => setIsShareModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 dark:bg-indigo-500/20 hover:bg-slate-800 dark:hover:bg-indigo-500/30 text-white dark:text-indigo-200 border border-slate-900 dark:border-indigo-500/40 transition cursor-pointer whitespace-nowrap"
          >
            <Share2 className="w-3.5 h-3.5" aria-hidden="true" />
            Compartilhar
          </button>

          <button
            type="button"
            onClick={onOpenAiCoach}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white border border-slate-200 dark:border-slate-700/60 transition cursor-pointer whitespace-nowrap"
          >
            <BrainCircuit className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
            Plano de 90 Dias
          </button>
        </div>
      </div>

      {/* Inline PDF Export Hint */}
      <div aria-live="polite" className="no-print">
        {printNotice && (
          <div className="bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-500/30 rounded-xl px-4 py-2.5 flex items-center justify-between gap-3 text-xs text-indigo-900 dark:text-indigo-200">
            <span>{printNotice}</span>
            <button
              type="button"
              onClick={() => setPrintNotice(null)}
              className="text-indigo-700 dark:text-indigo-300 hover:underline font-medium shrink-0 cursor-pointer"
            >
              Fechar
            </button>
          </div>
        )}
      </div>

      {/* Printable Report Container */}
      <article aria-label="Relatório comportamental DISC Tech" className="space-y-8 relative">
        {/* Print-Only Clean Executive Header */}
        <div className="print-only mb-6 pb-4 border-b border-slate-300">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] font-mono text-indigo-800 font-bold tracking-wider">
                Relatório de Análise de Perfil Comportamental
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mt-0.5">
                DISC Tech 2.0 · {profile.title} ({dominant})
              </h1>
              <p className="text-xs text-slate-600 mt-0.5">
                Mapeamento comportamental para iniciantes e transição de carreira em tecnologia
              </p>
            </div>
            <div className="text-right text-xs text-slate-700 space-y-0.5 tabular-nums">
              <div>
                Profissional: <strong className="text-slate-900">{name || 'Profissional Tech'}</strong>
              </div>
              <div>
                Data de Emissão: <strong>{new Date().toLocaleDateString('pt-BR')}</strong>
              </div>
              <div className="font-mono text-[11px] text-slate-600">
                Score: D:{pct.D}% | I:{pct.I}% | S:{pct.S}% | C:{pct.C}%
              </div>
            </div>
          </div>
        </div>

        {/* 1. Resumo do Perfil */}
        <div className="print-card relative bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 sm:p-8 overflow-hidden shadow-2xs">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-mono font-semibold" style={{ color: profile.color }}>
                  Perfil Dominante {dominant}
                </span>

                {dual && (
                  <>
                    <span className="text-slate-300 dark:text-slate-600" aria-hidden="true">·</span>
                    <span className="font-mono font-medium text-slate-600 dark:text-slate-300">
                      Combinação {dual.code} ({dual.subtitle})
                    </span>
                  </>
                )}

                <span className="text-slate-300 dark:text-slate-600" aria-hidden="true">·</span>
                <span className="text-slate-500 dark:text-slate-400">
                  Avaliação de:{' '}
                  <strong className="font-semibold text-slate-900 dark:text-white">
                    {name || 'Profissional Tech'}
                  </strong>
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-semibold text-slate-900 dark:text-white tracking-tight">
                {profile.title}
              </h1>

              <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 font-normal max-w-2xl leading-relaxed">
                "{profile.tagline}"
              </p>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
                {profile.summary}
              </p>
            </div>

            {/* Dominant Letter Badge */}
            <div className="shrink-0 flex flex-col items-center justify-center p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800">
              <div
                className="w-20 h-20 rounded-xl flex items-center justify-center font-mono font-semibold text-5xl border"
                style={{
                  backgroundColor: `${profile.color}12`,
                  color: profile.color,
                  borderColor: `${profile.color}35`,
                }}
              >
                {dominant}
              </div>
              <div className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-2.5 tabular-nums">
                Score Principal:{' '}
                <strong className="font-semibold text-slate-900 dark:text-white">{pct[dominant]}%</strong>
              </div>
            </div>
          </div>

          {/* Dual Blend Sub-Card */}
          {dual && (
            <div className="mt-7 pt-5 border-t border-slate-200/80 dark:border-slate-800/80 bg-indigo-50/40 dark:bg-indigo-950/20 -mx-6 sm:-mx-8 -mb-6 sm:-mb-8 p-6 sm:px-8 sm:py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-mono text-indigo-700 dark:text-indigo-300 font-medium">
                  Combinação Secundária · Traço {secondary} ({secondaryProfile.title})
                </div>
                <div className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white mt-0.5">
                  {dual.title}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  {dual.description}
                </p>
              </div>
              <div className="text-xs text-indigo-950 dark:text-indigo-200 bg-white dark:bg-indigo-900/40 border border-indigo-200/80 dark:border-indigo-500/30 px-3.5 py-2.5 rounded-xl shrink-0 max-w-xs leading-relaxed">
                <strong className="font-semibold text-indigo-700 dark:text-white">Diferencial:</strong> {dual.naturalStrength}
              </div>
            </div>
          )}
        </div>

        {/* 2. Mapeamento Comportamental (Radar & Distribuição) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Radar Chart Column */}
          <div className="print-card lg:col-span-6 bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center shadow-2xs">
            <div className="w-full flex items-center justify-between gap-2 mb-1.5">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Gráfico de Radar DISC
              </h3>
            </div>
            <p className="w-full text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
              Equilíbrio visual das suas quatro energias comportamentais no ambiente de trabalho.
            </p>

            <RadarChart pct={pct} size={340} />
          </div>

          {/* Breakdown Bars & Details */}
          <div className="lg:col-span-6 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Distribuição dos Fatores DISC
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
                D:{pct.D}% · I:{pct.I}% · S:{pct.S}% · C:{pct.C}%
              </span>
            </div>

            {(['D', 'I', 'S', 'C'] as DiscLetter[]).map((letter) => {
              const p = PROFILES[letter];
              const score = pct[letter];
              const isDom = letter === dominant;

              return (
                <div
                  key={letter}
                  className={`print-card p-4 rounded-xl border transition-all ${
                    isDom
                      ? 'bg-white dark:bg-slate-900 border-indigo-300 dark:border-indigo-500/40 shadow-2xs'
                      : 'bg-white/80 dark:bg-slate-900/50 border-slate-200/80 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="w-6 h-6 rounded-md flex items-center justify-center font-mono font-semibold text-xs"
                        style={{ backgroundColor: `${p.color}15`, color: p.color }}
                      >
                        {letter}
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-white">{p.title}</span>
                      {isDom && (
                        <span className="text-[11px] font-medium text-indigo-600 dark:text-indigo-300">
                          · Dominante
                        </span>
                      )}
                    </div>

                    <div className="font-mono tabular-nums">
                      <span className="font-semibold text-base" style={{ color: p.color }}>
                        {score}%
                      </span>
                    </div>
                  </div>

                  {/* Factor Progress Bar */}
                  <div className="relative w-full h-2.5 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden border border-slate-200/80 dark:border-slate-800">
                    <div
                      className="h-full rounded-full transition-all duration-500 ease-out"
                      style={{
                        width: `${score}%`,
                        backgroundColor: p.color,
                      }}
                    />
                  </div>

                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                    {p.tagline}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Portas de Entrada Recomendadas para Você */}
        <div className="bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                Portas de Entrada Recomendadas para Você
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed max-w-2xl">
                Cruzamos a distribuição das suas energias (
                <span className="font-mono text-slate-900 dark:text-white font-semibold">
                  D:{pct.D}% · I:{pct.I}% · S:{pct.S}% · C:{pct.C}%
                </span>
                ) com sua experiência anterior para destacar as 3 áreas de entrada em TI com menor atrito e maior chance de sucesso.
              </p>
            </div>

            <span className="text-xs font-mono text-indigo-700 dark:text-indigo-300 shrink-0 font-semibold self-start lg:self-center">
              Top 3 para perfil {dominant}{secondary}
            </span>
          </div>

          {/* Transition Context Bar */}
          <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-xs font-semibold text-slate-900 dark:text-white">
                  Ponto de Partida na Transição: {selectedBg.label}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  {selectedBg.transitionTip}
                </p>
              </div>
              <select
                aria-label="Selecionar ponto de partida na transição"
                value={activeBgId}
                onChange={(e) => {
                  setActiveBgId(e.target.value);
                  setSelectedRoadmapAreaId(null);
                }}
                className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none cursor-pointer shrink-0 no-print"
              >
                {PREVIOUS_BACKGROUNDS.map((bg) => (
                  <option key={bg.id} value={bg.id}>
                    {bg.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-200/80 dark:border-slate-800/70">
              <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                O que você já traz:
              </span>
              <span>{selectedBg.transferableSkills.join(' · ')}</span>
            </div>
          </div>

          {/* Comparador lado a lado das Top 3 áreas recomendadas */}
          <div className="print-card space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Comparador rápido das suas Top 3 áreas
              </h3>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Faixas referenciais CLT Brasil (Estágio / Júnior)
              </span>
            </div>
            <div className="overflow-x-auto rounded-xl border border-slate-200/80 dark:border-slate-800">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/90 dark:bg-slate-950/80 border-b border-slate-200/80 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                    <th className="py-2.5 px-3.5">Área recomendada</th>
                    <th className="py-2.5 px-3.5 whitespace-nowrap">Exige código?</th>
                    <th className="py-2.5 px-3.5 whitespace-nowrap">1º projeto em</th>
                    <th className="py-2.5 px-3.5 whitespace-nowrap">Faixa inicial</th>
                    <th className="py-2.5 px-3.5">Rotina principal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800/80 bg-white dark:bg-slate-900/60">
                  {top3EntryAreas.map((entry, idx) => (
                    <tr
                      key={entry.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3 px-3.5 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                        <span className="font-mono text-indigo-600 dark:text-indigo-400 mr-1.5">
                          0{idx + 1}.
                        </span>
                        {entry.title}
                        <span className="ml-1.5 font-mono text-[11px] text-emerald-700 dark:text-emerald-400 tabular-nums">
                          ({entry.matchScore}%)
                        </span>
                      </td>
                      <td className="py-3 px-3.5 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                        {entry.codeLevelLabel}
                      </td>
                      <td className="py-3 px-3.5 text-slate-700 dark:text-slate-300 whitespace-nowrap font-mono tabular-nums">
                        {entry.timeToFirstProject}
                      </td>
                      <td className="py-3 px-3.5 text-emerald-700 dark:text-emerald-400 whitespace-nowrap font-mono tabular-nums font-medium">
                        {entry.salaryEntryRange}
                      </td>
                      <td className="py-3 px-3.5 text-slate-600 dark:text-slate-300 min-w-[200px]">
                        {entry.routineShort}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top 3 Entry Area Cards */}
          <div className="space-y-4">
            {top3EntryAreas.map((entry, idx) => {
              const isExpanded = expandedCareerId === entry.id;
              return (
                <div
                  key={entry.id}
                  className={`print-card p-5 rounded-xl bg-slate-50/40 dark:bg-slate-950/70 border transition-colors ${
                    isExpanded ? 'border-indigo-500 bg-white dark:bg-slate-950' : 'border-slate-200/80 dark:border-slate-800'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <span className="font-mono font-semibold text-indigo-700 dark:text-indigo-300 tabular-nums">
                          0{idx + 1}. Recomendação
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{entry.codeLevelLabel}</span>
                        <span aria-hidden="true">·</span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3 h-3" aria-hidden="true" />
                          1º projeto em {entry.timeToFirstProject}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono text-emerald-700 dark:text-emerald-400 tabular-nums font-medium">
                          Início: {entry.salaryEntryRange}
                        </span>
                        {entry.matchesBg && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="text-indigo-700 dark:text-indigo-300 font-medium">
                              Aproveita sua experiência anterior
                            </span>
                          </>
                        )}
                      </div>

                      <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white">
                        {entry.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        <strong className="font-semibold text-slate-900 dark:text-white">O que faz na prática:</strong>{' '}
                        {entry.summary}
                      </p>

                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        <strong className="font-semibold text-indigo-700 dark:text-indigo-300">Como é o seu dia:</strong>{' '}
                        {entry.dayToDay}
                      </p>

                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed flex items-start gap-1.5 pt-0.5">
                        <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
                        <span>
                          <strong className="font-semibold text-slate-800 dark:text-slate-200">Evolução na carreira:</strong>{' '}
                          {entry.careerProgression}
                        </span>
                      </p>
                    </div>

                    <div className="flex md:flex-col items-center md:items-end justify-between gap-3 shrink-0">
                      <div className="text-right">
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          Aderência ao DISC
                        </div>
                        <div className="text-xl font-semibold font-mono text-emerald-700 dark:text-emerald-400 tabular-nums">
                          {entry.matchScore}%
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 no-print">
                        <button
                          type="button"
                          aria-expanded={isExpanded}
                          onClick={() => setExpandedCareerId(isExpanded ? null : entry.id)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition cursor-pointer whitespace-nowrap"
                        >
                          {isExpanded ? (
                            <>
                              Ocultar plano inicial
                              <ChevronUp className="w-3.5 h-3.5" />
                            </>
                          ) : (
                            <>
                              Ver 1º passo e projeto
                              <ChevronDown className="w-3.5 h-3.5" />
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleJumpToRoadmap(entry.id)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-600/20 hover:bg-indigo-100 dark:hover:bg-indigo-600/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-500/40 transition cursor-pointer whitespace-nowrap"
                        >
                          <Route className="w-3.5 h-3.5" />
                          Ver roadmap
                        </button>
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-slate-200/80 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-2">
                        <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                          Por onde começar nos primeiros 30 dias:
                        </div>
                        <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
                          {entry.first30Days.map((step, sIdx) => (
                            <li key={sIdx} className="leading-relaxed">
                              <strong className="text-indigo-700 dark:text-indigo-300 font-mono">
                                {step.week}:
                              </strong>{' '}
                              {step.focus}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <div className="font-semibold text-emerald-700 dark:text-emerald-400 mb-1">
                            Você vai se identificar se:
                          </div>
                          <ul className="space-y-1 text-slate-600 dark:text-slate-300">
                            {entry.likeIf.map((item, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1">
                          <div className="font-semibold text-slate-900 dark:text-white">
                            1º Projeto para seu Portfólio:
                          </div>
                          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                            {entry.starterProject}
                          </p>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                            Ferramentas gratuitas: {entry.freeTools.join(' · ')}
                          </div>
                          {entry.roadmapUrl && (
                            <div className="pt-2">
                              <a
                                href={entry.roadmapUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300 hover:text-indigo-900 dark:hover:text-white underline underline-offset-2 transition"
                              >
                                <span>{entry.roadmapLabel || 'Abrir trilha no roadmap.sh'}</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Outras portas de entrada para explorar */}
          <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 space-y-3">
            <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Outras portas de entrada em TI (ordenadas por aderência ao seu perfil):
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
              {entryMatches.slice(3).map((area) => (
                <div
                  key={area.id}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 flex items-center justify-between gap-2"
                >
                  <span className="truncate">{area.title}</span>
                  <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400 tabular-nums shrink-0">
                    {area.matchScore}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {onOpenTransitionGuide && (
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
              <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                <strong className="text-slate-900 dark:text-white block mb-0.5">
                  Quer explorar todas as 8 áreas de entrada com filtros por nível de código?
                </strong>
                Use o explorador de áreas de TI para comparar rotinas, ferramentas gratuitas e planos de 30 dias.
              </div>
              <button
                type="button"
                onClick={onOpenTransitionGuide}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition cursor-pointer whitespace-nowrap shrink-0"
              >
                <Map className="w-4 h-4" />
                Explorar Áreas de TI
              </button>
            </div>
          )}
        </div>

        {/* 4. Trilha de Estudos & Roadmap Recomendado */}
        <RoadmapSection
          dominant={dominant}
          pct={pct}
          resultAreas={activeResultAreas}
          selectedAreaId={selectedRoadmapAreaId}
          onSelectAreaId={(id) => setSelectedRoadmapAreaId(id)}
        />

        {/* 5. Diagnóstico Comportamental: Pontos Fortes, Atenção & Evolução */}
        <div className="bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-7 shadow-2xs">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                Seu Perfil na Prática: Pontos Fortes e Ajustes
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                O que já joga a seu favor desde o primeiro dia e cuidados simples para acelerar sua entrada em TI
              </p>
            </div>
            <span className="text-xs font-mono text-indigo-700 dark:text-indigo-300 font-medium">
              Perfil {dominant} · Síntese Prática
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* Pontos Fortes */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Pontos Fortes na Prática</span>
              </div>
              <div className="space-y-2.5">
                {profile.superpowers.map((power, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 flex items-start gap-2.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                      {power}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pontos de Atenção & Ajustes Práticos */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                <SlidersHorizontal className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Pontos de Atenção & Ajustes Práticos</span>
              </div>
              <div className="space-y-3">
                {profile.debugs.map((debug, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800/80 space-y-2.5"
                  >
                    <div className="flex items-start gap-2 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                      <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                      <span>{debug.issue}</span>
                    </div>

                    <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-indigo-200/70 dark:border-indigo-500/30 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      {debug.fix}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Plano de Evolução Contínua */}
          <div className="pt-5 border-t border-slate-200/80 dark:border-slate-800 space-y-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Próximos Passos de Desenvolvimento (01–04)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Habilidades-chave para ganhar maturidade profissional mantendo sua autenticidade
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {profile.growthAreas.map((area, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 text-xs sm:text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2.5 leading-relaxed"
                >
                  <span className="text-indigo-600 dark:text-indigo-400 font-semibold font-mono shrink-0 tabular-nums">
                    0{idx + 1}.
                  </span>
                  <span>{area}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 6. Ferramentas Práticas de Transição (Currículo/LinkedIn, Checklist 1ª Vaga e Glossário) */}
        <TransitionToolkit
          name={name}
          dominant={dominant}
          selectedBg={selectedBg}
          topAreas={top3EntryAreas}
        />

        {/* 7. Share Banner */}
        <div className="bg-indigo-50/60 dark:bg-indigo-950/25 border border-indigo-200/80 dark:border-indigo-500/30 rounded-2xl p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-6 no-print">
          <div className="space-y-1.5 text-center sm:text-left">
            <div className="text-xs font-mono text-indigo-700 dark:text-indigo-300 font-semibold">
              Compartilhe seu Resultado
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white">
              Gere seu Card Social, Resumo em Texto ou Link Único
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
              Destaque seu estilo dominante ({dominant} — {profile.title}), sua distribuição comportamental DISC e sua área de entrada recomendada no LinkedIn, X ou WhatsApp.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsShareModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-2xs flex items-center gap-2 shrink-0 transition cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            Gerar Card & Compartilhar
          </button>
        </div>

        {/* Footer Signature */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 no-print">
          <span>DISC Tech 2.0 · Análise de Perfil para TI</span>
          <span className="text-slate-500 dark:text-slate-400 text-xs">
            Metodologia DISC adaptada para iniciantes e transição de carreira em tecnologia
          </span>
        </div>

        {/* Print-Only Executive Footer */}
        <div className="print-only pt-4 mt-6 border-t border-slate-300 text-[10px] text-slate-500 flex items-center justify-between">
          <div>Relatório pessoal para descoberta de área, estudos iniciais e transição de carreira para TI.</div>
          <div>DISC Tech 2.0 · Relatório Oficial de Avaliação</div>
        </div>
      </article>

      {/* Social Share & Link Modal */}
      {isShareModalOpen && (
        <Suspense fallback={null}>
          <SocialShareModal
            isOpen={isShareModalOpen}
            onClose={() => setIsShareModalOpen(false)}
            name={name}
            dominant={dominant}
            secondary={secondary}
            dualCode={dualCode}
            pct={pct}
            topArea={
              top3EntryAreas[0]
                ? { title: top3EntryAreas[0].title, matchScore: top3EntryAreas[0].matchScore }
                : undefined
            }
          />
        </Suspense>
      )}
    </div>
  );
};
