import React, { useEffect, useMemo, useState } from 'react';
import { DiscLetter, EntryTechArea, PreviousBackground } from '../types/disc';
import { PROFILES } from '../data/discData';
import { TECH_GLOSSARY } from '../data/transitionData';
import {
  FileUser,
  Copy,
  Check,
  CheckSquare,
  Square,
  BookOpen,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  MessageSquareText,
} from 'lucide-react';

interface TransitionToolkitProps {
  name: string;
  dominant: DiscLetter;
  selectedBg: PreviousBackground;
  topAreas: (EntryTechArea & { matchScore: number })[];
}

const READINESS_STORAGE_KEY = 'disc_tech_readiness_checklist_v1';

const READINESS_STEPS = [
  {
    id: 'pick-area',
    title: 'Escolher 1 área principal para focar nos próximos 60 dias',
    detail: 'Evite dividir energia entre 3 trilhas diferentes ao mesmo tempo.',
  },
  {
    id: 'build-project',
    title: 'Concluir o 1º projeto prático sugerido no plano de 30 dias',
    detail: 'Um projeto simples e bem explicado vale mais do que dezenas de aulas sem prática.',
  },
  {
    id: 'publish-portfolio',
    title: 'Publicar o projeto no GitHub, Figma, Notion ou Power BI',
    detail: 'Escreva um resumo curto explicando qual problema resolveu e quais ferramentas usou.',
  },
  {
    id: 'update-linkedin',
    title: 'Atualizar título e seção "Sobre" do LinkedIn e Currículo',
    detail: 'Conecte explicitamente sua experiência anterior com a nova área de tecnologia.',
  },
  {
    id: 'first-applications',
    title: 'Enviar 3 candidaturas direcionadas (Estágio, Trainee ou Júnior)',
    detail: 'Priorize vagas compatíveis com seu nível inicial e acompanhe feedbacks.',
  },
];

const DISC_PITCH_STRENGTH: Record<DiscLetter, string> = {
  D: 'iniciativa para destravar problemas e foco em entregas objetivas',
  I: 'comunicação clara, empatia com usuários e facilidade de trabalhar em equipe',
  S: 'constância, organização de rotina e confiabilidade no trabalho em equipe',
  C: 'raciocínio analítico, atenção a detalhes e rigor com qualidade',
};

