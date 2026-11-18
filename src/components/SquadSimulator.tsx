import React, { useState } from 'react';
import { SquadMember, DiscLetter, DiscPercentages } from '../types/disc';
import { PROFILES } from '../data/discData';
import { calculateSquadSynergy } from '../utils/discCalculator';
import { RadarChart } from './RadarChart';
import { Users, UserPlus, Trash2, AlertTriangle, CheckCircle, ShieldAlert, Zap, HeartHandshake, Scale } from 'lucide-react';

interface SquadSimulatorProps {
  currentUserProfile?: {
    name: string;
    dominant: DiscLetter;
    secondary: DiscLetter;
    pct: DiscPercentages;
  } | null;
}

const DEFAULT_SQUAD: SquadMember[] = [
  {
    id: '1',
    name: 'Carlos Mendes',
    role: 'Tech Lead',
    dominant: 'D',
    secondary: 'C',
    pct: { D: 45, I: 20, S: 10, C: 25 },
  },
  {
    id: '2',
    name: 'Mariana Lima',
    role: 'Product Owner',
    dominant: 'I',
    secondary: 'D',
    pct: { D: 25, I: 50, S: 15, C: 10 },
  },
  {
    id: '3',
    name: 'Lucas Rocha',
    role: 'Senior SRE / DevOps',
    dominant: 'S',
    secondary: 'C',
    pct: { D: 10, I: 15, S: 50, C: 25 },
  },
  {
    id: '4',
    name: 'Beatriz Silveira',
    role: 'Backend & Data Engineer',
    dominant: 'C',
    secondary: 'S',
    pct: { D: 15, I: 10, S: 25, C: 50 },
  },
];

