import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve static bundle location robustly (root or dist folder)
const distPath = fs.existsSync(path.resolve(__dirname, 'dist', 'index.html'))
  ? path.resolve(__dirname, 'dist')
  : fs.existsSync(path.resolve(__dirname, 'index.html'))
    ? __dirname
    : path.resolve(__dirname, 'dist');

const rootPath = fs.existsSync(path.resolve(__dirname, 'package.json'))
  ? __dirname
  : path.resolve(__dirname, '..');

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
        content: generateStructuredPlan(
          name || 'Profissional em Transição',
          dominant,
          pct,
          targetRole || 'Primeira Vaga em TI (Estágio / Júnior)',
          requestType
        )
      });
    }

    let prompt = '';
    if (requestType === 'interview') {
      prompt = `Você é um mentor de carreira e recrutador experiente em vagas de entrada (Estágio, Trainee e Júnior) e transição de carreira para o mercado de tecnologia brasileiro.
A pessoa candidata se chama "${name || 'Candidato(a)'}" e fez a avaliação comportamental DISC Tech:
- Dominância (D): ${pct.D}%
- Influência (I): ${pct.I}%
- Estabilidade (S): ${pct.S}%
- Conformidade (C): ${pct.C}%
- Perfil Dominante: ${dominant}
- Área ou Vaga Alvo: ${targetRole || 'Primeira Vaga em TI (Estágio / Júnior)'}

Gere um treino prático para a primeira entrevista em tecnologia com:
1. Três perguntas reais muito comuns em entrevistas para iniciantes e pessoas em transição de carreira, adaptadas ao perfil DISC dessa pessoa.
2. O que quem entrevista realmente busca avaliar em cada resposta (sem exigir experiência prévia em TI).
3. Como estruturar uma resposta clara e sincera aproveitando experiências anteriores, projetos de estudo e pontos fortes do perfil ${dominant}.
Use linguagem direta, acolhedora e prática em Português do Brasil, sem jargões corporativos desnecessários e sem emojis.`;
    } else {
      prompt = `Você é um mentor de carreira especializado em ajudar iniciantes e profissionais em transição a conquistar a primeira vaga em tecnologia no Brasil.
A pessoa se chama "${name || 'Profissional em Transição'}" e obteve o seguinte resultado no DISC Tech:
- Dominância (D): ${pct.D}% (Execução, iniciativa, foco em resultado)
- Influência (I): ${pct.I}% (Comunicação, empatia, articulação)
- Estabilidade (S): ${pct.S}% (Consistência, organização, trabalho em equipe)
- Conformidade (C): ${pct.C}% (Análise, atenção a detalhes, qualidade)
- Perfil Dominante: ${dominant}
- Área ou Vaga Alvo: ${targetRole || 'Primeira Vaga em TI (Estágio / Júnior)'}

Crie um Plano Prático de 90 Dias para entrada em TI contendo:
1. Como usar seu perfil ${dominant} a favor dos estudos e da transição (vantagens naturais e 1 ou 2 cuidados simples no início).
2. Roteiro 30-60-90 Dias (Dias 1-30: base + 1º projeto; Dias 31-60: portfólio + currículo e LinkedIn; Dias 61-90: candidaturas direcionadas + entrevistas).
3. Dica prática de consistência para conciliar estudos com rotina atual.

Retorne em Markdown bem formatado, sem emojis, sem jargões corporativos complexos e em Português do Brasil.`;
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
    const { name, dominant, pct, targetRole, requestType } = req.body;
    return res.json({
      success: true,
      isFallback: true,
      content: generateStructuredPlan(
        name || 'Profissional em Transição',
        dominant || 'D',
        pct || { D: 40, I: 20, S: 20, C: 20 },
        targetRole || 'Primeira Vaga em TI (Estágio / Júnior)',
        requestType
      )
    });
  }
});

function generateStructuredPlan(
  name: string,
  dominant: string,
  pct: any,
  targetRole: string,
  requestType?: string
) {
  const profileNames: Record<string, string> = {
    D: 'Executor / Direcionador (Dominância)',
    I: 'Comunicador / Catalisador (Influência)',
    S: 'Estável / Sustentador (Estabilidade)',
    C: 'Analítico / Estruturador (Conformidade)'
  };

  if (requestType === 'interview') {
    return `### Treino de Entrevista (1ª Vaga / Transição) — ${name}
**Perfil:** ${profileNames[dominant] || dominant}  
**Distribuição:** D: ${pct.D}% | I: ${pct.I}% | S: ${pct.S}% | C: ${pct.C}%  
**Área / Vaga Alvo:** ${targetRole}

#### Pergunta 1 — Por que migrar para tecnologia agora?
"O que te motivou a escolher esta área e como sua experiência anterior ajuda neste novo desafio?"
- **O que avaliam:** clareza de objetivo, motivação real e capacidade de conectar habilidades transferíveis.
- **Como responder:** apresente em 3 passos (o que você fazia antes, por que escolheu a área de TI e o que já construiu estudando).

#### Pergunta 2 — Aprendendo algo do zero
"Conte sobre uma ferramenta ou habilidade nova que você aprendeu recentemente. Qual foi a maior dificuldade?"
- **O que avaliam:** autonomia para aprender e lidar com erros sem travar.
- **Como responder:** use seu 1º projeto de portfólio como exemplo concreto e explique como resolveu o problema.

#### Pergunta 3 — Trabalho em equipe e feedback
"Conte uma situação em que recebeu um feedback construtivo ou precisou alinhar uma tarefa em grupo."
- **O que avaliam:** escuta ativa, postura colaborativa e maturidade para vagas de Estágio ou Júnior.`;
  }

  return `### Plano de Estudos e Entrada em TI (90 Dias) — ${name}
**Perfil:** ${profileNames[dominant] || dominant}  
**Distribuição:** D: ${pct.D}% | I: ${pct.I}% | S: ${pct.S}% | C: ${pct.C}%  
**Área / Vaga Alvo:** ${targetRole}

#### Como usar seu perfil a favor da transição
- Aproveite sua força natural do perfil ${dominant} para manter ritmo constante nos estudos e apresentar seus projetos com clareza.
- Evite tentar aprender várias áreas ao mesmo tempo; foque em 1 trilha principal por 60 dias.

#### Roteiro Prático 30-60-90 Dias
- **Dias 1 a 30 (Base + 1º Projeto):** escolha 1 área recomendada, siga o roadmap.sh por 45 min/dia e conclua um projeto inicial simples.
- **Dias 31 a 60 (Portfólio + LinkedIn):** publique seu projeto no GitHub, Figma, Notion ou Power BI explicando o problema resolvido e adapte seu LinkedIn e currículo.
- **Dias 61 a 90 (Candidaturas + Entrevistas):** faça candidaturas direcionadas para Estágio, Trainee ou Júnior, peça feedback do portfólio e treine sua apresentação pessoal.`;
}

// In development, mount Vite middleware. In production or built mode, serve dist.
async function setupServer() {
  const isProduction = process.env.NODE_ENV === 'production';
  const hasDist = fs.existsSync(path.resolve(distPath, 'index.html'));

  if (!isProduction && !hasDist) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, host: '0.0.0.0' },
      appType: 'custom',
      root: rootPath,
    });
    app.use(vite.middlewares);
    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.resolve(rootPath, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 DISC Tech rodando com sucesso em http://localhost:${PORT}`);
  });
}

setupServer();