export const TransitionToolkit: React.FC<TransitionToolkitProps> = ({
  name,
  dominant,
  selectedBg,
  topAreas,
}) => {
  const [selectedAreaIdx, setSelectedAreaIdx] = useState(0);
  const [copiedField, setCopiedField] = useState<'headline' | 'about' | null>(null);
  const [glossaryOpen, setGlossaryOpen] = useState(false);

  const activeArea = topAreas[selectedAreaIdx] || topAreas[0];
  const profile = PROFILES[dominant];

  const defaultHeadline = useMemo(() => {
    if (!activeArea) return '';
    const primaryRole = activeArea.entryRoles[0] || activeArea.shortName;
    const toolsPreview = activeArea.freeTools.slice(0, 2).join(' | ');
    return `Em transição para ${activeArea.shortName} | ${primaryRole} | ${toolsPreview}`;
  }, [activeArea]);

  const defaultAbout = useMemo(() => {
    if (!activeArea) return '';
    const person = name.trim() ? `Olá, sou ${name.trim()}. ` : '';
    const skillHighlight = selectedBg.transferableSkills[0]?.toLowerCase() || 'resolução de problemas práticos';
    const bgSummary =
      selectedBg.id === 'first-job'
        ? 'Estou construindo minha entrada na área de tecnologia'
        : `Venho da área de ${selectedBg.label.toLowerCase()} e estou em transição para tecnologia`;

    return (
      `${person}${bgSummary}, com foco em ${activeArea.title}.\n\n` +
      `Trago como diferenciais ${skillHighlight} e um perfil comportamental ${profile.title} (${dominant}), marcado por ${DISC_PITCH_STRENGTH[dominant]}.\n\n` +
      `Atualmente sigo trilha prática com foco em ${activeArea.freeTools.slice(0, 3).join(', ')} e estou desenvolvendo projetos de portfólio voltados a problemas reais de negócio. Busco minha primeira oportunidade como ${activeArea.entryRoles[0] || 'profissional Júnior/Estágio'} para gerar valor desde o primeiro dia.`
    );
  }, [activeArea, name, selectedBg, profile.title, dominant]);

  const [aboutDraft, setAboutDraft] = useState(defaultAbout);

  useEffect(() => {
    setAboutDraft(defaultAbout);
  }, [defaultAbout]);

  const [checkedSteps, setCheckedSteps] = useState<Record<string, boolean>>(() => {
    if (typeof window === 'undefined') return {};
    try {
      const saved = localStorage.getItem(READINESS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(READINESS_STORAGE_KEY, JSON.stringify(checkedSteps));
      } catch {
        // ignore storage quota errors
      }
    }
  }, [checkedSteps]);

  const doneCount = READINESS_STEPS.filter((s) => checkedSteps[s.id]).length;
  const readinessPct = Math.round((doneCount / READINESS_STEPS.length) * 100);

  const toggleStep = (id: string) => {
    setCheckedSteps((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const resetChecklist = () => {
    setCheckedSteps({});
  };

  const handleCopy = async (text: string, field: 'headline' | 'about') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2200);
    } catch {
      // ignore clipboard restrictions
    }
  };

  if (!activeArea) return null;

  return (
    <div className="space-y-8">
      {/* A. Guia de Currículo e LinkedIn na Transição */}
      <section className="print-card bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <FileUser className="w-5 h-5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
              Como Adaptar seu Currículo e LinkedIn na Transição
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 max-w-2xl leading-relaxed">
              Modelo personalizado combinando seu perfil <strong className="font-semibold text-slate-900 dark:text-white">{profile.title} ({dominant})</strong>, sua bagagem anterior e a área escolhida. Edite livremente e copie para o seu perfil.
            </p>
          </div>

          {/* Switch among Top 3 areas */}
          <div
            role="group"
            aria-label="Escolher área para personalizar LinkedIn e currículo"
            className="flex flex-wrap items-center gap-1.5 no-print"
          >
            {topAreas.slice(0, 3).map((area, idx) => (
              <button
                key={area.id}
                type="button"
                aria-pressed={selectedAreaIdx === idx}
                onClick={() => setSelectedAreaIdx(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer whitespace-nowrap ${
                  selectedAreaIdx === idx
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                0{idx + 1}. {area.shortName}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Headline + Editable About */}
          <div className="lg:col-span-7 space-y-4">
            {/* Suggested LinkedIn Headline */}
            <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-slate-900 dark:text-white">
                  Sugestão de Título para o LinkedIn
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(defaultHeadline, 'headline')}
                  className="no-print inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
                >
                  {copiedField === 'headline' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                      Copiado
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                      Copiar título
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs sm:text-sm font-mono text-indigo-800 dark:text-indigo-300 leading-relaxed">
                {defaultHeadline}
              </p>
            </div>

            {/* Editable About / Summary */}
            <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <label
                  htmlFor="linkedin-about-editor"
                  className="text-xs font-semibold text-slate-900 dark:text-white"
                >
                  Resumo &quot;Sobre&quot; (editável para LinkedIn ou Currículo)
                </label>
                <button
                  type="button"
                  onClick={() => handleCopy(aboutDraft, 'about')}
                  className="no-print inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
                >
                  {copiedField === 'about' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                      Copiado
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                      Copiar resumo
                    </>
                  )}
                </button>
              </div>
              <textarea
                id="linkedin-about-editor"
                rows={6}
                value={aboutDraft}
                onChange={(e) => setAboutDraft(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed focus:border-indigo-500 focus:outline-none resize-y"
              />
            </div>
          </div>

          {/* Right: How to tell your story in interviews */}
          <div className="lg:col-span-5 p-5 rounded-xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-200/70 dark:border-indigo-500/30 space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
              <MessageSquareText className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" aria-hidden="true" />
              <span>Como contar sua história na entrevista</span>
            </div>

            <ol className="space-y-3 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              <li>
                <strong className="font-semibold text-indigo-700 dark:text-indigo-300 block mb-0.5">
                  1. Conecte o passado sem pedir desculpas
                </strong>
                Destaque que sua vivência em <strong>{selectedBg.label}</strong> já desenvolveu{' '}
                {selectedBg.transferableSkills[0]?.toLowerCase() || 'organização e visão prática'}.
              </li>
              <li>
                <strong className="font-semibold text-indigo-700 dark:text-indigo-300 block mb-0.5">
                  2. Explique a escolha com foco
                </strong>
                Mostre por que escolheu <strong>{activeArea.shortName}</strong>: combina com seu estilo{' '}
                {profile.title} ({DISC_PITCH_STRENGTH[dominant]}).
              </li>
              <li>
                <strong className="font-semibold text-indigo-700 dark:text-indigo-300 block mb-0.5">
                  3. Prove com prática real
                </strong>
                Em vez de falar apenas de cursos, mostre o projeto <em>&quot;{activeArea.starterProject.split(':')[0]}&quot;</em> e conte qual problema ele resolve.
              </li>
            </ol>
          </div>
        </div>
      </section>

      {/* B. Checklist de Prontidão para a 1ª Vaga */}
      <section className="print-card bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white">
              Checklist de Prontidão para a 1ª Vaga
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
              5 marcos práticos para sair da fase de estudos e começar a se candidatar com segurança. Seu progresso fica salvo neste navegador.
            </p>
          </div>

          <div className="w-full sm:w-56 space-y-1.5 shrink-0">
            <div className="flex items-center justify-between text-xs font-mono tabular-nums">
              <span className="text-slate-500 dark:text-slate-400">Prontidão</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {doneCount}/{READINESS_STEPS.length} ({readinessPct}%)
              </span>
            </div>
            <div
              role="progressbar"
              aria-label="Progresso de prontidão para a primeira vaga"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={readinessPct}
              className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden"
            >
              <div
                className="h-full bg-emerald-600 dark:bg-emerald-500 transition-all duration-300"
                style={{ width: `${readinessPct}%` }}
              />
            </div>
            {doneCount > 0 && (
              <button
                type="button"
                onClick={resetChecklist}
                className="no-print inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" aria-hidden="true" />
                Limpar checklist
              </button>
            )}
          </div>
        </div>

        <ul className="space-y-2.5">
          {READINESS_STEPS.map((step, idx) => {
            const done = Boolean(checkedSteps[step.id]);
            return (
              <li key={step.id}>
                <button
                  type="button"
                  aria-pressed={done}
                  onClick={() => toggleStep(step.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition cursor-pointer flex items-start gap-3 ${
                    done
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-500/30'
                      : 'bg-slate-50/60 dark:bg-slate-950/60 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  {done ? (
                    <CheckSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" aria-hidden="true" />
                  )}
                  <div className="space-y-0.5">
                    <div
                      className={`text-xs sm:text-sm font-semibold ${
                        done
                          ? 'line-through text-slate-500 dark:text-slate-400'
                          : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      0{idx + 1}. {step.title}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {step.detail}
                    </p>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      {/* C. Glossário Rápido de Termos de TI (sem jargão) */}
      <section className="bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-2xs no-print">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" aria-hidden="true" />
            <div>
              <h2 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
                Glossário Rápido de Termos de TI (sem jargão)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ficou em dúvida sobre alguma sigla do relatório ou do roadmap? Consulte aqui em 1 linha.
              </p>
            </div>
          </div>

          <button
            type="button"
            aria-expanded={glossaryOpen}
            onClick={() => setGlossaryOpen((prev) => !prev)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition cursor-pointer whitespace-nowrap"
          >
            {glossaryOpen ? (
              <>
                Ocultar glossário
                <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
              </>
            ) : (
              <>
                Ver {TECH_GLOSSARY.length} termos essenciais
                <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
              </>
            )}
          </button>
        </div>

        {glossaryOpen && (
          <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-5 pt-5 border-t border-slate-200/80 dark:border-slate-800">
            {TECH_GLOSSARY.map((item) => (
              <div
                key={item.term}
                className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800 space-y-1"
              >
                <dt className="text-xs font-mono font-semibold text-indigo-700 dark:text-indigo-300">
                  {item.term}
                </dt>
                <dd className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {item.meaning}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </section>
    </div>
  );
};
