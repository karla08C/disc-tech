import { DiscLetter, DiscPercentages, DiscCounts, TestRecord, TechCareer, SquadMember } from '../types/disc';
import { TECH_CAREERS, PROFILES, DUAL_PROFILES } from '../data/discData';

const STORAGE_KEY = 'disc-tech.v2.history';

export function calculateDiscResult(answers: DiscLetter[]): {
  counts: DiscCounts;
  pct: DiscPercentages;
  dominant: DiscLetter;
  secondary: DiscLetter;
  dualCode: string;
} {
  const counts: DiscCounts = { D: 0, I: 0, S: 0, C: 0 };
  answers.forEach((letter) => {
    if (counts[letter] !== undefined) {
      counts[letter]++;
    }
  });

  const total = answers.length || 1;
  const pct: DiscPercentages = {
    D: Math.round((counts.D / total) * 100),
    I: Math.round((counts.I / total) * 100),
    S: Math.round((counts.S / total) * 100),
    C: Math.round((counts.C / total) * 100),
  };

  // Adjust any rounding discrepancy to sum to exactly 100
  const sum = pct.D + pct.I + pct.S + pct.C;
  if (sum !== 100 && total === 20) {
    const diff = 100 - sum;
    // apply adjustment to highest
    const highestLetter = (['D', 'I', 'S', 'C'] as DiscLetter[]).reduce((a, b) =>
      counts[a] >= counts[b] ? a : b
    );
    pct[highestLetter] += diff;
  }

  // Sorted letters by count
  const sorted = (['D', 'I', 'S', 'C'] as DiscLetter[]).sort((a, b) => counts[b] - counts[a]);
  const dominant = sorted[0];
  const secondary = sorted[1];
  const dualCode = `${dominant}${secondary}`;

  return { counts, pct, dominant, secondary, dualCode };
}

export function calculateCareerMatches(pct: DiscPercentages): Array<TechCareer & { matchScore: number }> {
  return TECH_CAREERS.map((career) => {
    // Distance from target weights
    const dDiff = Math.abs(pct.D - career.weights.D * 100);
    const iDiff = Math.abs(pct.I - career.weights.I * 100);
    const sDiff = Math.abs(pct.S - career.weights.S * 100);
    const cDiff = Math.abs(pct.C - career.weights.C * 100);

    const totalDiff = dDiff + iDiff + sDiff + cDiff;
    // Score between 50 and 99
    const matchScore = Math.max(55, Math.min(99, Math.round(100 - totalDiff * 0.45)));

    return {
      ...career,
      matchScore,
    };
  }).sort((a, b) => b.matchScore - a.matchScore);
}

export function calculateSquadSynergy(members: SquadMember[]) {
  if (members.length === 0) {
    return {
      avgPct: { D: 25, I: 25, S: 25, C: 25 },
      velocity: 0,
      morale: 0,
      stability: 0,
      rigor: 0,
      warnings: ['Adicione integrantes para analisar a composição da squad.'],
      strengths: [],
    };
  }

  const total = members.length;
  const sum = members.reduce(
    (acc, m) => ({
      D: acc.D + m.pct.D,
      I: acc.I + m.pct.I,
      S: acc.S + m.pct.S,
      C: acc.C + m.pct.C,
    }),
    { D: 0, I: 0, S: 0, C: 0 }
  );

  const avgPct: DiscPercentages = {
    D: Math.round(sum.D / total),
    I: Math.round(sum.I / total),
    S: Math.round(sum.S / total),
    C: Math.round(sum.C / total),
  };

  const velocity = Math.min(100, Math.round(avgPct.D * 2.2));
  const morale = Math.min(100, Math.round(avgPct.I * 2.2));
  const stability = Math.min(100, Math.round(avgPct.S * 2.2));
  const rigor = Math.min(100, Math.round(avgPct.C * 2.2));

  const warnings: string[] = [];
  const strengths: string[] = [];

  if (avgPct.D < 15) {
    warnings.push('Alerta de Inércia: Baixa Dominância na squad. Risco de discussões intermináveis sem tomada de decisão.');
  } else if (avgPct.D > 40) {
    warnings.push('Risco de Fricção: Excesso de Dominância. Risco de atrito entre lideranças e disputas de ego.');
  } else {
    strengths.push('Capacidade de decisão e velocidade de entrega calibrada.');
  }

  if (avgPct.I < 15) {
    warnings.push('Silo de Comunicação: Baixa Influência. Risco de falha no alinhamento com stakeholders e isolamento.');
  } else {
    strengths.push('Boa capacidade de articulação, entusiasmo e psicological safety.');
  }

  if (avgPct.S < 15) {
    warnings.push('Alerta de Burnout: Baixa Estabilidade. Risco de turnover alto, instabilidade de processos e sobrecarga.');
  } else {
    strengths.push('Resiliência operacional, consistência de rotina e mentoria presente.');
  }

  if (avgPct.C < 15) {
    warnings.push('Débito Técnico Crítico: Baixa Conformidade. Risco de código sem testes, bugs em produção e falhas de segurança.');
  } else {
    strengths.push('Rigor arquitetural, qualidade de código e segurança em esteiras CI/CD.');
  }

  return { avgPct, velocity, morale, stability, rigor, warnings, strengths };
}

// History Storage in LocalStorage
export function loadTestHistory(): TestRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to parse history:', e);
    return [];
  }
}

export function saveTestRecord(record: TestRecord): void {
  const current = loadTestHistory();
  const updated = [record, ...current.filter((r) => r.id !== record.id)];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function deleteTestRecord(id: string): TestRecord[] {
  const current = loadTestHistory();
  const updated = current.filter((r) => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}
