import React, { useMemo, useState, useEffect } from 'react';
import { DiscLetter, DiscPercentages } from '../types/disc';
import {
  ROADMAP_SH_DESIGN_HUB_URL,
  ResultAreaInput,
  getRoadmapsForResultAreas,
  getDesignRoadmaps,
} from '../data/roadmapData';
import {
  Route,
  Palette,
  ExternalLink,
  CheckSquare,
  Square,
  Compass,
  RotateCcw,
} from 'lucide-react';

interface RoadmapSectionProps {
  dominant: DiscLetter;
  pct: DiscPercentages;
  resultAreas: ResultAreaInput[];
  selectedAreaId?: string | null;
  onSelectAreaId?: (areaId: string) => void;
}

const STORAGE_KEY = 'disc_tech_roadmap_progress';

export const RoadmapSection: React.FC<RoadmapSectionProps> = ({
  dominant,
  pct,
  resultAreas,
  selectedAreaId,
  onSelectAreaId,
}) => {
  const [groupMode, setGroupMode] = useState<'result' | 'design'>('result');

  const hasDesignAffinity = useMemo(
    () =>
      dominant === 'I' ||
      resultAreas.some((a) =>
        ['ux-ui-design', 'frontend-entry', 'product-agile'].includes(a.id)
      ),
    [dominant, resultAreas]
  );

  const resultTracks = useMemo(
    () => getRoadmapsForResultAreas(resultAreas),
    [resultAreas]
  );
  const designTracks = useMemo(() => getDesignRoadmaps(pct), [pct]);

  const [selectedDesignId, setSelectedDesignId] = useState<string>(
    designTracks[0]?.id || 'ux-design'
  );

  // Sync to #01 result area whenever resultAreas change and no explicit selection matches
  const activeResultTrack = useMemo(() => {
    if (selectedAreaId) {
      const found = resultTracks.find((t) => t.areaId === selectedAreaId);
      if (found) return found;
    }
    return resultTracks[0];
  }, [resultTracks, selectedAreaId]);

  const activeDesignTrack = useMemo(() => {
    return designTracks.find((t) => t.id === selectedDesignId) || designTracks[0];
  }, [designTracks, selectedDesignId]);

  // If user clicked "Ver roadmap" on a specific result card, or has no design affinity, stay in 'result' mode
  useEffect(() => {
    if (!hasDesignAffinity) {
      setGroupMode('result');
      return;
    }
    if (selectedAreaId && resultTracks.some((t) => t.areaId === selectedAreaId)) {
      setGroupMode('result');
    }
  }, [hasDesignAffinity, selectedAreaId, resultTracks]);

  const [completedTopics, setCompletedTopics] = useState<Record<string, boolean>>(() => {
    if (typeof window === 'undefined') return {};
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(completedTopics));
      } catch {
        // ignore storage quota errors
      }
    }
  }, [completedTopics]);

  const activeTrack = groupMode === 'design' ? activeDesignTrack : activeResultTrack;
  if (!activeTrack) return null;

  const totalTopics = activeTrack.stages.reduce((acc, st) => acc + st.topics.length, 0);
  const doneTopics = activeTrack.stages.reduce(
    (acc, st, sIdx) =>
      acc +
      st.topics.filter((_, tIdx) => Boolean(completedTopics[`${activeTrack.id}:${sIdx}:${tIdx}`]))
        .length,
    0
  );
  const completionPct = totalTopics > 0 ? Math.round((doneTopics / totalTopics) * 100) : 0;

  const toggleTopic = (stageIdx: number, topicIdx: number) => {
    const key = `${activeTrack.id}:${stageIdx}:${topicIdx}`;
    setCompletedTopics((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const resetTrackProgress = () => {
    setCompletedTopics((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((k) => {
        if (k.startsWith(`${activeTrack.id}:`)) {
          delete next[k];
        }
      });
      return next;
    });
  };

  const activeAreaLabel =
    groupMode === 'result' && activeResultTrack
      ? `Área #0${activeResultTrack.rankIndex} do Resultado: ${activeResultTrack.areaTitle}`
      : activeTrack.categoryLabel;

  return (
    <div
      id="result-roadmap"
      className="bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 scroll-mt-20 shadow-2xs"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1.5">
            <Route className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
              Roadmap Gerado com Base na Área do Seu Resultado
            </span>
            <span aria-hidden="true">·</span>
            <a
              href={hasDesignAffinity ? ROADMAP_SH_DESIGN_HUB_URL : 'https://roadmap.sh/roadmaps'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-300 underline underline-offset-2 transition"
            >
              <span>{hasDesignAffinity ? 'Coleção Design (roadmap.sh)' : 'Ver todas as trilhas no roadmap.sh'}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white">
            {groupMode === 'result' && activeResultTrack
              ? `Roadmap da Área Recomendada: ${activeResultTrack.areaTitle}`
              : `Roadmap de Design: ${activeTrack.title}`}
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 max-w-2xl leading-relaxed">
            {groupMode === 'result' ? (
              <>
                Conectado diretamente às 3 portas de entrada recomendadas para o seu perfil. Selecione abaixo qualquer uma das áreas do seu resultado para acompanhar o passo a passo oficial no{' '}
                <strong className="font-semibold text-slate-900 dark:text-white">roadmap.sh</strong>.
              </>
            ) : (
              <>
                Explore as trilhas oficiais de Design do{' '}
                <strong className="font-semibold text-slate-900 dark:text-white">roadmap.sh/roadmaps?g=Design</strong>{' '}
                (UX Design, Product Design e Design System) adaptadas ao seu perfil DISC.
              </>
            )}
          </p>
        </div>

        {/* Category Switcher — shown when profile has visual/design/product affinity */}
        {hasDesignAffinity && (
          <div
            role="group"
            aria-label="Selecionar origem dos roadmaps"
            className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 rounded-xl shrink-0 self-start no-print"
          >
            <button
              type="button"
              aria-pressed={groupMode === 'result'}
              onClick={() => setGroupMode('result')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
                groupMode === 'result'
                  ? 'bg-white dark:bg-indigo-600 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Compass className="w-3.5 h-3.5" aria-hidden="true" />
              Áreas do meu Resultado
            </button>
            <button
              type="button"
              aria-pressed={groupMode === 'design'}
              onClick={() => setGroupMode('design')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
                groupMode === 'design'
                  ? 'bg-white dark:bg-indigo-600 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Palette className="w-3.5 h-3.5" aria-hidden="true" />
              Roadmaps de Design
            </button>
          </div>
        )}
      </div>

      {/* Track Selector Tabs */}
      <div
        role="group"
        aria-label="Selecionar trilha de roadmap"
        className="flex flex-wrap items-center gap-2 no-print"
      >
        {groupMode === 'result'
          ? resultTracks.map((track) => {
              const isSelected = track.areaId === activeResultTrack?.areaId;
              return (
                <button
                  key={track.areaId}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => onSelectAreaId?.(track.areaId)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer flex items-center gap-2 ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                      : 'bg-slate-50/70 dark:bg-slate-950/80 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <span className="font-mono opacity-80">0{track.rankIndex}.</span>
                  <span>{track.areaTitle}</span>
                  <span
                    className={`font-mono tabular-nums text-[11px] ${
                      isSelected ? 'text-indigo-100' : 'text-emerald-700 dark:text-emerald-400'
                    }`}
                  >
                    {track.matchScore}%
                  </span>
                </button>
              );
            })
          : designTracks.map((track) => {
              const isSelected = track.id === activeDesignTrack?.id;
              return (
                <button
                  key={track.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setSelectedDesignId(track.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer flex items-center gap-2 ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                      : 'bg-slate-50/70 dark:bg-slate-950/80 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <span>{track.title}</span>
                  <span
                    className={`font-mono tabular-nums text-[11px] ${
                      isSelected ? 'text-indigo-100' : 'text-emerald-700 dark:text-emerald-400'
                    }`}
                  >
                    {track.matchScore}%
                  </span>
                </button>
              );
            })}
      </div>

      {/* Active Track Summary & Progress */}
      <div className="p-5 sm:p-6 rounded-xl bg-slate-50/50 dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800 space-y-5">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-indigo-700 dark:text-indigo-300">
                {activeAreaLabel}
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums text-emerald-700 dark:text-emerald-400 font-semibold">
                {activeTrack.matchScore}% aderência ao seu perfil ({dominant})
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white">
              Trilha Base: {activeTrack.title} (roadmap.sh)
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
              {activeTrack.overview}
            </p>

            <div className="p-3.5 rounded-xl bg-white dark:bg-indigo-950/25 border border-indigo-200/70 dark:border-indigo-500/30 text-xs text-slate-700 dark:text-indigo-200 leading-relaxed">
              <strong className="font-semibold text-indigo-700 dark:text-indigo-300">
                Como estudar esta área com seu perfil {dominant}:
              </strong>{' '}
              {activeTrack.discAdvice[dominant]}
            </div>
          </div>

          <div className="flex flex-col items-stretch sm:items-end gap-2.5 shrink-0 no-print">
            <a
              href={activeTrack.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 text-white transition whitespace-nowrap"
            >
              <span>Abrir trilha no roadmap.sh</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <div className="w-full sm:w-52 space-y-1">
              <div className="flex items-center justify-between text-[11px] font-mono tabular-nums text-slate-500 dark:text-slate-400">
                <span>Progresso na trilha</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {doneTopics}/{totalTopics} ({completionPct}%)
                </span>
              </div>
              <div
                role="progressbar"
                aria-label="Progresso na trilha de estudos"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={completionPct}
                className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden"
              >
                <div
                  className="h-full bg-emerald-600 dark:bg-emerald-500 transition-all duration-300"
                  style={{ width: `${completionPct}%` }}
                />
              </div>
              {doneTopics > 0 && (
                <button
                  type="button"
                  onClick={resetTrackProgress}
                  className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-900 dark:hover:text-white transition cursor-pointer mt-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  Limpar marcações desta trilha
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stages Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-slate-200/80 dark:border-slate-800">
          {activeTrack.stages.map((stage, sIdx) => (
            <div
              key={stage.step}
              className="print-card p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="text-[11px] font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                  Etapa {stage.step}
                </div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                  {stage.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {stage.summary}
                </p>
              </div>

              <ul className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800/80">
                {stage.topics.map((topic, tIdx) => {
                  const checked = Boolean(completedTopics[`${activeTrack.id}:${sIdx}:${tIdx}`]);
                  return (
                    <li key={tIdx}>
                      <button
                        type="button"
                        aria-pressed={checked}
                        onClick={() => toggleTopic(sIdx, tIdx)}
                        className="w-full text-left flex items-start gap-2 text-xs transition cursor-pointer group"
                      >
                        {checked ? (
                          <CheckSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 shrink-0 mt-0.5" aria-hidden="true" />
                        )}
                        <span
                          className={`leading-relaxed ${
                            checked
                              ? 'line-through text-slate-400 dark:text-slate-500'
                              : 'text-slate-700 dark:text-slate-300 group-hover:text-slate-950 dark:group-hover:text-white'
                          }`}
                        >
                          {topic}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
