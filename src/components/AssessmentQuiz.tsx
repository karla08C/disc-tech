import React, { useState, useEffect } from 'react';
import { DiscLetter, QuizMode } from '../types/disc';
import { QUESTIONS } from '../data/discData';
import { BEGINNER_QUESTIONS, BEGINNER_CATEGORIES_BY_ID } from '../data/transitionData';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

interface AssessmentQuizProps {
  userName: string;
  quizMode?: QuizMode;
  onComplete: (answers: DiscLetter[]) => void;
  onCancel: () => void;
}

const CATEGORIES_BY_ID: Record<number, string> = {
  1: "Novo Projeto & Iniciativa",
  2: "Gestão de Crise & Produção",
  3: "Daily & Comunicação de Squad",
  4: "Curva de Aprendizado & Stack",
  5: "Propósito & Conquistas",
  6: "Conflitos Técnicos & Relações",
  7: "Entrevistas & Avaliação Técnica",
  8: "Code Review & Qualidade",
  9: "Mudança de Prioridade & Agilidade",
  10: "Documentação & Governança",
  11: "Hackathons & Pressão",
  12: "Ambiente Ideal de Trabalho",
  13: "Feedback & Evolução",
  14: "Apresentações para Stakeholders",
  15: "Débito Técnico & Legado",
  16: "Fatores de Motivação",
  17: "Planning Poker & Estimativas",
  18: "Pontos Cegos & Receios",
  19: "Pull Request & Rigor",
  20: "Planejamento de Carreira",
};

