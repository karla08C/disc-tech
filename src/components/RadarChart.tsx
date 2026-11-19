import React, { useState, useMemo } from 'react';
import * as d3 from 'd3';
import { DiscLetter, DiscPercentages } from '../types/disc';

interface RadarChartProps {
  pct: DiscPercentages;
  size?: number;
  interactive?: boolean;
}

interface AxisConfig {
  key: DiscLetter;
  name: string;
  letter: DiscLetter;
  angle: number;
  color: string;
  techRoleExplanation: string;
  userScore: number;
}

export const RadarChart: React.FC<RadarChartProps> = ({
  pct,
  size = 360,
  interactive = true,
}) => {
  const [hoveredAxis, setHoveredAxis] = useState<DiscLetter | null>(null);
  const [pinnedAxis, setPinnedAxis] = useState<DiscLetter | null>(null);

  const vbWidth = 440;
  const vbHeight = 340;
  const cx = vbWidth / 2;
  const cy = vbHeight / 2;
  const radius = 104;

  const scaleMax = useMemo(() => {
    const peak = Math.max(pct.D || 0, pct.I || 0, pct.S || 0, pct.C || 0);
    if (peak <= 36) return 40;
    if (peak <= 54) return 60;
    if (peak <= 74) return 80;
    return 100;
  }, [pct]);

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
        techRoleExplanation: 'Autonomia para destravar problemas, priorizar entregas e tomar decisões com rapidez.',
        userScore: pct.D || 0,
      },
      {
        key: 'I',
        name: 'Influência',
        letter: 'I',
        angle: 0,
        color: '#d97706',
        techRoleExplanation: 'Comunicação colaborativa, facilidade para articular ideias com o time e engajar pessoas.',
        userScore: pct.I || 0,
      },
      {
        key: 'S',
        name: 'Estabilidade',
        letter: 'S',
        angle: Math.PI / 2,
        color: '#059669',
        techRoleExplanation: 'Consistência de ritmo, previsibilidade na rotina e calma para sustentar projetos contínuos.',
        userScore: pct.S || 0,
      },
      {
        key: 'C',
        name: 'Conformidade',
        letter: 'C',
        angle: Math.PI,
        color: '#0284c7',
        techRoleExplanation: 'Rigor analítico, atenção a detalhes, qualidade técnica e organização de critérios.',
        userScore: pct.C || 0,
      },
    ];
  }, [pct]);

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

  const userPath = useMemo(() => {
    return (
      userCoordinates
        .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
        .join(' ') + ' Z'
    );
  }, [userCoordinates]);

  const inspectedAxisKey = hoveredAxis || pinnedAxis;
  const inspectedAxis = useMemo(
    () => axes.find((x) => x.key === inspectedAxisKey) || null,
    [axes, inspectedAxisKey]
  );

  const maxContainerWidth = size >= 320 ? 440 : Math.max(size + 110, 340);

  return (
    <div className="flex flex-col items-center w-full mx-auto" style={{ maxWidth: maxContainerWidth }}>
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
                className={interactive ? 'cursor-pointer focus:outline-none' : ''}
                tabIndex={interactive ? 0 : undefined}
                role={interactive ? 'button' : undefined}
                aria-pressed={interactive ? pinnedAxis === a.key : undefined}
                aria-label={`${a.letter} ${a.name}: ${a.userScore}%`}
                onMouseEnter={() => interactive && setHoveredAxis(a.key)}
                onMouseLeave={() => interactive && setHoveredAxis(null)}
                onFocus={() => interactive && setHoveredAxis(a.key)}
                onBlur={() => interactive && setHoveredAxis(null)}
                onKeyDown={(e) => {
                  if (interactive && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    setPinnedAxis((prev) => (prev === a.key ? null : a.key));
                  }
                }}
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
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Non-Obscuring Interactive Axis Inspector Strip */}
      {interactive && (
        <div className="w-full mt-2 no-print" aria-live="polite">
          {inspectedAxis ? (
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs space-y-1.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <span style={{ color: inspectedAxis.color }} className="font-mono font-bold">
                    {inspectedAxis.letter}
                  </span>
                  <span>{inspectedAxis.name}</span>
                </div>
                <span className="font-mono tabular-nums text-xs text-slate-900 dark:text-white font-semibold">
                  {inspectedAxis.userScore}%
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {inspectedAxis.techRoleExplanation}
              </p>
            </div>
          ) : (
            <div className="text-center text-[11px] text-slate-500 py-1.5">
              Passe o mouse ou clique em um eixo (D, I, S, C) para ver o detalhamento.
            </div>
          )}
        </div>
      )}

      {/* Clean Legend */}
      <div className="w-full mt-3 pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-center gap-3 text-xs text-slate-600 dark:text-slate-300 select-none">
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-2 rounded-xs bg-indigo-600/80 inline-block border border-indigo-500" />
          <span className="font-medium text-slate-900 dark:text-white">Seu Perfil DISC</span>
        </div>
        <span className="text-slate-300 dark:text-slate-600" aria-hidden="true">·</span>
        <span className="text-[11px] font-mono tabular-nums text-slate-500 dark:text-slate-400">
          Escala 0–{scaleMax}%
        </span>
      </div>
    </div>
  );
};
