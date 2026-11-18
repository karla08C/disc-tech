import React, { useState } from 'react';
import { TestRecord } from '../types/disc';
import { PROFILES } from '../data/discData';
import { History, Trash2, ArrowRight, Eye, Calendar, Award } from 'lucide-react';
import { RadarChart } from './RadarChart';

interface HistoryComparisonProps {
  records: TestRecord[];
  onDeleteRecord: (id: string) => void;
  onSelectRecord: (record: TestRecord) => void;
  onStartNewTest: () => void;
}

export const HistoryComparison: React.FC<HistoryComparisonProps> = ({
  records,
  onDeleteRecord,
  onSelectRecord,
  onStartNewTest,
}) => {
  const [selectedForCompareA, setSelectedForCompareA] = useState<string | null>(
    records[0]?.id || null
  );
  const [selectedForCompareB, setSelectedForCompareB] = useState<string | null>(
    records[1]?.id || null
  );

  const recordA = records.find((r) => r.id === selectedForCompareA);
  const recordB = records.find((r) => r.id === selectedForCompareB);

  if (records.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center mx-auto">
          <History className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white">Nenhum teste salvo ainda</h2>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          Ao concluir uma avaliação comportamental DISC Tech, você poderá salvar o resultado para comparar sua evolução ao longo do tempo.
        </p>
        <button
          onClick={onStartNewTest}
          className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs tracking-wide transition cursor-pointer"
        >
          Iniciar Avaliação de 20 Cenários
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-mono mb-2">
            <History className="w-3.5 h-3.5" />
            Histórico de Avaliações
          </div>
          <h1 className="text-2xl font-bold text-white">
            Evolução Comportamental e Comparações
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Compare como seu perfil se adaptou após mudanças de empresa, transição para liderança ou novos desafios.
          </p>
        </div>

        <button
          onClick={onStartNewTest}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition cursor-pointer"
        >
          Novo Teste
        </button>
      </div>

      {/* Comparison Workspace (if at least 2 records) */}
      {records.length >= 2 && recordA && recordB && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-400" />
              Comparativo Lado a Lado
            </h3>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400">Comparando:</span>
              <select
                value={selectedForCompareA || ''}
                onChange={(e) => setSelectedForCompareA(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-xs"
              >
                {records.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({new Date(r.date).toLocaleDateString('pt-BR')}) - {r.dominant}
                  </option>
                ))}
              </select>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={selectedForCompareB || ''}
                onChange={(e) => setSelectedForCompareB(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-xs"
              >
                {records.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({new Date(r.date).toLocaleDateString('pt-BR')}) - {r.dominant}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Record A */}
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center flex flex-col items-center">
              <div className="text-xs text-purple-400 font-mono mb-1">
                {new Date(recordA.date).toLocaleDateString('pt-BR')} • {recordA.name}
              </div>
              <h4 className="text-lg font-bold text-white mb-2">
                {PROFILES[recordA.dominant].title} ({recordA.dominant})
              </h4>
              <RadarChart pct={recordA.pct} size={260} showBenchmark={false} />
              <div className="grid grid-cols-4 gap-2 w-full mt-4 font-mono text-xs">
                <div className="p-1.5 rounded bg-red-950/20 text-red-300">D: {recordA.pct.D}%</div>
                <div className="p-1.5 rounded bg-amber-950/20 text-amber-300">I: {recordA.pct.I}%</div>
                <div className="p-1.5 rounded bg-emerald-950/20 text-emerald-300">S: {recordA.pct.S}%</div>
                <div className="p-1.5 rounded bg-cyan-950/20 text-cyan-300">C: {recordA.pct.C}%</div>
              </div>
            </div>

            {/* Record B */}
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center flex flex-col items-center">
              <div className="text-xs text-purple-400 font-mono mb-1">
                {new Date(recordB.date).toLocaleDateString('pt-BR')} • {recordB.name}
              </div>
              <h4 className="text-lg font-bold text-white mb-2">
                {PROFILES[recordB.dominant].title} ({recordB.dominant})
              </h4>
              <RadarChart pct={recordB.pct} size={260} showBenchmark={false} />
              <div className="grid grid-cols-4 gap-2 w-full mt-4 font-mono text-xs">
                <div className="p-1.5 rounded bg-red-950/20 text-red-300">D: {recordB.pct.D}%</div>
                <div className="p-1.5 rounded bg-amber-950/20 text-amber-300">I: {recordB.pct.I}%</div>
                <div className="p-1.5 rounded bg-emerald-950/20 text-emerald-300">S: {recordB.pct.S}%</div>
                <div className="p-1.5 rounded bg-cyan-950/20 text-cyan-300">C: {recordB.pct.C}%</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Saved Records Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
          Todas as Avaliações Salvas ({records.length})
        </h3>

        <div className="space-y-3">
          {records.map((rec) => {
            const p = PROFILES[rec.dominant];
            return (
              <div
                key={rec.id}
                className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-700 transition"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-base shrink-0 border"
                    style={{
                      backgroundColor: `${p.color}20`,
                      color: p.color,
                      borderColor: `${p.color}40`,
                    }}
                  >
                    {rec.dominant}
                  </div>

                  <div>
                    <div className="text-sm font-bold text-white flex items-center gap-2">
                      {rec.name}
                      <span className="text-xs font-normal text-slate-400">
                        • {p.title}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                      <Calendar className="w-3 h-3" />
                      {new Date(rec.date).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <div className="hidden sm:flex items-center gap-2 font-mono text-xs text-slate-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                    <span className="text-red-400">D:{rec.pct.D}%</span>
                    <span className="text-amber-400">I:{rec.pct.I}%</span>
                    <span className="text-emerald-400">S:{rec.pct.S}%</span>
                    <span className="text-cyan-400">C:{rec.pct.C}%</span>
                  </div>

                  <button
                    onClick={() => onSelectRecord(rec)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/30 text-purple-200 text-xs font-medium transition cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Abrir Relatório
                  </button>

                  <button
                    onClick={() => onDeleteRecord(rec.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition cursor-pointer"
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
