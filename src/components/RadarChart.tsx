import React, { useState, useMemo, useEffect } from 'react';
import * as d3 from 'd3';
import { DiscLetter, DiscPercentages } from '../types/disc';
import { BENCHMARK_PROFILES } from '../data/discData';

interface RadarChartProps {
  pct: DiscPercentages;
  showBenchmark?: boolean;
  benchmarkProfileId?: 'pleno' | 'senior' | 'industry';
  size?: number;
  interactive?: boolean;
  onBenchmarkChange?: (id: 'pleno' | 'senior' | 'industry') => void;
}

interface AxisConfig {
  key: DiscLetter;
  name: string;
  letter: DiscLetter;
  angle: number;
  color: string;
  techRoleExplanation: string;
  userScore: number;
  benchmarkScore: number;
}

export const RadarChart: React.FC<RadarChartProps> = ({
  pct,
  showBenchmark = true,
  benchmarkProfileId = 'pleno',
  size = 360,
  interactive = true,
  onBenchmarkChange,
}) => {
  const [activeBenchmarkId, setActiveBenchmarkId] = useState<'pleno' | 'senior' | 'industry'>(benchmarkProfileId);
  const [hoveredAxis, setHoveredAxis] = useState<DiscLetter | null>(null);
  const [pinnedAxis, setPinnedAxis] = useState<DiscLetter | null>(null);

  useEffect(() => {
    setActiveBenchmarkId(benchmarkProfileId);
  }, [benchmarkProfileId]);

  const currentBenchmark = useMemo(() => {
    return BENCHMARK_PROFILES[activeBenchmarkId] || BENCHMARK_PROFILES.pleno;
  }, [activeBenchmarkId]);

  const handleBenchmarkSelect = (id: 'pleno' | 'senior' | 'industry') => {
    setActiveBenchmarkId(id);
    if (onBenchmarkChange) {
      onBenchmarkChange(id);
    }
  };

  const vbWidth = 440;
  const vbHeight = 340;
  const cx = vbWidth / 2;
  const cy = vbHeight / 2;
  const radius = 104;

  const scaleMax = useMemo(() => {
    const userPeak = Math.max(pct.D || 0, pct.I || 0, pct.S || 0, pct.C || 0);
    const benchPeak = showBenchmark
      ? Math.max(
          currentBenchmark.scores.D,
          currentBenchmark.scores.I,
          currentBenchmark.scores.S,
          currentBenchmark.scores.C
        )
      : 0;
    const peak = Math.max(userPeak, benchPeak);

    if (peak <= 36) return 40;
    if (peak <= 54) return 60;
    if (peak <= 74) return 80;
    return 100;
  }, [pct, currentBenchmark, showBenchmark]);

  const gridLevels = useMemo(() => {
    return [scaleMax * 0.25, scaleMax * 0.5, scaleMax * 0.75, scaleMax];
  }, [scaleMax]);

  const rScale = useMemo(() => {
    return d3.scaleLinear().domain([0, scaleMax]).range([0, radius]);
  }, [scaleMax, radius]);

  const axes: AxisConfig[] = useMemo(() => {
    return [
      {
        key: 'D',
        name: 'Dominância',
        letter: 'D',
        angle: -Math.PI / 2,
        color: '#e11d48',
        techRoleExplanation: 'Autonomia na sprint para destravar blockers e tomar decisões de entrega.',
        userScore: pct.D || 0,
        benchmarkScore: currentBenchmark.scores.D,
      },
      {
        key: 'I',
        name: 'Influência',
        letter: 'I',
        angle: 0,
        color: '#d97706',
        techRoleExplanation: 'Comunicação construtiva em dailies, code reviews e alinhamento com produto.',
        userScore: pct.I || 0,
        benchmarkScore: currentBenchmark.scores.I,
      },
      {
        key: 'S',
        name: 'Estabilidade',
        letter: 'S',
        angle: Math.PI / 2,
        color: '#059669',
        techRoleExplanation: 'Consistência de entregas, previsibilidade de rotina e resiliência com legados.',
        userScore: pct.S || 0,
        benchmarkScore: currentBenchmark.scores.S,
      },
      {
        key: 'C',
        name: 'Conformidade',
        letter: 'C',
        angle: Math.PI,
        color: '#0284c7',
        techRoleExplanation: 'Rigor com testes unitários, padrões arquiteturais, segurança e edge cases.',
        userScore: pct.C || 0,
        benchmarkScore: currentBenchmark.scores.C,
      },
    ];
  }, [pct, currentBenchmark]);

  const getCoordinates = (angle: number, value: number) => {
    const clamped = Math.min(scaleMax, Math.max(0, value));
    const r = rScale(clamped);
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  };

  const userCoordinates = useMemo(() => {
    return axes.map((a) => getCoordinates(a.angle, a.userScore));
  }, [axes, rScale, scaleMax]);

  const benchmarkCoordinates = useMemo(() => {
    return axes.map((a) => getCoordinates(a.angle, a.benchmarkScore));
  }, [axes, rScale, scaleMax]);

  const userPath = useMemo(() => {
    return (
      userCoordinates
        .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
        .join(' ') + ' Z'
    );
  }, [userCoordinates]);

  const benchmarkPath = useMemo(() => {
    return (
      benchmarkCoordinates
        .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
        .join(' ') + ' Z'
    );
  }, [benchmarkCoordinates]);

  const adherence = useMemo(() => {
    let diffSum = 0;
    (['D', 'I', 'S', 'C'] as DiscLetter[]).forEach((k) => {
      diffSum += Math.abs(pct[k] - currentBenchmark.scores[k]);
    });
    return Math.max(0, Math.round(100 - diffSum / 2));
  }, [pct, currentBenchmark]);

  const inspectedAxisKey = hoveredAxis || pinnedAxis;
  const inspectedAxis = useMemo(
    () => axes.find((x) => x.key === inspectedAxisKey) || null,
    [axes, inspectedAxisKey]
  );

  const maxContainerWidth = size >= 320 ? 440 : Math.max(size + 110, 340);

  return (
    <div className="flex flex-col items-center w-full mx-auto" style={{ maxWidth: maxContainerWidth }}>
      {/* Benchmark Selector Segmented Control */}
      {showBenchmark && (
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl mb-3 text-xs">
          <button
            type="button"
            onClick={() => handleBenchmarkSelect('pleno')}
            className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer whitespace-nowrap ${
              activeBenchmarkId === 'pleno'
                ? 'bg-white dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-500/40 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-transparent'
            }`}
          >
            Dev Pleno (Ideal)
          </button>
          <button
            type="button"
            onClick={() => handleBenchmarkSelect('senior')}
            className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer whitespace-nowrap ${
              activeBenchmarkId === 'senior'
                ? 'bg-white dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-500/40 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-transparent'
            }`}
          >
            Dev Sênior
          </button>
          <button
            type="button"
            onClick={() => handleBenchmarkSelect('industry')}
            className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer whitespace-nowrap ${
              activeBenchmarkId === 'industry'
                ? 'bg-white dark:bg-sky-500/20 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-500/40 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-transparent'
            }`}
          >
            Média Tech
          </button>
        </div>
      )}

      {/* Responsive SVG Radar Canvas */}
      <div className="w-full relative select-none">
        <svg
          viewBox={`0 0 ${vbWidth} ${vbHeight}`}
          className="w-full h-auto block"
          role="img"
          aria-label="Gráfico de radar do perfil comportamental DISC"
        >
          <defs>
            <linearGradient id="userRadarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.24" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.12" />
            </linearGradient>

            <linearGradient id="benchmarkRadarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d97706" stopOpacity="0.10" />
              <stop offset="100%" stopColor="#b45309" stopOpacity="0.03" />
            </linearGradient>
          </defs>

          {/* Concentric Diamond Webs */}
          {gridLevels.map((lvl) => {
            const webPoints = axes
              .map((a) => {
                const pt = getCoordinates(a.angle, lvl);
                return `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
              })
              .join(' ');

            return (
              <g key={lvl}>
                <polygon
                  points={webPoints}
                  fill="none"
                  className="stroke-slate-200 dark:stroke-slate-800"
                  strokeWidth={lvl === scaleMax ? '1.25' : '1'}
                  strokeDasharray={lvl === scaleMax ? 'none' : '3 3'}
                />
                <text
                  x={cx + 5}
                  y={cy - rScale(lvl) + 10}
                  className="fill-slate-400 dark:fill-slate-500"
                  fontSize="9"
                  fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                  fontWeight="500"
                >
                  {Math.round(lvl)}%
                </text>
              </g>
            );
          })}

          {/* Cross Axes */}
          {axes.map((a) => {
            const edge = getCoordinates(a.angle, scaleMax);
            const isActive = inspectedAxisKey === a.key;
            return (
              <line
                key={a.key}
                x1={cx}
                y1={cy}
                x2={edge.x}
                y2={edge.y}
                className={isActive ? '' : 'stroke-slate-300 dark:stroke-slate-700'}
                stroke={isActive ? a.color : undefined}
                strokeWidth={isActive ? '1.75' : '1.1'}
                opacity={isActive ? 0.85 : 0.75}
              />
            );
          })}

          {/* Benchmark Polygon Overlay */}
          {showBenchmark && (
            <g>
              <path
                d={benchmarkPath}
                fill="url(#benchmarkRadarGrad)"
                stroke="#d97706"
                strokeWidth="1.75"
                strokeDasharray="5 4"
                opacity="0.95"
              />
              {benchmarkCoordinates.map((pt, i) => (
                <rect
                  key={`bench-vert-${axes[i].key}`}
                  x={pt.x - 3.5}
                  y={pt.y - 3.5}
                  width="7"
                  height="7"
                  transform={`rotate(45 ${pt.x} ${pt.y})`}
                  fill="#d97706"
                  className="stroke-white dark:stroke-slate-900"
                  strokeWidth="1.5"
                />
              ))}
            </g>
          )}

          {/* User Profile Polygon */}
          <path
            d={userPath}
            fill="url(#userRadarGrad)"
            stroke="#4f46e5"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Interactive Vertex Nodes */}
          {axes.map((a, i) => {
            const pt = userCoordinates[i];
            const isActive = inspectedAxisKey === a.key;
            return (
              <g
                key={`user-vert-${a.key}`}
                className={interactive ? 'cursor-pointer' : ''}
                onMouseEnter={() => interactive && setHoveredAxis(a.key)}
                onMouseLeave={() => interactive && setHoveredAxis(null)}
                onClick={() =>
                  interactive && setPinnedAxis((prev) => (prev === a.key ? null : a.key))
                }
              >
                <circle cx={pt.x} cy={pt.y} r={16} fill="transparent" />
                {isActive && (
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={10}
                    fill="none"
                    stroke={a.color}
                    strokeWidth="1.5"
                    opacity="0.55"
                  />
                )}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isActive ? 6.5 : 5}
                  fill={a.color}
                  className="stroke-white dark:stroke-slate-950"
                  strokeWidth="2"
                />
              </g>
            );
          })}

          {/* Safe Two-Line Axis Labels Inside ViewBox */}
          {axes.map((a) => {
            let x = cx;
            let y = cy;
            let textAnchor: 'middle' | 'start' | 'end' = 'middle';

            if (a.key === 'D') {
              x = cx;
              y = cy - radius - 28;
              textAnchor = 'middle';
            } else if (a.key === 'S') {
              x = cx;
              y = cy + radius + 20;
              textAnchor = 'middle';
            } else if (a.key === 'I') {
              x = cx + radius + 14;
              y = cy - 4;
              textAnchor = 'start';
            } else {
              x = cx - radius - 14;
              y = cy - 4;
              textAnchor = 'end';
            }

            const isActive = inspectedAxisKey === a.key;

            return (
              <g
                key={`label-${a.key}`}
                className={interactive ? 'cursor-pointer' : ''}
                opacity={inspectedAxisKey && !isActive ? 0.55 : 1}
                onMouseEnter={() => interactive && setHoveredAxis(a.key)}
                onMouseLeave={() => interactive && setHoveredAxis(null)}
                onClick={() =>
                  interactive && setPinnedAxis((prev) => (prev === a.key ? null : a.key))
                }
              >
                <text x={x} y={y} textAnchor={textAnchor} fontSize="12" fontWeight="600">
                  <tspan fill={a.color} fontWeight="700">
                    {a.letter}
                  </tspan>
                  <tspan className="fill-slate-800 dark:fill-slate-200"> · {a.name}</tspan>
                </text>
                <text
                  x={x}
                  y={y + 15}
                  textAnchor={textAnchor}
                  fontSize="11.5"
                  fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                >
                  <tspan fill={a.color} fontWeight="700">
                    {a.userScore}%
                  </tspan>
                  {showBenchmark && (
                    <tspan className="fill-slate-500 dark:fill-slate-400" fontSize="10.5">
                      {' '}
                      (ref {a.benchmarkScore}%)
                    </tspan>
                  )}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Non-Obscuring Interactive Axis Inspector Strip */}
      {interactive && (
        <div className="w-full mt-2">
          {inspectedAxis ? (
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs space-y-1.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <span style={{ color: inspectedAxis.color }} className="font-mono font-bold">
                    {inspectedAxis.letter}
                  </span>
                  <span>{inspectedAxis.name}</span>
                </div>
                <div className="flex items-center gap-2 font-mono tabular-nums text-[11px]">
                  <span className="text-slate-900 dark:text-white font-semibold">
                    Você: {inspectedAxis.userScore}%
                  </span>
                  {showBenchmark && (
                    <>
                      <span className="text-slate-400 dark:text-slate-600" aria-hidden="true">·</span>
                      <span className="text-amber-700 dark:text-amber-300 font-medium">
                        {currentBenchmark.shortName}: {inspectedAxis.benchmarkScore}%
                      </span>
                      <span className="text-slate-400 dark:text-slate-600" aria-hidden="true">·</span>
                      <span
                        className={
                          inspectedAxis.userScore - inspectedAxis.benchmarkScore >= 0
                            ? 'text-emerald-700 dark:text-emerald-400 font-semibold'
                            : 'text-amber-700 dark:text-amber-400 font-semibold'
                        }
                      >
                        {inspectedAxis.userScore - inspectedAxis.benchmarkScore > 0
                          ? `+${inspectedAxis.userScore - inspectedAxis.benchmarkScore}%`
                          : `${inspectedAxis.userScore - inspectedAxis.benchmarkScore}%`}
                      </span>
                    </>
                  )}
                </div>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {inspectedAxis.techRoleExplanation}
              </p>
            </div>
          ) : (
            <div className="text-center text-[11px] text-slate-500 py-1.5">
              Passe o mouse ou clique em um eixo (D, I, S, C) para ver o detalhamento técnico.
            </div>
          )}
        </div>
      )}

      {/* Clean Legend & Adherence Summary */}
      {showBenchmark && (
        <div className="w-full mt-3 pt-3 border-t border-slate-200 dark:border-slate-800/80 flex flex-col items-center gap-1.5 text-xs">
          <div className="flex flex-wrap items-center justify-center gap-4 text-slate-600 dark:text-slate-300 select-none">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-2 rounded-xs bg-indigo-600/80 inline-block border border-indigo-500" />
              <span className="font-medium text-slate-900 dark:text-white">Seu Perfil</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-3.5 h-0.5 border-t-2 border-dashed border-amber-600 dark:border-amber-400 inline-block" />
              <span className="font-medium text-amber-700 dark:text-amber-300">
                {currentBenchmark.shortName}
              </span>
            </div>

            <span className="text-slate-300 dark:text-slate-600" aria-hidden="true">·</span>

            <span className="text-[11px] font-mono tabular-nums text-slate-500 dark:text-slate-400">
              Escala 0–{scaleMax}%
            </span>
          </div>

          <div className="text-[11px] text-slate-600 dark:text-slate-400 tabular-nums">
            Aderência ao perfil {currentBenchmark.shortName}:{' '}
            <strong className="font-mono text-amber-700 dark:text-amber-400">{adherence}%</strong>
          </div>
        </div>
      )}
    </div>
  );
};
