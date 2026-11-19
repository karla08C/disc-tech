import { DiscLetter, DiscPercentages, DiscCounts, TestRecord, TechCareer } from '../types/disc';
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