export const SquadSimulator: React.FC<SquadSimulatorProps> = ({ currentUserProfile }) => {
  const [members, setMembers] = useState<SquadMember[]>(() => {
    if (currentUserProfile) {
      return [
        {
          id: 'user-0',
          name: `${currentUserProfile.name} (Você)`,
          role: 'Seu Perfil Atual',
          dominant: currentUserProfile.dominant,
          secondary: currentUserProfile.secondary,
          pct: currentUserProfile.pct,
        },
        ...DEFAULT_SQUAD.slice(1),
      ];
    }
    return DEFAULT_SQUAD;
  });

  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newDominant, setNewDominant] = useState<DiscLetter>('D');

  const synergy = calculateSquadSynergy(members);

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const defaultPctMap: Record<DiscLetter, DiscPercentages> = {
      D: { D: 50, I: 20, S: 15, C: 15 },
      I: { D: 20, I: 50, S: 20, C: 10 },
      S: { D: 10, I: 20, S: 50, C: 20 },
      C: { D: 15, I: 10, S: 25, C: 50 },
    };

    const newMember: SquadMember = {
      id: crypto.randomUUID(),
      name: newName.trim(),
      role: newRole.trim() || 'Dev Engineer',
      dominant: newDominant,
      secondary: newDominant === 'D' ? 'C' : newDominant === 'I' ? 'D' : newDominant === 'S' ? 'C' : 'S',
      pct: defaultPctMap[newDominant],
    };

    setMembers([...members, newMember]);
    setNewName('');
    setNewRole('');
  };

  const handleRemove = (id: string) => {
    setMembers(members.filter((m) => m.id !== id));
  };

  const handleResetToBalanced = () => {
    setMembers(DEFAULT_SQUAD);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
              <Users className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span className="font-medium text-indigo-600 dark:text-indigo-400">
                Simulador de Squad & Sinergia Comportamental
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Engenharia de Equipes de Alta Performance
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-2xl">
              Equipes de tecnologia equilibram Velocidade (D), Alinhamento (I), Estabilidade (S) e Rigor Técnico (C). Adicione ou remova membros para diagnosticar gargalos e saúde da squad.
            </p>
          </div>
          <button
            type="button"
            onClick={handleResetToBalanced}
            className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition self-start md:self-center cursor-pointer whitespace-nowrap"
          >
            Restaurar Squad Padrão
          </button>
        </div>
      </div>

      {/* Main Grid: Squad Metrics & Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Squad Radar & Health Gauges */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center shadow-2xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-200 mb-2 flex items-center gap-2">
            <Scale className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Radar Médio da Squad ({members.length} integrantes)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 text-center">
            Distribuição combinada dos quatro quadrantes comportamentais
          </p>

          <RadarChart pct={synergy.avgPct} size={300} showBenchmark={true} />

          {/* Core Squad Health Pillars */}
          <div className="w-full grid grid-cols-2 gap-3 mt-6">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80">
              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1.5 text-rose-600 dark:text-red-400 font-medium">
                  <Zap className="w-3.5 h-3.5" /> Velocidade
                </span>
                <span className="font-mono font-bold tabular-nums text-slate-900 dark:text-slate-200">
                  {synergy.velocity}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-rose-500 rounded-full"
                  style={{ width: `${Math.min(100, synergy.velocity)}%` }}
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80">
              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-medium">
                  <HeartHandshake className="w-3.5 h-3.5" /> Clima / Moral
                </span>
                <span className="font-mono font-bold tabular-nums text-slate-900 dark:text-slate-200">
                  {synergy.morale}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full"
                  style={{ width: `${Math.min(100, synergy.morale)}%` }}
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80">
              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                  <HeartHandshake className="w-3.5 h-3.5" /> Resiliência
                </span>
                <span className="font-mono font-bold tabular-nums text-slate-900 dark:text-slate-200">
                  {synergy.stability}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${Math.min(100, synergy.stability)}%` }}
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80">
              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1.5 text-sky-600 dark:text-cyan-400 font-medium">
                  <CheckCircle className="w-3.5 h-3.5" /> Rigor Técnico
                </span>
                <span className="font-mono font-bold tabular-nums text-slate-900 dark:text-slate-200">
                  {synergy.rigor}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-sky-500 rounded-full"
                  style={{ width: `${Math.min(100, synergy.rigor)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Warnings, Strengths, and Member Roster */}
        <div className="lg:col-span-7 space-y-6">
          {/* Diagnostic Warnings & Strengths */}
          <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-200 mb-4 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              Diagnóstico de Riscos & Pontos Cegos da Equipe
            </h3>

            {synergy.warnings.length > 0 && (
              <div className="space-y-2 mb-4">
                {synergy.warnings.map((w, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-2.5"
                  >
                    <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                    <span>{w}</span>
                  </div>
                ))}
              </div>
            )}

            {synergy.strengths.length > 0 && (
              <div className="space-y-2">
                {synergy.strengths.map((s, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs flex items-start gap-2.5"
                  >
                    <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Member Roster & Form */}
          <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-200 flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Integrantes da Squad
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
                {members.length} membros
              </span>
            </div>

            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {members.map((member) => {
                const profile = PROFILES[member.dominant];
                return (
                  <div
                    key={member.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 flex items-center justify-between gap-3 hover:border-slate-300 dark:hover:border-slate-700 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-sm shrink-0 border"
                        style={{
                          backgroundColor: `${profile.color}18`,
                          color: profile.color,
                          borderColor: `${profile.color}40`,
                        }}
                      >
                        {member.dominant}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <span>{member.name}</span>
                          <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                            · {member.role}
                          </span>
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400 font-mono tabular-nums">
                          {profile.title} · D:{member.pct.D}% I:{member.pct.I}% S:{member.pct.S}% C:{member.pct.C}%
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemove(member.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-red-400 hover:bg-rose-50 dark:hover:bg-red-500/10 transition cursor-pointer"
                      title="Remover integrante"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Quick Add Form */}
            <form onSubmit={handleAddMember} className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
              <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-300">
                Adicionar Novo Integrante
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Nome (Ex: João Silva)"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none"
                  required
                />
                <input
                  type="text"
                  placeholder="Cargo (Ex: Frontend Dev)"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none"
                />
                <select
                  value={newDominant}
                  onChange={(e) => setNewDominant(e.target.value as DiscLetter)}
                  className="px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 focus:border-indigo-500 focus:outline-none"
                >
                  <option value="D">D — Dominância (Execução)</option>
                  <option value="I">I — Influência (Comunicação)</option>
                  <option value="S">S — Estabilidade (Consistência)</option>
                  <option value="C">C — Conformidade (Qualidade)</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Incluir Integrante na Squad
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
