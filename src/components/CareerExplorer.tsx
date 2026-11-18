import React, { useState } from 'react';
import { DiscLetter, DiscPercentages } from '../types/disc';
import { TECH_CAREERS, PROFILES } from '../data/discData';
import { calculateCareerMatches } from '../utils/discCalculator';
import { Briefcase, Search, BrainCircuit, TrendingUp, CheckCircle, ChevronRight, Award } from 'lucide-react';

interface CareerExplorerProps {
  userPct?: DiscPercentages | null;
  userName?: string;
  onSelectCareerForCoach?: (careerTitle: string) => void;
}

export const CareerExplorer: React.FC<CareerExplorerProps> = ({
  userPct,
  userName,
  onSelectCareerForCoach,
}) => {
  const [selectedLetter, setSelectedLetter] = useState<DiscLetter | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCareerId, setActiveCareerId] = useState<string | null>(null);

  const careersWithMatch = userPct
    ? calculateCareerMatches(userPct)
    : TECH_CAREERS.map((c) => ({ ...c, matchScore: 75 }));

  const filtered = careersWithMatch.filter((career) => {
    const matchesLetter =
      selectedLetter === 'ALL' ||
      career.primaryDisc === selectedLetter ||
      career.secondaryDisc === selectedLetter;

    const matchesSearch =
      career.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      career.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      career.keySkills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesLetter && matchesSearch;
  });

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
              <Briefcase className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span className="font-medium text-indigo-600 dark:text-indigo-400">
                Matriz de Carreiras & Aderência DISC em TI
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Guia de Carreiras Tech & Aderência Comportamental
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-2xl">
              Descubra quais posições de liderança técnica, gestão, arquitetura ou especialista possuem maior sinergia com o seu perfil natural.
            </p>
          </div>

          {userPct && (
            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shrink-0">
              <div className="text-xs text-slate-500 dark:text-slate-400">Calculado para:</div>
              <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                {userName || 'Seu Perfil'}
              </div>
              <div className="text-[11px] font-mono tabular-nums text-indigo-600 dark:text-indigo-400 mt-1">
                D:{userPct.D}% I:{userPct.I}% S:{userPct.S}% C:{userPct.C}%
              </div>
            </div>
          )}
        </div>

        {/* Filter bar */}
        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setSelectedLetter('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                selectedLetter === 'ALL'
                  ? 'bg-indigo-600 border-indigo-600 text-white'
                  : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Todas as Carreiras
            </button>
            <button
              type="button"
              onClick={() => setSelectedLetter('D')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                selectedLetter === 'D'
                  ? 'bg-rose-50 dark:bg-red-500/20 border-rose-400 dark:border-red-500 text-rose-700 dark:text-red-300'
                  : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              D — Liderança & Execução
            </button>
            <button
              type="button"
              onClick={() => setSelectedLetter('I')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                selectedLetter === 'I'
                  ? 'bg-amber-50 dark:bg-amber-500/20 border-amber-400 dark:border-amber-500 text-amber-800 dark:text-amber-300'
                  : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              I — Produto & Comunidades
            </button>
            <button
              type="button"
              onClick={() => setSelectedLetter('S')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                selectedLetter === 'S'
                  ? 'bg-emerald-50 dark:bg-emerald-500/20 border-emerald-400 dark:border-emerald-500 text-emerald-700 dark:text-emerald-300'
                  : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              S — Estabilidade & Operações
            </button>
            <button
              type="button"
              onClick={() => setSelectedLetter('C')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                selectedLetter === 'C'
                  ? 'bg-sky-50 dark:bg-cyan-500/20 border-sky-400 dark:border-cyan-500 text-sky-700 dark:text-cyan-300'
                  : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              C — Arquitetura & Qualidade
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar carreira ou skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Carreiras Tech Recomendadas (Top 3) */}
      {userPct && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-5 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Carreiras Tech Recomendadas para o seu Perfil
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-3xl leading-relaxed">
                Comparamos suas energias (
                <span className="font-mono text-slate-900 dark:text-white font-semibold">
                  D:{userPct.D}% · I:{userPct.I}% · S:{userPct.S}% · C:{userPct.C}%
                </span>
                ) com o perfil comportamental exigido em cada cargo. Quanto maior a aderência, menor o desgaste na rotina diária.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <strong className="text-slate-900 dark:text-white">Como escolher entre as 3 recomendações:</strong> Leia{' '}
              <span className="text-slate-900 dark:text-slate-100 font-medium">o que a pessoa faz na prática</span> e o{' '}
              <span className="text-indigo-700 dark:text-indigo-300 font-medium">motivo da compatibilidade</span>. Clique em qualquer card abaixo para abrir a rotina, os entregáveis e o principal desafio na matriz completa.
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 shrink-0">
              Faixas CLT Brasil (Pleno/Sênior)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {careersWithMatch.slice(0, 3).map((topCareer, idx) => (
              <button
                key={topCareer.id}
                type="button"
                onClick={() => {
                  setSelectedLetter('ALL');
                  setSearchQuery('');
                  setActiveCareerId(topCareer.id);
                  setTimeout(() => {
                    document
                      .getElementById(`career-${topCareer.id}`)
                      ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }, 60);
                }}
                className="text-left p-5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition cursor-pointer flex flex-col justify-between gap-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-mono tabular-nums">
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                      #0{idx + 1} · {topCareer.primaryDisc}
                      {topCareer.secondaryDisc ? `+${topCareer.secondaryDisc}` : ''}
                    </span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                      {topCareer.matchScore}% Aderência
                    </span>
                  </div>
                  <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    {topCareer.title}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    <strong className="text-slate-900 dark:text-slate-100">O que faz:</strong> {topCareer.description}
                  </p>
                  {topCareer.discFitReason && (
                    <p className="text-xs text-indigo-700 dark:text-indigo-300 leading-relaxed">
                      <strong>Por que combina com seu DISC:</strong> {topCareer.discFitReason}
                    </p>
                  )}
                </div>
                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 text-[11px]">
                  <span className="font-mono text-slate-500 dark:text-slate-400 tabular-nums">
                    {topCareer.salaryRange}
                  </span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-semibold inline-flex items-center gap-1 shrink-0">
                    Ver rotina e detalhes
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Career Cards Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center space-y-3">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Nenhuma carreira encontrada para os filtros selecionados.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedLetter('ALL');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition cursor-pointer"
          >
            Mostrar todas as carreiras
          </button>
        </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((career) => {
          const primaryProfile = PROFILES[career.primaryDisc];
          const isSelected = activeCareerId === career.id;

          return (
            <div
              key={career.id}
              id={`career-${career.id}`}
              className={`bg-white dark:bg-slate-900 border rounded-2xl p-6 transition-all duration-150 flex flex-col justify-between shadow-2xs ${
                isSelected
                  ? 'border-indigo-500 ring-2 ring-indigo-500/20 shadow-sm'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      {career.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-xs">
                      <span className="font-mono font-bold" style={{ color: primaryProfile.color }}>
                        Primário: {career.primaryDisc} ({primaryProfile.title.split(' ')[1] || primaryProfile.title})
                      </span>
                      {career.secondaryDisc && (
                        <>
                          <span className="text-slate-300 dark:text-slate-600" aria-hidden="true">·</span>
                          <span className="font-mono text-slate-500 dark:text-slate-400">
                            Secundário: {career.secondaryDisc}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {userPct && (
                    <div className="text-right shrink-0 font-mono text-xs font-bold text-indigo-700 dark:text-indigo-300 tabular-nums">
                      {career.matchScore}% Aderência
                    </div>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  {career.description}
                </p>

                {/* Salary benchmark */}
                <div className="mb-4 inline-flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>
                    Média Salarial TI (BR): <strong className="font-mono tabular-nums">{career.salaryRange}</strong>
                  </span>
                </div>

                {/* Skills list */}
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
                  Competências-chave: {career.keySkills.join(' · ')}
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setActiveCareerId(isSelected ? null : career.id)}
                  className="text-xs text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white flex items-center gap-1.5 transition font-medium cursor-pointer"
                >
                  <ChevronRight
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      isSelected ? 'rotate-90 text-indigo-600 dark:text-indigo-400' : 'text-slate-400'
                    }`}
                  />
                  {isSelected ? 'Ocultar detalhes' : 'Ver perfil ideal & rotina'}
                </button>

                {onSelectCareerForCoach && (
                  <button
                    type="button"
                    onClick={() => onSelectCareerForCoach(career.title)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-600/20 hover:bg-indigo-100 dark:hover:bg-indigo-600/40 border border-indigo-200 dark:border-indigo-500/40 text-indigo-700 dark:text-indigo-300 text-xs font-semibold transition cursor-pointer"
                  >
                    <BrainCircuit className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    Gerar PDI com IA
                  </button>
                )}
              </div>

              {/* Expanded details */}
              {isSelected && (
                <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs space-y-4 bg-slate-50 dark:bg-slate-950/70 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800/80">
                  {career.dailyRoutine && career.dailyRoutine.length > 0 && (
                    <div className="space-y-2">
                      <div className="font-semibold text-indigo-700 dark:text-indigo-300 text-xs">
                        Rotina & Ritos Típicos do Dia a Dia
                      </div>
                      <div className="space-y-1.5">
                        {career.dailyRoutine.map((step, rIdx) => (
                          <div
                            key={rIdx}
                            className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                          >
                            · {step}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {career.typicalDeliverables && career.typicalDeliverables.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800/60">
                      <div className="font-semibold text-emerald-700 dark:text-emerald-400 text-xs">
                        Entregáveis & Artefatos de Responsabilidade
                      </div>
                      <div className="grid grid-cols-1 gap-1.5">
                        {career.typicalDeliverables.map((deliv, dIdx) => (
                          <div key={dIdx} className="text-slate-700 dark:text-slate-300 flex items-start gap-2">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                            <span>{deliv}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {career.discFitReason && (
                    <div className="space-y-1 pt-2 border-t border-slate-200 dark:border-slate-800/60">
                      <div className="font-semibold text-amber-700 dark:text-amber-400 text-xs">
                        Por que este perfil DISC se destaca
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                        {career.discFitReason}
                      </p>
                    </div>
                  )}

                  {career.commonChallenges && (
                    <div className="space-y-1 pt-2 border-t border-slate-200 dark:border-slate-800/60">
                      <div className="font-semibold text-rose-700 dark:text-rose-400 text-xs">
                        Principal Desafio & Ponto Cego
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                        {career.commonChallenges}
                      </p>
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800/60">
                    <div className="font-semibold text-slate-900 dark:text-slate-200 text-xs mb-2">
                      Distribuição Comportamental Recomendada:
                    </div>
                    <div className="grid grid-cols-4 gap-2 font-mono tabular-nums text-center">
                      <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-500/20 text-rose-700 dark:text-rose-300 font-semibold">
                        D: {Math.round(career.weights.D * 100)}%
                      </div>
                      <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-300 font-semibold">
                        I: {Math.round(career.weights.I * 100)}%
                      </div>
                      <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-semibold">
                        S: {Math.round(career.weights.S * 100)}%
                      </div>
                      <div className="p-2 rounded-lg bg-sky-50 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-500/20 text-sky-700 dark:text-sky-300 font-semibold">
                        C: {Math.round(career.weights.C * 100)}%
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      )}

      <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
        Referência salarial média no regime CLT no Brasil (níveis Pleno/Sênior); valores variam conforme região, porte da empresa e contratos PJ ou internacionais.
      </p>
    </div>
  );
};
