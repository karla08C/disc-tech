import React, { useState, useEffect, useRef } from 'react';
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
  quizMode?: 'standard' | 'beginner';
}

export const AiCoachModal: React.FC<AiCoachModalProps> = ({
  isOpen,
  onClose,
  userName = '',
  dominant = 'D',
  pct = { D: 35, I: 25, S: 20, C: 20 },
  currentCareers = [],
  initialTargetRole,
  quizMode = 'beginner',
}) => {
  const [requestType, setRequestType] = useState<'pdi' | 'interview'>('pdi');
  const [targetRole, setTargetRole] = useState<string>(
    initialTargetRole || 'Primeira Vaga em Tecnologia (Júnior / Estágio)'
  );
  const [activeDominant, setActiveDominant] = useState<DiscLetter>(dominant);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
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

  useEffect(() => {
    if (!isOpen) return;
    const previousFocused = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const timer = window.setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 10);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      previousFocused?.focus?.();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const buildLocalCoachingFallback = (
    nameValue: string,
    dom: DiscLetter,
    scores: DiscPercentages,
    role: string,
    mode: 'pdi' | 'interview'
  ) => {
    const profileTitles: Record<DiscLetter, string> = {
      D: 'Executor / Direcionador (Dominância)',
      I: 'Comunicador / Catalisador (Influência)',
      S: 'Estável / Sustentador (Estabilidade)',
      C: 'Analítico / Estruturador (Conformidade)',
    };

    const blindSpots: Record<DiscLetter, string> = {
      D: 'impaciência com validações detalhadas e risco de decidir sem envolver pares técnicos',
      I: 'dispersão entre múltiplas frentes e subestimar documentação ou follow-ups técnicos',
      S: 'hesitação em confrontar escopo irreal ou atrasos de stakeholders em momentos críticos',
      C: 'busca excessiva por perfeição técnica antes de colocar incrementos em produção',
    };

    const roleName = role.trim() || 'Primeira Vaga em TI (Estágio / Júnior)';
    const userLabel = nameValue.trim() || 'Profissional em Transição';

    if (mode === 'interview') {
      return `### Treino de Entrevista (1ª Vaga / Transição) — ${userLabel}
Objetivo: ${roleName}
Perfil base: ${profileTitles[dom]} (D: ${scores.D}% | I: ${scores.I}% | S: ${scores.S}% | C: ${scores.C}%)

#### Pergunta 1 — Por que migrar para tecnologia agora?
"O que te motivou a escolher esta área e como sua experiência anterior ajuda neste novo desafio?"
- O que avaliam: clareza de propósito, capacidade de conectar habilidades transferíveis e interesse genuíno.
- Como estruturar sua resposta: conte brevemente o contexto anterior, a decisão de estudar a nova área e um exemplo real de problema que você já resolveu usando comunicação, análise ou organização.

#### Pergunta 2 — Aprendendo algo do zero
"Conte sobre uma ferramenta ou tarefa totalmente nova que você precisou aprender sozinho(a). Como superou as dificuldades?"
- O que avaliam: autonomia de estudo e como você lida com o ponto de atenção do seu perfil (${blindSpots[dom]}).
- Dica prática: use o seu 1º projeto de portfólio como exemplo concreto e explique o que aprendeu com os erros.

#### Pergunta 3 — Trabalho em equipe e feedback
"Descreva uma situação em que você recebeu uma crítica construtiva ou precisou alinhar expectativas com um grupo."
- O que avaliam: maturidade emocional, escuta ativa e postura colaborativa para vagas júnior ou estágio.`;
    }

    return `### Plano de Estudos e Entrada em TI (90 Dias) — ${userLabel}
Área / Objetivo: ${roleName}
Perfil base: ${profileTitles[dom]} (D: ${scores.D}% | I: ${scores.I}% | S: ${scores.S}% | C: ${scores.C}%)

#### 1. Como usar seu perfil ${dom} a favor da transição
- Sua vantagem natural: aproveitar seu estilo ${dom} para manter constância nos estudos e destacar conquistas de experiências anteriores.
- Cuidado principal no início: evitar ${blindSpots[dom]}.

#### 2. Plano Prático 30-60-90 Dias
- Dias 1 a 30 (Base + 1º Projeto): escolha apenas 1 trilha recomendada no roadmap.sh, estude 45 min/dia e construa um projeto simples resolvendo um problema real (mesmo pequeno).
- Dias 31 a 60 (Portfólio + LinkedIn): publique seu projeto com explicação clara de como você pensou a solução (no GitHub, Figma, Notion ou Power BI) e conecte sua bagagem anterior com a vaga alvo no currículo e LinkedIn.
- Dias 61 a 90 (Candidaturas + Entrevistas): candidate-se para vagas de Estágio, Trainee ou Júnior adequadas ao nível atual, peça revisão do portfólio para 2 pessoas da área e treine suas respostas de entrevista.

#### 3. Dica de Ouro para Quem Está Começando
- Consistência vence intensidade: 5 horas bem estruturadas por semana durante 3 meses valem mais do que tentar aprender 5 ferramentas ao mesmo tempo em um único fim de semana.`;
  };

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

      const contentType = res.headers.get('content-type') || '';
      if (!res.ok || !contentType.includes('application/json')) {
        setResult(
          buildLocalCoachingFallback(
            userName,
            activeDominant,
            pct,
            targetRole,
            requestType
          )
        );
        return;
      }

      const data = await res.json();
      if (data.content) {
        setResult(data.content);
      } else {
        setResult(
          buildLocalCoachingFallback(
            userName,
            activeDominant,
            pct,
            targetRole,
            requestType
          )
        );
      }
    } catch {
      setResult(
        buildLocalCoachingFallback(
          userName,
          activeDominant,
          pct,
          targetRole,
          requestType
        )
      );
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 dark:bg-black/80 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="ai-coach-modal-title"
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-xl overflow-hidden relative"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-slate-800 border border-indigo-200 dark:border-slate-700 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <BrainCircuit className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h3
                id="ai-coach-modal-title"
                className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2"
              >
                <span>Guia de Transição e Entrevista</span>
                <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                  · Apoio para 1ª Vaga
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Plano prático de 90 dias e treino de entrevista para {userName || 'você'}
              </p>
            </div>
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label="Fechar janela de plano e entrevista"
            className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                O que deseja gerar?
              </span>
              <div className="grid grid-cols-2 gap-2" role="group" aria-label="Tipo de guia">
                <button
                  type="button"
                  aria-pressed={requestType === 'pdi'}
                  onClick={() => setRequestType('pdi')}
                  className={`px-3 py-2 text-xs font-semibold rounded-lg border transition text-left flex items-center gap-1.5 cursor-pointer ${
                    requestType === 'pdi'
                      ? 'bg-indigo-50 dark:bg-indigo-600/20 border-indigo-500 text-indigo-900 dark:text-white'
                      : 'bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <BrainCircuit className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" aria-hidden="true" />
                  <span>Plano de 90 Dias</span>
                </button>
                <button
                  type="button"
                  aria-pressed={requestType === 'interview'}
                  onClick={() => setRequestType('interview')}
                  className={`px-3 py-2 text-xs font-semibold rounded-lg border transition text-left flex items-center gap-1.5 cursor-pointer ${
                    requestType === 'interview'
                      ? 'bg-indigo-50 dark:bg-indigo-600/20 border-indigo-500 text-indigo-900 dark:text-white'
                      : 'bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <MessageSquareCode className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" aria-hidden="true" />
                  <span>Treinar Entrevista (1ª Vaga)</span>
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="coach-target-role"
                className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5"
              >
                Área ou Vaga Alvo
              </label>
              <input
                id="coach-target-role"
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="Ex: Analista de Dados Jr, QA Júnior, UX Design..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Profile base hint */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span className="tabular-nums">
                Perfil base analisado:{' '}
                <strong className="text-slate-900 dark:text-white">
                  Perfil Dominante {activeDominant}
                </strong>{' '}
                (D:{pct.D}% I:{pct.I}% S:{pct.S}% C:{pct.C}%)
              </span>
            </div>
            <div className="flex items-center gap-1 font-mono text-[11px]" role="group" aria-label="Selecionar perfil dominante base">
              <span className="text-slate-500">Mudar perfil:</span>
              {(['D', 'I', 'S', 'C'] as DiscLetter[]).map((ltr) => (
                <button
                  key={ltr}
                  type="button"
                  aria-pressed={activeDominant === ltr}
                  onClick={() => setActiveDominant(ltr)}
                  className={`px-1.5 py-0.5 rounded border transition cursor-pointer ${
                    activeDominant === ltr
                      ? 'bg-indigo-600 text-white border-indigo-600 font-bold'
                      : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                  }`}
                >
                  {ltr}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl font-semibold text-xs tracking-wide bg-indigo-600 hover:bg-indigo-700 text-white border border-indigo-600/30 shadow-xs disabled:opacity-50 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {requestType === 'pdi'
                  ? 'Montando seu plano de 90 dias...'
                  : 'Montando perguntas para sua 1ª entrevista...'}
              </>
            ) : (
              <>
                <BrainCircuit className="w-4 h-4" />
                {result
                  ? `Regerar ${requestType === 'pdi' ? 'Plano de 90 Dias' : 'Treino de Entrevista'} para ${targetRole}`
                  : requestType === 'pdi'
                    ? 'Gerar Plano de 90 Dias'
                    : 'Gerar Perguntas de Entrevista (1ª Vaga)'}
              </>
            )}
          </button>

          <div aria-live="polite" className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-rose-50 dark:bg-red-950/40 border border-rose-200 dark:border-red-500/30 text-rose-700 dark:text-red-300 text-xs">
                {error}
              </div>
            )}

            {result && (
              <div className="mt-4 p-5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3 relative">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-xs font-mono text-indigo-700 dark:text-indigo-300 font-semibold">
                    {requestType === 'pdi' ? 'Plano de 90 Dias para ' : 'Treino de Entrevista (1ª Vaga) para '}
                    {userName || 'Profissional em Transição'} · {targetRole}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-2.5 py-1 rounded bg-white dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700/60 transition cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copiar Texto
                      </>
                    )}
                  </button>
                </div>

                <div className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans">
                  {result}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
          <span>DISC Tech 2.0 · Apoio para Iniciantes e Transição em TI</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