export const AssessmentQuiz: React.FC<AssessmentQuizProps> = ({
  userName,
  quizMode = 'beginner',
  onComplete,
  onCancel,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<DiscLetter[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const activeQuestions = quizMode === 'beginner' ? BEGINNER_QUESTIONS : QUESTIONS;
  const activeCategories = quizMode === 'beginner' ? BEGINNER_CATEGORIES_BY_ID : CATEGORIES_BY_ID;

  const currentQuestion = activeQuestions[currentIndex];
  const progressPct = Math.round((currentIndex / activeQuestions.length) * 100);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (['1', '2', '3', '4'].includes(e.key)) {
        const optionIndex = parseInt(e.key, 10) - 1;
        if (currentQuestion.options[optionIndex]) {
          handleSelectOption(optionIndex);
        }
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, currentQuestion, answers]);

  const handleSelectOption = (idx: number) => {
    setSelectedOption(idx);
    const chosenLetter = currentQuestion.options[idx].letter;

    const newAnswers = [...answers];
    newAnswers[currentIndex] = chosenLetter;
    setAnswers(newAnswers);

    setTimeout(async () => {
      setSelectedOption(null);
      if (currentIndex + 1 < activeQuestions.length) {
        setCurrentIndex(currentIndex + 1);
      } else {
        const prefersReducedMotion =
          typeof window !== 'undefined' &&
          window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!prefersReducedMotion) {
          try {
            const { default: confetti } = await import('canvas-confetti');
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#ef4444', '#f59e0b', '#10b981', '#06b6d4', '#4f46e5'],
            });
          } catch {
            // ignore if canvas not supported
          }
        }
        onComplete(newAnswers);
      }
    }, 280);
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSelectedOption(null);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8">
      <div className="sr-only" aria-live="polite">
        Pergunta {currentIndex + 1} de {activeQuestions.length}: {currentQuestion.prompt}
      </div>

      {/* Top Header & Progress */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-400 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-indigo-600 dark:text-indigo-300 font-medium">
              {quizMode === 'beginner' ? 'Modo Iniciante & Transição' : 'Modo Profissional Tech'}
            </span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-700 dark:text-slate-300 font-mono text-[11px]">
              {activeCategories[currentQuestion.id] || 'Cenário'}
            </span>
            <span aria-hidden="true">·</span>
            <span>
              Respondendo como{' '}
              <strong className="text-slate-900 dark:text-slate-200">
                {userName || 'Visitante'}
              </strong>
            </span>
          </div>
          <div className="font-mono tabular-nums text-indigo-600 dark:text-indigo-300 font-semibold">
            {currentIndex + 1} de {activeQuestions.length} ({progressPct}%)
          </div>
        </div>

        {/* Progress bar */}
        <div
          role="progressbar"
          aria-label="Progresso da avaliação"
          aria-valuemin={1}
          aria-valuemax={activeQuestions.length}
          aria-valuenow={currentIndex + 1}
          className="w-full h-2 bg-slate-200 dark:bg-slate-800/80 rounded-full overflow-hidden border border-slate-300/60 dark:border-slate-700/50"
        >
          <div
            className="h-full bg-indigo-600 dark:bg-indigo-500 transition-all duration-300 ease-out"
            style={{ width: `${((currentIndex + 1) / activeQuestions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xs relative overflow-hidden">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-900 dark:text-slate-200 flex items-center justify-center font-mono font-semibold text-base shrink-0 tabular-nums">
            {currentQuestion.id}
          </div>
          <h2 className="text-lg sm:text-2xl font-semibold text-slate-900 dark:text-white leading-relaxed">
            {currentQuestion.prompt}
          </h2>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
          {quizMode === 'beginner'
            ? 'Escolha a alternativa que mais combina com a sua forma natural de agir no dia a dia:'
            : 'Escolha a alternativa que mais reflete sua reação genuína na rotina real de tecnologia:'}
        </p>

        {/* Options Grid */}
        <div role="radiogroup" aria-label={currentQuestion.prompt} className="space-y-3">
          {currentQuestion.options.map((option, idx) => {
            const isCurrentlySelected = selectedOption === idx;
            const letter = option.letter;

            const letterColorMap: Record<DiscLetter, string> = {
              D: 'group-hover:border-rose-400 dark:group-hover:border-rose-500/50 group-hover:bg-rose-50/50 dark:group-hover:bg-rose-950/10',
              I: 'group-hover:border-amber-400 dark:group-hover:border-amber-500/50 group-hover:bg-amber-50/50 dark:group-hover:bg-amber-950/10',
              S: 'group-hover:border-emerald-400 dark:group-hover:border-emerald-500/50 group-hover:bg-emerald-50/50 dark:group-hover:bg-emerald-950/10',
              C: 'group-hover:border-sky-400 dark:group-hover:border-sky-500/50 group-hover:bg-sky-50/50 dark:group-hover:bg-sky-950/10',
            };

            const keyColorMap: Record<number, string> = {
              0: 'bg-rose-50/80 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-200/80 dark:border-rose-500/30',
              1: 'bg-amber-50/80 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-200/80 dark:border-amber-500/30',
              2: 'bg-emerald-50/80 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-500/30',
              3: 'bg-sky-50/80 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-200/80 dark:border-sky-500/30',
            };

            return (
              <button
                key={idx}
                type="button"
                role="radio"
                aria-checked={isCurrentlySelected}
                onClick={() => handleSelectOption(idx)}
                className={`group w-full text-left p-4 sm:p-5 rounded-xl border transition-all duration-150 flex items-center gap-4 cursor-pointer relative ${
                  isCurrentlySelected
                    ? 'border-indigo-500 bg-indigo-50/70 dark:bg-slate-800/80 shadow-2xs'
                    : 'border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/60 hover:bg-white dark:hover:bg-slate-800/40'
                } ${letterColorMap[letter]}`}
              >
                <div
                  className={`w-7 h-7 rounded-lg border flex items-center justify-center text-xs font-mono font-semibold shrink-0 transition-colors ${
                    isCurrentlySelected
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : keyColorMap[idx]
                  }`}
                >
                  {idx + 1}
                </div>

                <div className="flex-1 text-sm sm:text-base text-slate-800 dark:text-slate-200 font-normal group-hover:text-slate-950 dark:group-hover:text-white transition-colors">
                  {option.text}
                </div>

                <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer controls & Shortcuts hint */}
        <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            {currentIndex > 0 ? (
              <button
                type="button"
                onClick={handlePrev}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700 transition cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Voltar anterior
              </button>
            ) : (
              <button
                type="button"
                onClick={onCancel}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition cursor-pointer"
              >
                Cancelar teste
              </button>
            )}
          </div>

          <div className="hidden sm:flex items-center gap-2 text-slate-500 font-mono text-[11px]">
            <span>Atalho rápido: pressione</span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold">1</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold">2</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold">3</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold">4</kbd>
          </div>
        </div>
      </div>
    </div>
  );
};
