import React, { useState } from 'react';
import { TechCareer, DiscLetter, DiscPercentages } from '../types/disc';
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
    <div className="w-full max-w-6xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono mb-3">
              <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
              Matriz de Carreiras & Aderência DISC em TI
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Guia de Carreiras Tech & Aderência Comportamental
            </h1>
            <p className="text-sm text-slate-400 mt-2 max-w-2xl">
              Descubra quais posições de liderança técnica, gestão, arquitetura ou especialista possuem maior sinergia com o seu perfil natural.
            </p>
          </div>

          {userPct && (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 shrink-0">
              <div className="text-xs text-slate-400">Calculado para:</div>
              <div className="text-sm font-bold text-white mt-0.5">{userName || 'Seu Perfil'}</div>
              <div className="text-[11px] font-mono text-indigo-400 mt-1">
                D:{userPct.D}% I:{userPct.I}% S:{userPct.S}% C:{userPct.C}%
              </div>
            </div>
          )}
        </div>

        {/* Filter bar */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row gap-4 items-center justify-between">
          {/* Quadrant buttons */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setSelectedLetter('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                selectedLetter === 'ALL'
                  ? 'bg-purple-600/30 border-purple-500 text-white'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              Todas as Carreiras
            </button>
            <button
              onClick={() => setSelectedLetter('D')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                selectedLetter === 'D'
                  ? 'bg-red-500/20 border-red-500 text-red-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              D — Liderança & Execução
            </button>
            <button
              onClick={() => setSelectedLetter('I')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                selectedLetter === 'I'
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              I — Produto & Comunidades
            </button>
            <button
              onClick={() => setSelectedLetter('S')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                selectedLetter === 'S'
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              S — Estabilidade & Operações
            </button>
            <button
              onClick={() => setSelectedLetter('C')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                selectedLetter === 'C'
                  ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              C — Arquitetura & Qualidade
            </button>
          </div>

          {/* Search box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar carreira ou skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-800 bg-slate-950 text-slate-200 placeholder:text-slate-600 focus:border-purple-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Carreiras Tech Recomendadas (Top 3) */}
      {userPct && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-indigo-400" />
                Carreiras Tech Recomendadas para o seu Perfil
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
                Comparamos suas energias (<span className="font-mono text-white">D:{userPct.D}% · I:{userPct.I}% · S:{userPct.S}% · C:{userPct.C}%</span>) com o perfil comportamental exigido em cada cargo. Quanto maior a aderência, menor o desgaste na rotina diária.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
            <strong className="text-white">Como escolher entre as 3 recomendações:</strong> Leia{' '}
            <span className="text-slate-100 font-medium">o que a pessoa faz na prática</span> e o{' '}
            <span className="text-indigo-300 font-medium">motivo da compatibilidade</span>. Clique em qualquer card abaixo para abrir automaticamente a rotina diária, os entregáveis e o principal desafio na lista completa.
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
                className="text-left p-5 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/60 transition cursor-pointer flex flex-col justify-between gap-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-mono tabular-nums">
                    <span className="text-indigo-400 font-bold">
                      #0{idx + 1} · {topCareer.primaryDisc}
                      {topCareer.secondaryDisc ? `+${topCareer.secondaryDisc}` : ''}
                    </span>
                    <span className="text-emerald-400 font-semibold">
                      {topCareer.matchScore}% Aderência
                    </span>
                  </div>
                  <div className="text-sm sm:text-base font-bold text-white">{topCareer.title}</div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    <strong className="text-slate-100">O que faz:</strong> {topCareer.description}
                  </p>
                  {topCareer.discFitReason && (
                    <p className="text-xs text-indigo-300 leading-relaxed">
                      <strong>Por que combina com seu DISC:</strong> {topCareer.discFitReason}
                    </p>
                  )}
                </div>
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2 text-[11px]">
                  <span className="font-mono text-slate-400 tabular-nums">{topCareer.salaryRange}</span>
                  <span className="text-indigo-400 font-semibold inline-flex items-center gap-1 shrink-0">
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((career) => {
          const primaryProfile = PROFILES[career.primaryDisc];
          const isSelected = activeCareerId === career.id;

          return (
            <div
              key={career.id}
              id={`career-${career.id}`}
              className={`bg-slate-900 border rounded-2xl p-6 transition-all duration-150 flex flex-col justify-between ${
                isSelected
                  ? 'border-indigo-500 shadow-md'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      {career.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span
                        className="px-2 py-0.5 rounded text-[11px] font-mono font-bold border"
                        style={{
                          backgroundColor: `${primaryProfile.color}15`,
                          color: primaryProfile.color,
                          borderColor: `${primaryProfile.color}35`,
                        }}
                      >
                        Primário: {career.primaryDisc} ({primaryProfile.title.split(' ')[1] || primaryProfile.title})
                      </span>
                      {career.secondaryDisc && (
                        <span className="text-[11px] font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded">
                          Secundário: {career.secondaryDisc}
                        </span>
                      )}
                    </div>
                  </div>

                  {userPct && (
                    <div className="text-right shrink-0">
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 font-mono text-xs font-bold">
                        <Award className="w-3 h-3" />
                        {career.matchScore}% Match
                      </div>
                    </div>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                  {career.description}
                </p>

                {/* Salary benchmark tag */}
                <div className="mb-4 inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/30 border border-emerald-500/20 px-3 py-1 rounded-lg">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Média Salarial TI (BR): <strong>{career.salaryRange}</strong>
                </div>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {career.keySkills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2.5 py-1 rounded-md bg-slate-950 border border-slate-800 text-slate-400 text-[11px]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => setActiveCareerId(isSelected ? null : career.id)}
                  className="text-xs text-slate-300 hover:text-white flex items-center gap-1.5 transition font-medium cursor-pointer"
                >
                  <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-200 ${isSelected ? 'rotate-90 text-indigo-400' : 'text-slate-400'}`} />
                  {isSelected ? 'Ocultar detalhes' : 'Ver perfil ideal & rotina'}
                </button>

                {onSelectCareerForCoach && (
                  <button
                    onClick={() => onSelectCareerForCoach(career.title)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/40 text-indigo-300 text-xs font-semibold transition cursor-pointer"
                  >
                    <BrainCircuit className="w-3.5 h-3.5 text-indigo-400" />
                    Gerar PDI com IA
                  </button>
                )}
              </div>

              {/* Expanded details */}
              {isSelected && (
                <div className="mt-5 pt-4 border-t border-slate-800 text-xs space-y-4 bg-slate-950/70 p-4 rounded-xl border border-slate-800/80 animate-fadeIn">
                  {/* Rotina Típica */}
                  {career.dailyRoutine && career.dailyRoutine.length > 0 && (
                    <div className="space-y-2">
                      <div className="font-semibold text-slate-200 flex items-center gap-1.5 uppercase text-[11px] tracking-wider text-indigo-300">
                        <span>🕒</span> Rotina & Ritos Típicos do Dia a Dia
                      </div>
                      <div className="space-y-1.5 pl-1">
                        {career.dailyRoutine.map((step, rIdx) => (
                          <div key={rIdx} className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Entregáveis Típicos */}
                  {career.typicalDeliverables && career.typicalDeliverables.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-slate-800/60">
                      <div className="font-semibold text-slate-200 flex items-center gap-1.5 uppercase text-[11px] tracking-wider text-emerald-400">
                        <span>📦</span> Entregáveis & Artefatos de Responsabilidade
                      </div>
                      <div className="grid grid-cols-1 gap-1.5">
                        {career.typicalDeliverables.map((deliv, dIdx) => (
                          <div key={dIdx} className="text-slate-300 flex items-start gap-2">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{deliv}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Por que o perfil DISC se destaca */}
                  {career.discFitReason && (
                    <div className="space-y-1 pt-2 border-t border-slate-800/60">
                      <div className="font-semibold text-slate-200 uppercase text-[11px] tracking-wider text-amber-400">
                        💡 Por que este perfil DISC se destaca
                      </div>
                      <p className="text-slate-300 leading-relaxed">
                        {career.discFitReason}
                      </p>
                    </div>
                  )}

                  {/* Desafio Comum */}
                  {career.commonChallenges && (
                    <div className="space-y-1 pt-2 border-t border-slate-800/60">
                      <div className="font-semibold text-slate-200 uppercase text-[11px] tracking-wider text-rose-400">
                        ⚠️ Principal Desafio & Ponto Cego
                      </div>
                      <p className="text-slate-300 leading-relaxed">
                        {career.commonChallenges}
                      </p>
                    </div>
                  )}

                  {/* Distribuição Comportamental Recomendada */}
                  <div className="pt-2 border-t border-slate-800/60">
                    <div className="font-semibold text-slate-200 text-[11px] uppercase tracking-wider mb-2">
                      Distribuição Comportamental Recomendada:
                    </div>
                    <div className="grid grid-cols-4 gap-2 font-mono text-center">
                      <div className="p-2 rounded-lg bg-rose-950/20 border border-rose-500/20 text-rose-300">
                        D: {Math.round(career.weights.D * 100)}%
                      </div>
                      <div className="p-2 rounded-lg bg-amber-950/20 border border-amber-500/20 text-amber-300">
                        I: {Math.round(career.weights.I * 100)}%
                      </div>
                      <div className="p-2 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-emerald-300">
                        S: {Math.round(career.weights.S * 100)}%
                      </div>
                      <div className="p-2 rounded-lg bg-sky-950/20 border border-sky-500/20 text-sky-300">
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
    </div>
  );
};
