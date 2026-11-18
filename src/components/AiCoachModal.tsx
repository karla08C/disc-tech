import React, { useState, useEffect } from 'react';
import { DiscLetter, DiscPercentages } from '../types/disc';
import { BrainCircuit, MessageSquareCode, Copy, Check, X, Loader2, Info } from 'lucide-react';

interface AiCoachModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
  dominant?: DiscLetter;
  pct?: DiscPercentages;
  currentCareers?: string[];
  initialTargetRole?: string;
}

export const AiCoachModal: React.FC<AiCoachModalProps> = ({
  isOpen,
  onClose,
  userName = '',
  dominant = 'D',
  pct = { D: 35, I: 25, S: 20, C: 20 },
  currentCareers = [],
  initialTargetRole,
}) => {
  const [requestType, setRequestType] = useState<'pdi' | 'interview'>('pdi');
  const [targetRole, setTargetRole] = useState<string>(
    initialTargetRole || currentCareers[0] || 'Tech Lead'
  );
  const [activeDominant, setActiveDominant] = useState<DiscLetter>(dominant);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialTargetRole) {
      setTargetRole(initialTargetRole);
    }
    if (dominant) {
      setActiveDominant(dominant);
    }
  }, [initialTargetRole, dominant, isOpen]);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/ai/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userName || 'Profissional Tech',
          dominant: activeDominant,
          pct,
          targetRole,
          requestType,
        }),
      });

      const data = await res.json();
      if (data.content) {
        setResult(data.content);
      } else {
        setError('Não foi possível gerar a resposta. Tente novamente.');
      }
    } catch (err: any) {
      console.error('Failed to generate AI plan:', err);
      setError('Erro de conexão com o mentor IA.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 text-indigo-400 flex items-center justify-center">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Tech Career Co-Pilot com IA
                <span className="text-[10px] font-mono uppercase bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                  Gemini Powered
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                PDI e mentoria comportamental para {userName || 'você'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-800/40 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                Modalidade de Mentoria
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRequestType('pdi')}
                  className={`px-3 py-2 text-xs font-semibold rounded-lg border transition text-left flex items-center gap-1.5 cursor-pointer ${
                    requestType === 'pdi'
                      ? 'bg-indigo-600/20 border-indigo-500 text-white'
                      : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <BrainCircuit className="w-3.5 h-3.5 text-indigo-400" />
                  Plano PDI 90 Dias
                </button>
                <button
                  type="button"
                  onClick={() => setRequestType('interview')}
                  className={`px-3 py-2 text-xs font-semibold rounded-lg border transition text-left flex items-center gap-1.5 cursor-pointer ${
                    requestType === 'interview'
                      ? 'bg-indigo-600/20 border-indigo-500 text-white'
                      : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <MessageSquareCode className="w-3.5 h-3.5 text-indigo-400" />
                  Simulador STAR
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                Cargo / Posição Alvo
              </label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="Ex: Tech Lead, Software Architect..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-800 bg-slate-950 text-slate-100 placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Profile base hint */}
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>
                Perfil base analisado: <strong className="text-white">Perfil Dominante {activeDominant}</strong> (D:{pct.D}% I:{pct.I}% S:{pct.S}% C:{pct.C}%)
              </span>
            </div>
            <div className="flex items-center gap-1 font-mono text-[11px]">
              <span className="text-slate-500">Mudar perfil:</span>
              {(['D', 'I', 'S', 'C'] as DiscLetter[]).map((ltr) => (
                <button
                  key={ltr}
                  onClick={() => setActiveDominant(ltr)}
                  className={`px-1.5 py-0.5 rounded border transition cursor-pointer ${
                    activeDominant === ltr
                      ? 'bg-indigo-600 text-white border-indigo-500 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {ltr}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl font-semibold text-xs tracking-wide bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-500/40 shadow-sm disabled:opacity-50 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analisando competências e gerando {requestType === 'pdi' ? 'PDI' : 'entrevista'} com IA...
              </>
            ) : (
              <>
                <BrainCircuit className="w-4 h-4" />
                {result ? `Regerar ${requestType === 'pdi' ? 'PDI' : 'Simulador'} para ${targetRole}` : `Gerar ${requestType === 'pdi' ? 'PDI Personalizado' : 'Perguntas STAR'} com IA`}
              </>
            )}
          </button>

          {error && (
            <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/30 text-red-300 text-xs">
              {error}
            </div>
          )}

          {/* Generated Result Display */}
          {result && (
            <div className="mt-4 p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3 relative">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-mono text-indigo-300 uppercase tracking-wider">
                  {requestType === 'pdi' ? 'PDI Gerado para ' : 'Simulação de Entrevista para '} {userName || 'Profissional Tech'} • {targetRole}
                </span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded bg-slate-800/60 border border-slate-700/60 transition cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copiar Markdown
                    </>
                  )}
                </button>
              </div>

              <div className="prose prose-invert prose-xs max-w-none text-slate-300 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans">
                {result}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
          <span>DISC Tech 2.0 • Mentoria Comportamental para TI</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-900 transition cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
