import React, { useRef, useState } from 'react';
import { DiscLetter, DiscPercentages, QuizMode } from '../types/disc';
import { PROFILES, DUAL_PROFILES, BENCHMARK_PROFILES } from '../data/discData';
import { ENTRY_TECH_AREAS } from '../data/transitionData';
import { calculateCareerMatches } from '../utils/discCalculator';
import { RadarChart } from './RadarChart';
import { SocialShareModal } from './SocialShareModal';
import {
  Download,
  Share2,
  Activity,
  Zap,
  ShieldAlert,
  Bug,
  CheckCircle2,
  Briefcase,
  RotateCcw,
  BookmarkCheck,
  TrendingUp,
  BrainCircuit,
  Terminal,
  Loader2,
  Printer,
  Map,
  ChevronDown,
  ChevronUp,
  BookOpen
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ResultReportProps {
  name: string;
  dominant: DiscLetter;
  secondary: DiscLetter;
  dualCode: string;
  pct: DiscPercentages;
  quizMode?: QuizMode;
  onRestart: () => void;
  onOpenAiCoach: () => void;
  onOpenTransitionGuide?: () => void;
  onSaveResult: () => void;
  isSaved?: boolean;
}

export const ResultReport: React.FC<ResultReportProps> = ({
  name,
  dominant,
  secondary,
  dualCode,
  pct,
  quizMode = 'standard',
  onRestart,
  onOpenAiCoach,
  onOpenTransitionGuide,
  onSaveResult,
  isSaved = false,
}) => {
  const reportRef = useRef<HTMLDivElement>(null);
  const [exportingPdf, setExportingPdf] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [careerTrackView, setCareerTrackView] = useState<'entry' | 'pro'>(
    quizMode === 'beginner' ? 'entry' : 'pro'
  );
  const [expandedCareerId, setExpandedCareerId] = useState<string | null>(null);
  const [selectedBenchmarkId, setSelectedBenchmarkId] = useState<'pleno' | 'senior' | 'industry'>('pleno');
  const activeBenchmark = BENCHMARK_PROFILES[selectedBenchmarkId] || BENCHMARK_PROFILES.pleno;

  const profile = PROFILES[dominant];
  const secondaryProfile = PROFILES[secondary];
  const dual = DUAL_PROFILES[dualCode] || DUAL_PROFILES[`${dominant}${secondary}`];
  const careerMatches = calculateCareerMatches(pct);
  const entryMatches = [...ENTRY_TECH_AREAS]
    .map((entry) => {
      const diff =
        Math.abs(pct.D - entry.weights.D * 100) +
        Math.abs(pct.I - entry.weights.I * 100) +
        Math.abs(pct.S - entry.weights.S * 100) +
        Math.abs(pct.C - entry.weights.C * 100);
      const matchScore = Math.max(55, Math.min(98, Math.round(100 - diff * 0.42)));
      return { ...entry, matchScore };
    })
    .sort((a, b) => b.matchScore - a.matchScore);

  const handlePrint = () => {
    window.print();
  };

  const handleExportPdf = async () => {
    if (!reportRef.current) return;
    setExportingPdf(true);
    try {
      const isDark = document.documentElement.classList.contains('dark');
      const canvas = await html2canvas(reportRef.current, {
        backgroundColor: isDark ? '#0b0f17' : '#f8fafc',
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 12;
      const printWidth = pageWidth - margin * 2;
      const headerH = 22;
      const footerH = 14;
      const contentH = pageHeight - headerH - footerH - margin;

      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = printWidth / imgWidth;
      const scaledHeight = imgHeight * ratio;
      const totalPages = Math.max(1, Math.ceil(scaledHeight / contentH));

      for (let i = 0; i < totalPages; i++) {
        if (i > 0) pdf.addPage();

        pdf.setFillColor(15, 23, 42);
        pdf.rect(0, 0, pageWidth, headerH, 'F');
        pdf.setTextColor(129, 140, 248);
        pdf.setFontSize(9);
        pdf.text('DISC Tech 2.0 • Análise de Perfil Comportamental para TI', margin, 9);
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(13);
        pdf.text(`Relatório de ${name || 'Profissional Tech'}: ${profile.title}`, margin, 17);
        pdf.setTextColor(148, 163, 184);
        pdf.setFontSize(8);
        pdf.text(new Date().toLocaleDateString('pt-BR'), pageWidth - margin, 9, { align: 'right' });

        const footerY = pageHeight - footerH + 4;
        pdf.setDrawColor(203, 213, 225);
        pdf.line(margin, footerY - 2, pageWidth - margin, footerY - 2);
        pdf.setTextColor(100, 116, 139);
        pdf.setFontSize(7.5);
        pdf.text('DISC Tech 2.0 • Análise de Perfil Comportamental para TI', margin, footerY + 3);
        pdf.text(`Página ${i + 1} de ${totalPages}`, pageWidth - margin, footerY + 3, { align: 'right' });

        const sourceY = i * (contentH / ratio);
        const sliceH = Math.min(contentH / ratio, imgHeight - sourceY);

        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = imgWidth;
        pageCanvas.height = sliceH;
        const ctx = pageCanvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(canvas, 0, -sourceY);
          const sliceData = pageCanvas.toDataURL('image/png');
          pdf.addImage(sliceData, 'PNG', margin, headerH + 3, printWidth, sliceH * ratio);
        }
      }

      pdf.save(`DISC-Tech-${dominant}-${(name || 'resultado').trim().replace(/\s+/g, '-')}.pdf`);
    } catch (err) {
      console.error('Failed to export PDF:', err);
    } finally {
      setExportingPdf(false);
    }
  };

  const handleShare = () => {
    const text = `Meu resultado no DISC Tech 2.0:
Dominante: ${dominant} — ${profile.title}
D:${pct.D}% | I:${pct.I}% | S:${pct.S}% | C:${pct.C}%
Carreiras ideais: ${profile.careers.slice(0, 3).join(', ')}`;
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2200);
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
            <RotateCcw className="w-3.5 h-3.5" />
            Refazer Teste
          </button>

          <button
            type="button"
            onClick={onSaveResult}
            disabled={isSaved}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer border ${
              isSaved
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/40'
                : 'bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white border-slate-200 dark:border-slate-700/60'
            }`}
          >
            <BookmarkCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            {isSaved ? 'Salvo no Histórico' : 'Salvar Resultado'}
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleExportPdf}
            disabled={exportingPdf}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white border border-indigo-600/30 shadow-2xs transition cursor-pointer disabled:opacity-50 whitespace-nowrap"
            title="Baixar relatório em arquivo PDF (A4)"
          >
            {exportingPdf ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Gerando PDF...
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                Baixar PDF
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white border border-slate-200 dark:border-slate-700/60 transition cursor-pointer whitespace-nowrap"
            title="Imprimir página"
          >
            <Printer className="w-3.5 h-3.5" />
            Imprimir
          </button>

          <button
            type="button"
            onClick={() => setIsShareModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 dark:bg-indigo-500/20 hover:bg-slate-800 dark:hover:bg-indigo-500/30 text-white dark:text-indigo-200 border border-slate-900 dark:border-indigo-500/40 transition cursor-pointer whitespace-nowrap"
          >
            <Share2 className="w-3.5 h-3.5" />
            Compartilhar
          </button>

          <button
            type="button"
            onClick={onOpenAiCoach}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white border border-slate-200 dark:border-slate-700/60 transition cursor-pointer whitespace-nowrap"
          >
            <BrainCircuit className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            Gerar PDI
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white border border-slate-200 dark:border-slate-700/60 transition cursor-pointer whitespace-nowrap"
          >
            {copySuccess ? 'Copiado!' : 'Copiar Resumo'}
          </button>
        </div>
      </div>

      {/* Printable / Canvas Container */}
      <div
        ref={reportRef}
        className="space-y-8 relative"
      >
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
                Mapeamento comportamental adaptado para engenharia de software e carreiras em tecnologia
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

        {/* Master Hero Profile Card */}
        <div className="relative bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-mono font-bold" style={{ color: profile.color }}>
                  Perfil Dominante {dominant}
                </span>

                {dual && (
                  <>
                    <span className="text-slate-400 dark:text-slate-600" aria-hidden="true">·</span>
                    <span className="font-mono font-semibold text-slate-700 dark:text-slate-200">
                      Combinação {dual.code} ({dual.subtitle})
                    </span>
                  </>
                )}

                <span className="text-slate-400 dark:text-slate-600" aria-hidden="true">·</span>
                <span className="text-slate-600 dark:text-slate-400">
                  Avaliação de:{' '}
                  <strong className="text-slate-900 dark:text-white">
                    {name || 'Profissional Tech'}
                  </strong>
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
                {profile.title}
              </h1>

              <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 font-medium max-w-2xl leading-relaxed">
                "{profile.tagline}"
              </p>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
                {profile.summary}
              </p>
            </div>

            {/* Dominant Letter Big Badge */}
            <div className="shrink-0 flex flex-col items-center justify-center p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-2xs">
              <div
                className="w-24 h-24 rounded-2xl flex items-center justify-center font-mono font-bold text-6xl border"
                style={{
                  backgroundColor: `${profile.color}15`,
                  color: profile.color,
                  borderColor: `${profile.color}40`,
                }}
              >
                {dominant}
              </div>
              <div className="text-xs font-mono text-slate-600 dark:text-slate-400 mt-2 tabular-nums">
                Score Principal:{' '}
                <strong className="text-slate-900 dark:text-white">{pct[dominant]}%</strong>
              </div>
            </div>
          </div>

          {/* Dual Blend Sub-Card */}
          {dual && (
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800/80 bg-indigo-50/70 dark:bg-indigo-950/20 -mx-6 sm:-mx-10 -mb-6 sm:-mb-10 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-mono text-indigo-700 dark:text-indigo-300 font-semibold">
                  Combinação Secundária · Traço {secondary} ({secondaryProfile.title})
                </div>
                <div className="text-base font-bold text-slate-900 dark:text-white mt-1">
                  {dual.title}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-1 max-w-2xl">
                  {dual.description}
                </p>
              </div>
              <div className="text-xs text-indigo-900 dark:text-indigo-200 bg-white dark:bg-indigo-900/40 border border-indigo-200 dark:border-indigo-500/30 px-3.5 py-2.5 rounded-xl shrink-0 max-w-xs">
                <strong className="text-indigo-700 dark:text-white">Diferencial:</strong> {dual.naturalStrength}
              </div>
            </div>
          )}
        </div>

        {/* Radar Chart & Breakdown Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Radar Chart Column */}
          <div className="lg:col-span-6 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center">
            <div className="w-full flex items-center justify-between gap-2 mb-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Gráfico de Radar DISC
              </h3>
              <span className="text-xs font-mono text-amber-700 dark:text-amber-400 tabular-nums font-medium">
                Ref: {activeBenchmark.shortName}
              </span>
            </div>
            <p className="w-full text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              Visualização proporcional dos 4 eixos sobreposta ao perfil de referência selecionado.
            </p>

            <RadarChart
              pct={pct}
              size={340}
              showBenchmark={true}
              benchmarkProfileId={selectedBenchmarkId}
              onBenchmarkChange={setSelectedBenchmarkId}
            />
          </div>

          {/* Breakdown Bars & Details */}
          <div className="lg:col-span-6 space-y-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Distribuição vs. {activeBenchmark.shortName}
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
                Ref: D:{activeBenchmark.scores.D} I:{activeBenchmark.scores.I} S:{activeBenchmark.scores.S} C:{activeBenchmark.scores.C}
              </span>
            </div>

            {(['D', 'I', 'S', 'C'] as DiscLetter[]).map((letter) => {
              const p = PROFILES[letter];
              const score = pct[letter];
              const isDom = letter === dominant;
              const benchScore = activeBenchmark.scores[letter];
              const gap = score - benchScore;

              return (
                <div
                  key={letter}
                  className={`p-4 rounded-2xl border transition-all ${
                    isDom
                      ? 'bg-white dark:bg-slate-900 border-indigo-300 dark:border-indigo-500/40 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="w-6 h-6 rounded-md flex items-center justify-center font-mono font-bold text-xs"
                        style={{ backgroundColor: `${p.color}18`, color: p.color }}
                      >
                        {letter}
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">{p.title}</span>
                      {isDom && (
                        <span className="text-[11px] font-medium text-indigo-600 dark:text-indigo-300">
                          · Dominante
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 font-mono tabular-nums">
                      <span
                        className={`text-[11px] font-semibold ${
                          gap > 0
                            ? 'text-emerald-700 dark:text-emerald-400'
                            : gap < 0
                            ? 'text-amber-700 dark:text-amber-400'
                            : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {gap > 0 ? `+${gap}%` : `${gap}%`}
                      </span>
                      <span className="font-bold text-base" style={{ color: p.color }}>
                        {score}%
                      </span>
                    </div>
                  </div>

                  {/* Dual Bar with Benchmark Marker */}
                  <div className="relative w-full h-3 bg-slate-200 dark:bg-slate-950 rounded-full overflow-hidden border border-slate-300/60 dark:border-slate-800">
                    <div
                      className="h-full rounded-full transition-all duration-500 ease-out"
                      style={{
                        width: `${score}%`,
                        backgroundColor: p.color,
                      }}
                    />
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-amber-600 dark:bg-amber-400 z-10"
                      style={{ left: `${benchScore}%` }}
                      title={`Referência ${activeBenchmark.shortName}: ${benchScore}%`}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 mt-2">
                    <span className="truncate pr-2">{p.tagline}</span>
                    <span className="text-[11px] font-mono text-amber-700 dark:text-amber-400/90 tabular-nums shrink-0 font-medium">
                      Ref {activeBenchmark.shortName}: {benchScore}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Superpowers Tech List */}
        <div className="bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                Superpoderes em Ambientes de Tecnologia
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Suas vantagens naturais na rotina de squads, arquitetura e entrega contínua
              </p>
            </div>
            <span className="text-xs font-mono text-indigo-700 dark:text-indigo-300 font-medium">
              Vantagem Competitiva
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.superpowers.map((power, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 flex items-start gap-3 hover:border-slate-300 dark:hover:border-slate-700 transition"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                  {power}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bugs Comportamentais & Hotfixes */}
        <div className="bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Bug className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                Bugs Comportamentais & Hotfixes
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Gargalos comuns que podem travar sua evolução e recomendações práticas de correção
              </p>
            </div>
            <span className="text-xs font-mono text-rose-700 dark:text-rose-300 font-medium">
              Diagnóstico & Ajustes
            </span>
          </div>

          <div className="space-y-4">
            {profile.debugs.map((debug, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80 space-y-3"
              >
                <div className="flex items-start gap-2 text-xs sm:text-sm font-bold text-rose-700 dark:text-rose-400 font-mono">
                  <Terminal className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{debug.issue}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-500/30 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                  {debug.fix}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Carreiras Tech Recomendadas */}
        <div className="bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                Carreiras Tech Recomendadas
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed max-w-2xl">
                Cruzamos a distribuição das suas energias (
                <span className="font-mono text-slate-900 dark:text-white font-semibold">
                  D:{pct.D}% · I:{pct.I}% · S:{pct.S}% · C:{pct.C}%
                </span>
                ) com a rotina real de cada cargo para mostrar onde você terá maior facilidade de aprendizado e menos desgaste.
              </p>
            </div>

            {/* Interactive Track Switcher */}
            <div className="flex items-center gap-1 p-1 bg-slate-200/80 dark:bg-slate-950 border border-slate-300/70 dark:border-slate-800 rounded-xl shrink-0 self-start no-print">
              <button
                type="button"
                onClick={() => {
                  setCareerTrackView('entry');
                  setExpandedCareerId(null);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
                  careerTrackView === 'entry'
                    ? 'bg-white dark:bg-indigo-600 text-slate-900 dark:text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Portas de Entrada (Iniciantes)
              </button>
              <button
                type="button"
                onClick={() => {
                  setCareerTrackView('pro');
                  setExpandedCareerId(null);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
                  careerTrackView === 'pro'
                    ? 'bg-white dark:bg-indigo-600 text-slate-900 dark:text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Carreiras Consolidadas
              </button>
            </div>
          </div>

          {/* Didactic Guide Legend */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 text-xs text-slate-600 dark:text-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <strong className="text-slate-900 dark:text-white">Como ler suas recomendações:</strong>{' '}
              {careerTrackView === 'entry'
                ? 'Áreas ideais para quem está começando ou em transição, explicadas sem jargões, com passo inicial da Semana 1 e projeto prático.'
                : 'Posições para profissionais que já atuam ou buscam especialização técnica/liderança, detalhando rotina diária e por que seu DISC se destaca.'}{' '}
              <span className="text-slate-500 dark:text-slate-400">
                (Faixas salariais referenciais CLT no Brasil; variam por região, porte da empresa e regime PJ/exterior.)
              </span>
            </div>
            <span className="text-[11px] font-mono text-indigo-700 dark:text-indigo-300 shrink-0 font-semibold">
              Top 3 para perfil {dominant}{secondary}
            </span>
          </div>

          {/* TRACK A: Entry / Beginners View */}
          {careerTrackView === 'entry' ? (
            <div className="space-y-4">
              {entryMatches.slice(0, 3).map((entry, idx) => {
                const isExpanded = expandedCareerId === entry.id;
                return (
                  <div
                    key={entry.id}
                    className={`p-5 rounded-2xl bg-white dark:bg-slate-950/80 border transition-colors ${
                      isExpanded ? 'border-indigo-500' : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <span className="font-mono font-bold text-indigo-700 dark:text-indigo-300 tabular-nums">
                            0{idx + 1}. Recomendação
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{entry.codeLevelLabel}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono text-emerald-700 dark:text-emerald-400 tabular-nums font-medium">
                            Início: {entry.salaryEntryRange}
                          </span>
                        </div>

                        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                          {entry.title}
                        </h3>

                        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                          <strong className="text-slate-900 dark:text-white">O que faz na prática:</strong>{' '}
                          {entry.summary}
                        </p>

                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                          <strong className="text-indigo-700 dark:text-indigo-300">Como é o seu dia:</strong>{' '}
                          {entry.dayToDay}
                        </p>
                      </div>

                      <div className="flex md:flex-col items-center md:items-end justify-between gap-3 shrink-0">
                        <div className="text-right">
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">
                            Aderência ao DISC
                          </div>
                          <div className="text-xl font-bold font-mono text-emerald-700 dark:text-emerald-400 tabular-nums">
                            {entry.matchScore}%
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setExpandedCareerId(isExpanded ? null : entry.id)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition cursor-pointer whitespace-nowrap no-print"
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
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className="space-y-2">
                          <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                            Por onde começar nos primeiros 30 dias:
                          </div>
                          <ul className="space-y-1.5 text-slate-700 dark:text-slate-300">
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
                            <ul className="space-y-1 text-slate-700 dark:text-slate-300">
                              {entry.likeIf.map((item, i) => (
                                <li key={i} className="flex items-start gap-1.5">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                            <div className="font-semibold text-slate-900 dark:text-white">
                              1º Projeto para seu Portfólio:
                            </div>
                            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                              {entry.starterProject}
                            </p>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                              Ferramentas gratuitas: {entry.freeTools.join(' · ')}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            /* TRACK B: Consolidated Tech Careers View */
            <div className="space-y-4">
              {careerMatches.slice(0, 3).map((career, idx) => {
                const isExpanded = expandedCareerId === career.id;
                return (
                  <div
                    key={career.id}
                    className={`p-5 rounded-2xl bg-white dark:bg-slate-950/80 border transition-colors ${
                      isExpanded ? 'border-indigo-500' : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <span className="font-mono font-bold text-indigo-700 dark:text-indigo-300 tabular-nums">
                            0{idx + 1}. Recomendação
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>
                            Perfil chave: {career.primaryDisc}
                            {career.secondaryDisc ? ` + ${career.secondaryDisc}` : ''}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono text-emerald-700 dark:text-emerald-400 tabular-nums font-medium">
                            {career.salaryRange}
                          </span>
                        </div>

                        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                          {career.title}
                        </h3>

                        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                          <strong className="text-slate-900 dark:text-white">O que faz na prática:</strong>{' '}
                          {career.description}
                        </p>

                        {career.discFitReason && (
                          <p className="text-xs text-indigo-700 dark:text-indigo-300 leading-relaxed">
                            <strong>Por que combina com seu perfil:</strong> {career.discFitReason}
                          </p>
                        )}

                        <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                          Competências-chave: {career.keySkills.join(' · ')}
                        </div>
                      </div>

                      <div className="flex md:flex-col items-center md:items-end justify-between gap-3 shrink-0">
                        <div className="text-right">
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">
                            Aderência ao DISC
                          </div>
                          <div className="text-xl font-bold font-mono text-emerald-700 dark:text-emerald-400 tabular-nums">
                            {career.matchScore}%
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setExpandedCareerId(isExpanded ? null : career.id)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition cursor-pointer whitespace-nowrap no-print"
                        >
                          {isExpanded ? (
                            <>
                              Ocultar rotina e entregas
                              <ChevronUp className="w-3.5 h-3.5" />
                            </>
                          ) : (
                            <>
                              Ver rotina e entregas
                              <ChevronDown className="w-3.5 h-3.5" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        {career.dailyRoutine && (
                          <div className="space-y-2">
                            <div className="font-semibold text-slate-900 dark:text-white">
                              Exemplo de rotina em um dia comum:
                            </div>
                            <ul className="space-y-1.5 text-slate-700 dark:text-slate-300">
                              {career.dailyRoutine.map((step, rIdx) => (
                                <li key={rIdx} className="leading-relaxed">
                                  · {step}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="space-y-3">
                          {career.typicalDeliverables && (
                            <div className="space-y-1.5">
                              <div className="font-semibold text-emerald-700 dark:text-emerald-400">
                                O que essa função entrega para a empresa:
                              </div>
                              <ul className="space-y-1 text-slate-700 dark:text-slate-300">
                                {career.typicalDeliverables.map((deliv, dIdx) => (
                                  <li key={dIdx} className="flex items-start gap-1.5">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                                    <span>{deliv}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {career.commonChallenges && (
                            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                              <div className="font-semibold text-amber-700 dark:text-amber-400">
                                Principal desafio para se preparar:
                              </div>
                              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                {career.commonChallenges}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Lista direta de Carreiras Tech Recomendadas */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
            <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Outros cargos alinhados ao perfil {profile.title} ({dominant}):
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
              {profile.careers.map((roleTitle, rIdx) => (
                <div
                  key={rIdx}
                  className="px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span className="truncate">{roleTitle}</span>
                </div>
              ))}
            </div>
          </div>

          {onOpenTransitionGuide && (
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
              <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                <strong className="text-slate-900 dark:text-white block mb-0.5">
                  Quer comparar todas as portas de entrada com base na sua experiência anterior?
                </strong>
                Use o Guia de Transição para cruzar seu histórico profissional (ex: Administração, Vendas, Direito, Saúde) com as áreas de TI.
              </div>
              <button
                type="button"
                onClick={onOpenTransitionGuide}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition cursor-pointer whitespace-nowrap shrink-0"
              >
                <Map className="w-4 h-4" />
                Explorar Guia de Transição
              </button>
            </div>
          )}
        </div>

        {/* Áreas de Desenvolvimento & PDI */}
        <div className="bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-sky-600 dark:text-cyan-400" />
                Plano de Aceleração & Crescimento Contínuo
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Habilidades-chave para subir a régua de maturidade técnica e comportamental
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {profile.growthAreas.map((area, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 text-xs sm:text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2.5"
              >
                <span className="text-sky-600 dark:text-cyan-400 font-bold font-mono shrink-0 tabular-nums">
                  0{idx + 1}.
                </span>
                <span>{area}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Share Banner */}
        <div className="bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-500/30 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 no-print">
          <div className="space-y-1.5 text-center sm:text-left">
            <div className="text-xs font-mono text-indigo-700 dark:text-indigo-300 font-semibold">
              Compartilhe seu Resultado Tech
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Gere seu Card Social ou Link Único para LinkedIn e Twitter
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xl">
              Destaque seu estilo dominante ({dominant} — {profile.title}), sua aderência ao benchmark e suas carreiras recomendadas com sua rede e equipe.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsShareModalOpen(true)}
            className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-xs flex items-center gap-2 shrink-0 transition cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            Gerar Card & Compartilhar
          </button>
        </div>

        {/* Footer Signature */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 no-print">
          <span>DISC Tech 2.0 · Análise de Perfil para TI</span>
          <span className="text-slate-500 dark:text-slate-400 text-xs">
            Metodologia DISC adaptada para carreiras em tecnologia e liderança técnica
          </span>
        </div>

        {/* Print-Only Executive Footer */}
        <div className="print-only pt-4 mt-6 border-t border-slate-300 text-[10px] text-slate-500 flex items-center justify-between">
          <div>Documento confidencial para desenvolvimento de carreira, transição profissional e liderança técnica.</div>
          <div>DISC Tech 2.0 · Relatório Oficial de Avaliação</div>
        </div>
      </div>

      {/* Social Share & Link Modal */}
      <SocialShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        name={name}
        dominant={dominant}
        secondary={secondary}
        dualCode={dualCode}
        pct={pct}
      />
    </div>
  );
};
