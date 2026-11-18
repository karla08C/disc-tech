import { DiscLetter, DiscPercentages } from '../types/disc';
import { PROFILES, DUAL_PROFILES } from '../data/discData';

export interface SharedProfileData {
  name: string;
  dominant: DiscLetter;
  secondary: DiscLetter;
  dualCode?: string;
  pct: DiscPercentages;
  createdAt?: string;
}

interface CompactPayload {
  n: string; // name
  d: DiscLetter; // dominant
  s: DiscLetter; // secondary
  p: [number, number, number, number]; // [D, I, S, C]
  t?: number; // timestamp
}

/**
 * Encodes a profile into a URL-safe Base64 string
 */
export function encodeSharedProfile(data: SharedProfileData): string {
  try {
    const compact: CompactPayload = {
      n: data.name?.trim() || 'Profissional Tech',
      d: data.dominant,
      s: data.secondary,
      p: [data.pct.D, data.pct.I, data.pct.S, data.pct.C],
      t: Date.now(),
    };
    const json = JSON.stringify(compact);
    // Base64 encode handling unicode characters safely
    const encoded = btoa(encodeURIComponent(json));
    return encoded;
  } catch (err) {
    console.error('Failed to encode shared profile:', err);
    return '';
  }
}

/**
 * Decodes a URL-safe Base64 string into profile data
 */
export function decodeSharedProfile(encodedString: string): SharedProfileData | null {
  try {
    if (!encodedString) return null;
    const json = decodeURIComponent(atob(encodedString));
    const compact: CompactPayload = JSON.parse(json);

    if (
      !compact ||
      !compact.d ||
      !compact.s ||
      !Array.isArray(compact.p) ||
      compact.p.length !== 4
    ) {
      return null;
    }

    const pct: DiscPercentages = {
      D: Number(compact.p[0]) || 0,
      I: Number(compact.p[1]) || 0,
      S: Number(compact.p[2]) || 0,
      C: Number(compact.p[3]) || 0,
    };

    return {
      name: compact.n || 'Profissional Tech',
      dominant: compact.d,
      secondary: compact.s,
      dualCode: `${compact.d}${compact.s}`,
      pct,
      createdAt: compact.t ? new Date(compact.t).toISOString() : undefined,
    };
  } catch (err) {
    console.error('Failed to decode shared profile string:', err);
    return null;
  }
}

/**
 * Builds the full shareable URL
 */
export function buildShareUrl(data: SharedProfileData): string {
  const code = encodeSharedProfile(data);
  if (typeof window === 'undefined') {
    return `/?share=${code}`;
  }
  const baseUrl = `${window.location.origin}${window.location.pathname}`;
  return `${baseUrl}?share=${code}`;
}

/**
 * Formats social media sharing text
 */
export function generateSocialPostText(
  platform: 'linkedin' | 'twitter' | 'whatsapp',
  data: SharedProfileData,
  url: string
): string {
  const profile = PROFILES[data.dominant];
  const dual = DUAL_PROFILES[data.dualCode || `${data.dominant}${data.secondary}`];
  const title = profile?.title || `Perfil ${data.dominant}`;
  const userName = data.name || 'Profissional Tech';

  if (platform === 'twitter') {
    return `Meu perfil comportamental no DISC Tech: ${title} 🎯\n` +
      `Distribuição: D: ${data.pct.D}% | I: ${data.pct.I}% | S: ${data.pct.S}% | C: ${data.pct.C}%\n` +
      `Veja minha análise completa e benchmark de Desenvolvedor Pleno:\n${url}\n\n#DISCTech #Dev`;
  }

  if (platform === 'whatsapp') {
    return `*DISC Tech • Análise Comportamental de TI*\n` +
      `Confira o perfil mapeado de ${userName}:\n` +
      `🎯 *Dominante:* ${title} (${data.dominant})\n` +
      `📊 *Distribuição:* D:${data.pct.D}% | I:${data.pct.I}% | S:${data.pct.S}% | C:${data.pct.C}%\n` +
      (dual ? `💡 *Diferencial:* ${dual.naturalStrength}\n` : '') +
      `\n🔗 Veja o relatório interativo completo aqui:\n${url}`;
  }

  // LinkedIn format
  return `🚀 Acabei de mapear meu perfil comportamental no DISC Tech!\n\n` +
    `👤 Meu resultado dominante: ${data.dominant} — ${title}\n` +
    `📊 Minha distribuição DISC:\n` +
    `• Dominância (D): ${data.pct.D}% (Iniciativa & resolução de problemas)\n` +
    `• Influência (I): ${data.pct.I}% (Comunicação & engajamento de time)\n` +
    `• Estabilidade (S): ${data.pct.S}% (Consistência & previsibilidade de entrega)\n` +
    `• Conformidade (C): ${data.pct.C}% (Rigor técnico & qualidade de código)\n\n` +
    (dual ? `💡 Diferencial chave no time: "${dual.naturalStrength}"\n\n` : '') +
    `O relatório compara meus resultados com o benchmark comportamental de Desenvolvedor Pleno da indústria tech.\n\n` +
    `Confira o meu relatório interativo completo:\n${url}\n\n` +
    `#DISCTech #EngenhariaDeSoftware #TechCareer #DesenvolvimentoProfissional #LiderancaTech`;
}

/**
 * Reconstructs a 20-answer array matching specific percentages
 */
export function buildAnswersFromPercentages(pct: DiscPercentages): DiscLetter[] {
  const letters: DiscLetter[] = [];
  const countD = Math.max(0, Math.round((pct.D / 100) * 20));
  const countI = Math.max(0, Math.round((pct.I / 100) * 20));
  const countS = Math.max(0, Math.round((pct.S / 100) * 20));
  const countC = Math.max(0, 20 - (countD + countI + countS));

  for (let i = 0; i < countD; i++) letters.push('D');
  for (let i = 0; i < countI; i++) letters.push('I');
  for (let i = 0; i < countS; i++) letters.push('S');
  for (let i = 0; i < countC; i++) letters.push('C');

  while (letters.length < 20) letters.push('C');
  return letters.slice(0, 20);
}

