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
  Award,
  Terminal,
  Loader2,
  Printer,
  FileText,
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
  const [exportingImg, setExportingImg] = useState(false);
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

  // Native browser print / Save as vector PDF
  const handlePrint = () => {
    window.print();
  };

  // PDF Export via jsPDF
  const handleExportPdf = async () => {
    if (!reportRef.current) return;
    setExportingPdf(true);
    try {
      const canvas = await html2canvas(reportRef.current, {
        backgroundColor: '#0b0f17',
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

        // PDF Header
        pdf.setFillColor(15, 12, 32);
        pdf.rect(0, 0, pageWidth, headerH, 'F');
        pdf.setTextColor(168, 85, 247);
        pdf.setFontSize(9);
        pdf.text('DISC Tech 2.0 • Análise de Perfil Comportamental para TI', margin, 9);
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(13);
        pdf.text(`Relatório de ${name || 'Profissional Tech'}: ${profile.title}`, margin, 17);
        pdf.setTextColor(148, 163, 184);
        pdf.setFontSize(8);
        pdf.text(new Date().toLocaleDateString('pt-BR'), pageWidth - margin, 9, { align: 'right' });

        // PDF Footer
        const footerY = pageHeight - footerH + 4;
        pdf.setDrawColor(51, 42, 84);
        pdf.line(margin, footerY - 2, pageWidth - margin, footerY - 2);
        pdf.setTextColor(148, 163, 184);
        pdf.setFontSize(7.5);
        pdf.text('DISC Tech 2.0 • Análise de Perfil Comportamental para TI', margin, footerY + 3);
        pdf.text(`Página ${i + 1} de ${totalPages}`, pageWidth - margin, footerY + 3, { align: 'right' });

        // Slice canvas for page content
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

  // PNG Image Export
  const handleExportPng = async () => {
    if (!reportRef.current) return;
    setExportingImg(true);
    try {
      const canvas = await html2canvas(reportRef.current, {
        backgroundColor: '#0b0f17',
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const link = document.createElement('a');
      link.download = `disc-tech-${dominant}-${(name || 'resultado').trim().replace(/\s+/g, '-')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Failed to export PNG:', err);
    } finally {
      setExportingImg(false);
    }
  };

  // Share summary
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
    <div className="w-full max-w-5xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      {/* Top Action Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 backdrop-blur-xl shadow-xl no-print">
        <div className="flex items-center gap-2">
          <button
            onClick={onRestart}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Refazer Teste
          </button>

          <button
            onClick={onSaveResult}
            disabled={isSaved}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer border ${
              isSaved
                ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40'
                : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-700/60'
            }`}
          >
            <BookmarkCheck className="w-3.5 h-3.5 text-emerald-400" />
            {isSaved ? 'Salvo no Histórico' : 'Salvar Resultado'}
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-500/40 shadow-sm transition cursor-pointer"
            title="Imprimir ou Salvar em PDF (resolução nativa para liderança e RH)"
          >
            <Printer className="w-3.5 h-3.5" />
            Imprimir / Salvar PDF
          </button>

          <button
            onClick={handleExportPdf}
            disabled={exportingPdf}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition cursor-pointer disabled:opacity-50"
            title="Download direto do arquivo PDF"
          >
            {exportingPdf ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Gerando PDF...
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                Baixar PDF (A4)
              </>
            )}
          </button>

          <button
            onClick={() => setIsShareModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white shadow-sm border border-purple-500/40 transition cursor-pointer"
            title="Compartilhar Perfil, Gerar Card Social e Link Único"
          >
            <Share2 className="w-3.5 h-3.5" />
            Compartilhar Perfil
          </button>

          <button
            onClick={onOpenAiCoach}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition cursor-pointer"
            title="Co-Pilot de Carreira IA"
          >
            <BrainCircuit className="w-3.5 h-3.5 text-indigo-400" />
            Co-Pilot IA
          </button>

          <button
            onClick={handleShare}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition cursor-pointer"
            title="Copiar texto de resumo"
          >
            {copySuccess ? 'Copiado!' : 'Copiar Resumo'}
          </button>
        </div>
      </div>

      {/* Printable / Canvas Container */}
      <div ref={reportRef} className="space-y-8 p-4 sm:p-8 rounded-3xl bg-[#0b0f17] border border-slate-800 shadow-lg relative">
        {/* Print-Only Clean Executive Header */}
        <div className="print-only mb-6 pb-4 border-b border-slate-300">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] font-mono uppercase text-indigo-800 font-bold tracking-wider">
                Relatório de Análise de Perfil Comportamental
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mt-0.5">
                DISC Tech 2.0 • {profile.title} ({dominant})
              </h1>
              <p className="text-xs text-slate-600 mt-0.5">
                Mapeamento comportamental adaptado para engenharia de software e liderança técnica
              </p>
            </div>
            <div className="text-right text-xs text-slate-700 space-y-0.5">
              <div>Profissional: <strong className="text-slate-900">{name || 'Profissional Tech'}</strong></div>
              <div>Data de Emissão: <strong>{new Date().toLocaleDateString('pt-BR')}</strong></div>
              <div className="font-mono text-[11px] text-slate-600">
                Score: D:{pct.D}% | I:{pct.I}% | S:{pct.S}% | C:{pct.C}%
              </div>
            </div>
          </div>
        </div>

        {/* Master Hero Profile Card */}
        <div className="relative bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider border shadow-sm"
                  style={{
                    backgroundColor: `${profile.color}20`,
                    color: profile.color,
                    borderColor: `${profile.color}50`,
                  }}
                >
                  PERFIL DOMINANTE {dominant}
                </span>

                {dual && (
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-slate-800 text-slate-200 border border-slate-700">
                    BLEND: {dual.code} ({dual.subtitle})
                  </span>
                )}

                <span className="text-xs text-slate-400">
                  Avaliação de: <strong className="text-white">{name || 'Profissional Tech'}</strong>
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                {profile.title}
              </h1>

              <p className="text-base sm:text-lg text-slate-300 font-medium max-w-2xl leading-relaxed">
                "{profile.tagline}"
              </p>

              <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
                {profile.summary}
              </p>
            </div>

            {/* Dominant Letter Big Badge */}
            <div className="shrink-0 flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-950 border border-slate-800 shadow-md">
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
              <div className="text-xs font-mono text-slate-400 mt-2">
                Score Principal: <strong className="text-white">{pct[dominant]}%</strong>
              </div>
            </div>
          </div>

          {/* Dual Blend Sub-Card */}
          {dual && (
            <div className="mt-8 pt-6 border-t border-slate-800/80 bg-purple-950/20 -mx-6 sm:-mx-10 -mb-6 sm:-mb-10 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-mono text-purple-300 uppercase tracking-wider">
                  Combinação Secundária (Traço {secondary} - {secondaryProfile.title})
                </div>
                <div className="text-base font-bold text-white mt-1">
                  {dual.title}
                </div>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                  {dual.description}
                </p>
              </div>
              <div className="text-xs text-purple-200 bg-purple-900/40 border border-purple-500/30 px-3 py-2 rounded-xl shrink-0 max-w-xs">
                💡 <strong className="text-white">Diferencial:</strong> {dual.naturalStrength}
              </div>
            </div>
          )}
        </div>

        {/* Radar Chart & Breakdown Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Radar Chart Column */}
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center">
            <div className="w-full flex items-center justify-between gap-2 mb-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-400" />
                Gráfico de Radar DISC
              </h3>
              <span className="text-xs font-mono text-amber-400 tabular-nums">
                Ref: {activeBenchmark.shortName}
              </span>
            </div>
            <p className="w-full text-xs text-slate-400 mb-4 leading-relaxed">
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
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-400" />
                Distribuição vs. {activeBenchmark.shortName}
              </h3>
              <span className="text-xs text-slate-400 font-mono tabular-nums">
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
                      ? 'bg-slate-900 border-indigo-500/40'
                      : 'bg-slate-900/50 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="w-6 h-6 rounded-md flex items-center justify-center font-mono font-bold text-xs"
                        style={{ backgroundColor: `${p.color}25`, color: p.color }}
                      >
                        {letter}
                      </span>
                      <span className="font-bold text-white">{p.title}</span>
                      {isDom && (
                        <span className="text-[11px] font-medium text-indigo-300">
                          · Dominante
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 font-mono tabular-nums">
                      <span
                        className={`text-[11px] font-medium ${
                          gap > 0
                            ? 'text-emerald-400'
                            : gap < 0
                            ? 'text-amber-400'
                            : 'text-slate-400'
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
                  <div className="relative w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full rounded-full transition-all duration-500 ease-out"
                      style={{
                        width: `${score}%`,
                        backgroundColor: p.color,
                      }}
                    />
                    {/* Benchmark vertical pin marker */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-amber-400 z-10"
                      style={{ left: `${benchScore}%` }}
                      title={`Referência ${activeBenchmark.shortName}: ${benchScore}%`}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                    <span className="truncate pr-2">{p.tagline}</span>
                    <span className="text-[11px] font-mono text-amber-400/90 tabular-nums shrink-0">
                      Ref {activeBenchmark.shortName}: {benchScore}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Superpowers Tech List */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                Superpoderes em Ambientes de Tecnologia
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Suas vantagens desleais naturais na rotina de squads, arquitetura e entrega contínua
              </p>
            </div>
            <span className="text-xs font-mono text-purple-300 bg-purple-500/15 px-3 py-1 rounded-full border border-purple-500/30">
              Vantagem Competitiva
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.superpowers.map((power, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-3 hover:border-slate-700 transition"
              >
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                  {power}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bugs Comportamentais & Hotfixes */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Bug className="w-5 h-5 text-rose-400" />
                Bugs Comportamentais & Hotfixes
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Gargalos comuns que podem travar sua senioridade e scripts práticos de correção
              </p>
            </div>
            <span className="text-xs font-mono text-rose-300 bg-rose-500/15 px-3 py-1 rounded-full border border-rose-500/30">
              Debug & Profiling
            </span>
          </div>

          <div className="space-y-4">
            {profile.debugs.map((debug, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-3"
              >
                <div className="flex items-start gap-2 text-xs sm:text-sm font-bold text-rose-400 font-mono">
                  <Terminal className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{debug.issue}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/30 text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {debug.fix}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Carreiras Tech Recomendadas */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-indigo-400" />
                Carreiras Tech Recomendadas
              </h2>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed max-w-2xl">
                Cruzamos a distribuição das suas energias (<span className="font-mono text-white">D:{pct.D}% · I:{pct.I}% · S:{pct.S}% · C:{pct.C}%</span>) com a rotina real de cada cargo para mostrar onde você terá maior facilidade de aprendizado e menos desgaste.
              </p>
            </div>

            {/* Interactive Track Switcher */}
            <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-xl shrink-0 self-start no-print">
              <button
                type="button"
                onClick={() => {
                  setCareerTrackView('entry');
                  setExpandedCareerId(null);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
                  careerTrackView === 'entry'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
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
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Carreiras Consolidadas
              </button>
            </div>
          </div>

          {/* Didactic Guide Legend */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <strong className="text-white">Como ler suas recomendações:</strong>{' '}
              {careerTrackView === 'entry'
                ? 'Áreas ideais para quem está começando ou em transição, explicadas sem jargões, com passo inicial da Semana 1 e projeto prático.'
                : 'Posições para profissionais que já atuam ou buscam especialização técnica/liderança, detalhando rotina diária e por que seu DISC se destaca.'}
            </div>
            <span className="text-[11px] font-mono text-indigo-300 shrink-0">
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
                    className={`p-5 rounded-2xl bg-slate-950/80 border transition-colors ${
                      isExpanded ? 'border-indigo-500/60' : 'border-slate-800'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                          <span className="font-mono font-bold text-indigo-300 tabular-nums">
                            0{idx + 1}. Recomendação
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{entry.codeLevelLabel}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono text-emerald-400 tabular-nums">
                            Início: {entry.salaryEntryRange}
                          </span>
                        </div>

                        <h3 className="text-base sm:text-lg font-bold text-white">
                          {entry.title}
                        </h3>

                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                          <strong className="text-white">O que faz na prática:</strong> {entry.summary}
                        </p>

                        <p className="text-xs text-slate-400 leading-relaxed">
                          <strong className="text-indigo-300">Como é o seu dia:</strong> {entry.dayToDay}
                        </p>
                      </div>

                      <div className="flex md:flex-col items-center md:items-end justify-between gap-3 shrink-0">
                        <div className="text-right">
                          <div className="text-[11px] text-slate-400">Aderência ao DISC</div>
                          <div className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
                            {entry.matchScore}%
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setExpandedCareerId(isExpanded ? null : entry.id)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 transition cursor-pointer whitespace-nowrap no-print"
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
                      <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className="space-y-2">
                          <div className="font-semibold text-white flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                            Por onde começar nos primeiros 30 dias:
                          </div>
                          <ul className="space-y-1.5 text-slate-300">
                            {entry.first30Days.map((step, sIdx) => (
                              <li key={sIdx} className="leading-relaxed">
                                <strong className="text-indigo-300 font-mono">{step.week}:</strong> {step.focus}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <div className="font-semibold text-emerald-400 mb-1">
                              Você vai se identificar se:
                            </div>
                            <ul className="space-y-1 text-slate-300">
                              {entry.likeIf.map((item, i) => (
                                <li key={i} className="flex items-start gap-1.5">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                            <div className="font-semibold text-white">1º Projeto para seu Portfólio:</div>
                            <p className="text-slate-300 leading-relaxed">{entry.starterProject}</p>
                            <div className="text-[11px] text-slate-400 pt-1">
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
                    className={`p-5 rounded-2xl bg-slate-950/80 border transition-colors ${
                      isExpanded ? 'border-indigo-500/60' : 'border-slate-800'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                          <span className="font-mono font-bold text-indigo-300 tabular-nums">
                            0{idx + 1}. Recomendação
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>Perfil chave: {career.primaryDisc}{career.secondaryDisc ? ` + ${career.secondaryDisc}` : ''}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono text-emerald-400 tabular-nums">
                            {career.salaryRange}
                          </span>
                        </div>

                        <h3 className="text-base sm:text-lg font-bold text-white">
                          {career.title}
                        </h3>

                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                          <strong className="text-white">O que faz na prática:</strong> {career.description}
                        </p>

                        {career.discFitReason && (
                          <p className="text-xs text-indigo-300 leading-relaxed">
                            <strong>Por que combina com seu perfil:</strong> {career.discFitReason}
                          </p>
                        )}

                        <div className="text-[11px] text-slate-400 pt-1">
                          Competências-chave: {career.keySkills.join(' · ')}
                        </div>
                      </div>

                      <div className="flex md:flex-col items-center md:items-end justify-between gap-3 shrink-0">
                        <div className="text-right">
                          <div className="text-[11px] text-slate-400">Aderência ao DISC</div>
                          <div className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
                            {career.matchScore}%
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setExpandedCareerId(isExpanded ? null : career.id)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 transition cursor-pointer whitespace-nowrap no-print"
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
                      <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        {career.dailyRoutine && (
                          <div className="space-y-2">
                            <div className="font-semibold text-white">
                              Exemplo de rotina em um dia comum:
                            </div>
                            <ul className="space-y-1.5 text-slate-300">
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
                              <div className="font-semibold text-emerald-400">
                                O que essa função entrega para a empresa:
                              </div>
                              <ul className="space-y-1 text-slate-300">
                                {career.typicalDeliverables.map((deliv, dIdx) => (
                                  <li key={dIdx} className="flex items-start gap-1.5">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                    <span>{deliv}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {career.commonChallenges && (
                            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                              <div className="font-semibold text-amber-400">
                                Principal desafio para se preparar:
                              </div>
                              <p className="text-slate-300 leading-relaxed">{career.commonChallenges}</p>
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

          {/* Lista direta de Carreiras Tech Recomendadas do Perfil Dominante */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <div className="text-xs font-semibold text-slate-200">
              Outros cargos alinhados ao perfil {profile.title} ({dominant}):
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
              {profile.careers.map((roleTitle, rIdx) => (
                <div
                  key={rIdx}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs font-medium text-slate-200 flex items-center gap-2"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span className="truncate">{roleTitle}</span>
                </div>
              ))}
            </div>
          </div>

          {onOpenTransitionGuide && (
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
              <div className="text-xs text-slate-300 leading-relaxed">
                <strong className="text-white block mb-0.5">
                  Quer comparar todas as portas de entrada com base na sua experiência anterior?
                </strong>
                Use o Guia de Transição para cruzar seu histórico profissional (ex: Administração, Vendas, Direito, Saúde) com as áreas de TI.
              </div>
              <button
                type="button"
                onClick={onOpenTransitionGuide}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition cursor-pointer whitespace-nowrap shrink-0"
              >
                <Map className="w-4 h-4" />
                Explorar Guia de Transição
              </button>
            </div>
          )}
        </div>

        {/* Áreas de Desenvolvimento & PDI */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-cyan-400" />
                Plano de Aceleração & Crescimento Contínuo
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Habilidades-chave para subir a régua de maturidade técnica e comportamental
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {profile.growthAreas.map((area, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs sm:text-sm text-slate-300 flex items-start gap-2.5"
              >
                <span className="text-cyan-400 font-bold font-mono shrink-0">0{idx + 1}.</span>
                <span>{area}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Share Banner at the end */}
        <div className="bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-slate-900 border border-purple-500/30 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 no-print shadow-xl">
          <div className="space-y-1.5 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[11px] font-mono border border-purple-500/30">
              <Share2 className="w-3.5 h-3.5" />
              Compartilhe seu Resultado Tech
            </div>
            <h3 className="text-lg font-bold text-white">
              Gere seu Card Social ou Link Único para LinkedIn e Twitter
            </h3>
            <p className="text-xs text-slate-300 max-w-xl">
              Destaque seu estilo dominante em engenharia ({dominant} — {profile.title}), sua aderência ao benchmark Pleno e suas fortalezas técnicas com a sua rede e equipe.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsShareModalOpen(true)}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-900/30 flex items-center gap-2 shrink-0 transition cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            Gerar Card & Compartilhar
          </button>
        </div>

        {/* Footer Signature */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 no-print">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
            <span>DISC Tech 2.0 • Análise de Perfil para TI</span>
          </div>
          <div className="text-slate-400 text-xs">
            Metodologia DISC adaptada para engenharia de software e liderança técnica
          </div>
        </div>

        {/* Print-Only Executive Footer */}
        <div className="print-only pt-4 mt-6 border-t border-slate-300 text-[10px] text-slate-500 flex items-center justify-between">
          <div>Documento confidencial para desenvolvimento de carreira, transição profissional e liderança técnica.</div>
          <div>DISC Tech 2.0 • Relatório Oficial de Avaliação</div>
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
