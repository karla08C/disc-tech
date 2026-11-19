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
    initialTargetRole ||
      currentCareers[0] ||
      (quizMode === 'beginner' ? 'Primeira Vaga em Tecnologia (Júnior / Estágio)' : 'Tech Lead')
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

    const roleName = role.trim() || (quizMode === 'beginner' ? 'Primeira Vaga em TI' : 'Tech Lead');
    const userLabel = nameValue.trim() || 'Profissional em Transição';
    const isBeginnerPlan =
      quizMode === 'beginner' ||
      roleName.toLowerCase().includes('iniciante') ||
      roleName.toLowerCase().includes('transição') ||
      roleName.toLowerCase().includes('júnior') ||
      roleName.toLowerCase().includes('estágio');

    if (mode === 'interview') {
      if (isBeginnerPlan) {
        return `### Simulador de Entrevista (1ª Vaga / Transição) — ${userLabel}
Objetivo: ${roleName}
Perfil base: ${profileTitles[dom]} (D: ${scores.D}% | I: ${scores.I}% | S: ${scores.S}% | C: ${scores.C}%)

#### Pergunta 1 — Por que migrar para tecnologia agora?
"O que te motivou a escolher esta área e como sua experiência anterior ajuda neste novo desafio?"
- O que avaliam: clareza de propósito, capacidade de conectar habilidades transferíveis e interesse genuíno.
- Dica STAR: cite uma situação real do seu trabalho ou estudo anterior em que você resolveu um problema usando comunicação, análise ou organização.

#### Pergunta 2 — Aprendendo algo do zero
"Conte sobre uma ferramenta ou tarefa totalmente nova que você precisou aprender sozinho(a). Como superou as dificuldades?"
- O que avaliam: autonomia de estudo e como você lida com o ponto de atenção do seu perfil (${blindSpots[dom]}).

#### Pergunta 3 — Trabalho em equipe e feedback
"Descreva uma situação em que você recebeu uma crítica construtiva ou precisou alinhar expectativas com um grupo."
- O que avaliam: maturidade emocional, escuta ativa e postura colaborativa para vagas júnior ou estágio.`;
      }

      return `### Simulador STAR para ${userLabel} — ${roleName}
Perfil base: ${profileTitles[dom]} (D: ${scores.D}% | I: ${scores.I}% | S: ${scores.S}% | C: ${scores.C}%)

#### Pergunta 1 — Trade-off sob pressão
"Conte sobre uma situação em que você precisou decidir entre entregar rápido ou aprofundar a qualidade técnica. Como você conduziu a conversa com o time?"
- O que avaliam: clareza de critério e consciência do seu ponto de atenção (${blindSpots[dom]}).
- Estrutura STAR sugerida: contextualize o prazo e o impacto (S/T), descreva os critérios objetivos usados na decisão (A) e apresente métricas ou aprendizados pós-entrega (R).

#### Pergunta 2 — Conflito de alinhamento técnico
"Descreva um momento em que você discordou da abordagem de arquitetura ou priorização de outra pessoa da squad. Como resolveu?"
- O que avaliam: escuta ativa, argumentação baseada em dados e colaboração entre perfis diferentes.
- Estrutura STAR sugerida: foque em como você ouviu a perspectiva oposta antes de propor um experimento ou critério de decisão compartilhado.

#### Pergunta 3 — Evolução comportamental
"Qual feedback comportamental mais difícil você recebeu no último ano e o que mudou na sua rotina depois dele?"
- O que avaliam: maturidade de senioridade e capacidade de autorregulação no dia a dia.`;
    }

    if (isBeginnerPlan) {
      return `### Roteiro de Entrada e Transição (90 Dias) — ${userLabel}
Área / Objetivo: ${roleName}
Perfil base: ${profileTitles[dom]} (D: ${scores.D}% | I: ${scores.I}% | S: ${scores.S}% | C: ${scores.C}%)

#### 1. Como usar seu perfil ${dom} a favor da transição
- Sua vantagem natural: aproveitar seu estilo ${dom} para manter ritmo de estudo e destacar suas conquistas de experiências anteriores.
- Cuidado principal no início: evitar ${blindSpots[dom]}.

#### 2. Plano Prático 30-60-90 Dias
- Dias 1 a 30 (Base + 1º Projeto): escolha apenas 1 trilha recomendada no roadmap.sh, estude 45 min/dia e construa um projeto simples resolvendo um problema real (mesmo pequeno).
- Dias 31 a 60 (Portfólio + Visibilidade): publique seu projeto com explicação clara de como você pensou a solução (no GitHub, Figma, Notion ou LinkedIn) e conecte sua bagagem anterior com a vaga alvo.
- Dias 61 a 90 (Candidaturas + Simulações): aplique para vagas Júnior/Estágio/Trainee adequadas ao nível atual, peça revisão do portfólio para 2 pessoas da área e pratique entrevistas no Simulador STAR.

#### 3. Dica de Ouro para Quem Está Começando
- Consistência vence intensidade: 5 horas bem estruturadas por semana durante 3 meses valem mais do que tentar aprender 5 ferramentas ao mesmo tempo em um único fim de semana.`;
    }

    return `### Plano de Desenvolvimento Individual (PDI) — ${userLabel}
Perfil base: ${profileTitles[dom]} (D: ${scores.D}% | I: ${scores.I}% | S: ${scores.S}% | C: ${scores.C}%)
Objetivo de Carreira: ${roleName}

#### 1. Diagnóstico Comportamental na Prática
- Principal alavanca: usar seu estilo ${dom} para destravar entregas e dar clareza ao time rumo a ${roleName}.
- Ponto de atenção no dia a dia: monitorar ${blindSpots[dom]}.

#### 2. Plano de Ação 30-60-90 Dias
- Primeiros 30 dias: mapeie 2 situações reais de daily, code review ou refinement onde seu padrão comportamental gerou atrito ou atraso, e peça feedback direto a um par de confiança.
- Em 60 dias: pratique adaptar sua comunicação ao perfil do interlocutor (objetividade com perfil D, contexto e reconhecimento com perfil I, previsibilidade com perfil S e evidências técnicas com perfil C).
- Em 90 dias: lidere uma iniciativa transversal ligada a ${roleName} (ex.: RFC, melhoria de fluxo de entrega ou mentoria técnica) medindo impacto antes e depois.

#### 3. Leituras Recomendadas
- The Manager's Path — Camille Fournier
- Crucial Conversations — Kerry Patterson`;
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 dark:bg-black/80 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-xl overflow-hidden relative">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-slate-800 border border-indigo-200 dark:border-slate-700 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Tech Career Co-Pilot</span>
                <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                  · Plano de Carreira
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                PDI e mentoria comportamental para {userName || 'você'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                Modalidade de Mentoria
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRequestType('pdi')}
                  className={`px-3 py-2 text-xs font-semibold rounded-lg border transition text-left flex items-center gap-1.5 cursor-pointer ${
                    requestType === 'pdi'
                      ? 'bg-indigo-50 dark:bg-indigo-600/20 border-indigo-500 text-indigo-900 dark:text-white'
                      : 'bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <BrainCircuit className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  Plano PDI 90 Dias
                </button>
                <button
                  type="button"
                  onClick={() => setRequestType('interview')}
                  className={`px-3 py-2 text-xs font-semibold rounded-lg border transition text-left flex items-center gap-1.5 cursor-pointer ${
                    requestType === 'interview'
                      ? 'bg-indigo-50 dark:bg-indigo-600/20 border-indigo-500 text-indigo-900 dark:text-white'
                      : 'bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <MessageSquareCode className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  Simulador STAR
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                Cargo / Posição Alvo
              </label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="Ex: Tech Lead, Software Architect..."
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
            <div className="flex items-center gap-1 font-mono text-[11px]">
              <span className="text-slate-500">Mudar perfil:</span>
              {(['D', 'I', 'S', 'C'] as DiscLetter[]).map((ltr) => (
                <button
                  key={ltr}
                  type="button"
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
                Analisando competências e gerando {requestType === 'pdi' ? 'PDI' : 'entrevista'}...
              </>
            ) : (
              <>
                <BrainCircuit className="w-4 h-4" />
                {result
                  ? `Regerar ${requestType === 'pdi' ? 'PDI' : 'Simulador'} para ${targetRole}`
                  : `Gerar ${requestType === 'pdi' ? 'PDI Personalizado' : 'Perguntas STAR'}`}
              </>
            )}
          </button>

          {error && (
            <div className="p-3 rounded-lg bg-rose-50 dark:bg-red-950/40 border border-rose-200 dark:border-red-500/30 text-rose-700 dark:text-red-300 text-xs">
              {error}
            </div>
          )}

          {result && (
            <div className="mt-4 p-5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3 relative">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <span className="text-xs font-mono text-indigo-700 dark:text-indigo-300 font-semibold">
                  {requestType === 'pdi' ? 'PDI Gerado para ' : 'Simulação de Entrevista para '}
                  {userName || 'Profissional Tech'} · {targetRole}
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
                      Copiar Markdown
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

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
          <span>DISC Tech 2.0 · Mentoria Comportamental para TI</span>
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
