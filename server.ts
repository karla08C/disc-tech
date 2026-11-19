import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Server-side Gemini AI Client
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  try {
    aiClient = new GoogleGenAI({ apiKey });
  } catch (err) {
    console.warn('Failed to initialize GoogleGenAI client:', err);
  }
}

// API: AI Coaching & PDI Generation
app.post('/api/ai/coach', async (req, res) => {
  try {
    const { name, dominant, pct, targetRole, requestType } = req.body;

    if (!dominant || !pct) {
      return res.status(400).json({ error: 'Dominant profile and percentages are required' });
    }

    if (!aiClient) {
      // Fallback structured guidance when API key is not configured
      return res.json({
        success: true,
        isFallback: true,
        content: generateStructuredPdi(name || 'Dev', dominant, pct, targetRole || 'Tech Lead')
      });
    }

    let prompt = '';
    if (requestType === 'interview') {
      prompt = `Você é um Staff Principal Engineer e Head de Pessoas experiente no mercado tech brasileiro e global.
O profissional tech se chama "${name || 'Candidato'}" e fez o teste DISC Tech (comportamental para TI):
- Dominância (D): ${pct.D}%
- Influência (I): ${pct.I}%
- Estabilidade (S): ${pct.S}%
- Conformidade (C): ${pct.C}%
- Perfil Dominante: ${dominant}
- Objetivo de Carreira: ${targetRole || 'Liderança Técnica / Senior'}

Gere um simulador de entrevista comportamental com:
1. Três perguntas difíceis de entrevista comportamental (metodologia STAR) feitas sob medida para investigar os prováveis pontos cegos desse perfil DISC.
2. Como um entrevistador de Big Tech / Unicórnio avalia as respostas.
3. Sugestão prática de como estruturar a resposta ideal evidenciando maturidade e autoconhecimento.
Mantenha um tom profissional, construtivo e focado no mercado de tecnologia em Português do Brasil.`;
    } else {
      prompt = `Você é um Mentor Executivo de Engenharia de Software e Especialista em Perfil Comportamental DISC para o mercado tech.
O profissional se chama "${name || 'Dev'}" e obteve o seguinte resultado no DISC Tech:
- Dominância (D): ${pct.D}% (Execução, velocidade, assertividade)
- Influência (I): ${pct.I}% (Comunicação, articulação, motivação)
- Estabilidade (S): ${pct.S}% (Consistência, resiliência, calma)
- Conformidade (C): ${pct.C}% (Precisão, qualidade técnica, rigor)
- Perfil Dominante: ${dominant}
- Alvo de Carreira: ${targetRole || 'Tech Lead / Staff Engineer'}

Crie um Plano de Desenvolvimento Individual (PDI) hiperpersonalizado contendo:
1. Diagnóstico Comportamental no Contexto Tech (pontos fortes como diferencial e armadilhas diárias no trabalho).
2. Plano de Ação 30-60-90 Dias (ações concretas de aprendizado, portfólio, comunicação e rotina).
3. Roteiro de Comunicação com Outros Perfis (como alinhar expectativas com perfis mais analíticos, comunicativos ou executores).
4. 2 Recomendações de Livros/Recursos essenciais para este momento de carreira.

Retorne em Markdown bem formatado, sem emojis, direto ao ponto e em Português do Brasil.`;
    }

    const response = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return res.json({
      success: true,
      isFallback: false,
      content: response.text || 'Não foi possível gerar a resposta no momento.'
    });
  } catch (error: any) {
    console.error('Error generating AI coaching:', error);
    // Provide graceful fallback
    const { name, dominant, pct, targetRole } = req.body;
    return res.json({
      success: true,
      isFallback: true,
      content: generateStructuredPdi(name || 'Dev', dominant || 'D', pct || { D: 40, I: 20, S: 20, C: 20 }, targetRole || 'Tech Lead')
    });
  }
});

function generateStructuredPdi(name: string, dominant: string, pct: any, targetRole: string) {
  const profileNames: Record<string, string> = {
    D: 'O Tech Lead Executor (Dominância)',
    I: 'O Catalisador de Times (Influência)',
    S: 'O Engenheiro Estável (Estabilidade)',
    C: 'O Arquiteto Analítico (Conformidade)'
  };

  return `### Diagnóstico Comportamental para ${name}
**Perfil:** ${profileNames[dominant] || dominant}  
**Distribuição:** D: ${pct.D}% | I: ${pct.I}% | S: ${pct.S}% | C: ${pct.C}%  
**Carreira Alvo:** ${targetRole}

#### Pontos Fortes no Dia a Dia
- Capacidade natural de contribuir para iniciativas com base no seu quadrante predominante.
- Visão pragmática de entrega e resolução de problemas práticos.

#### Plano de Ação Personalizado (30-60-90 Dias)
- **Primeiros 30 Dias:** Mapeie seus 2 principais pontos de atenção comportamentais durante reuniões e revisões. Solicite feedback direto a 2 pares de confiança.
- **Em 60 Dias:** Pratique comunicação adaptada com colegas que possuem perfis opostos (ex.: se for D, dê mais espaço a C e S; se for C, pratique entregar versões incrementais antes da perfeição).
- **Em 90 Dias:** Lidere um alinhamento ou melhoria de processo utilizando escuta ativa e critérios objetivos.

#### Leituras Recomendadas
- *The Manager's Path* — Camille Fournier
- *Crucial Conversations* — Kerry Patterson`;
}

// In development, mount Vite middleware. In production, serve dist.
async function setupServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, host: '0.0.0.0' },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

setupServer();
