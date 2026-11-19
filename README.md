# DISC Tech 2.0 🚀
> Plataforma de análise de perfil comportamental DISC especializada para profissionais e lideranças de Tecnologia (TI).

---

## 🛠️ O que foi corrigido (Diagnóstico de Engenharia)

1. **Conflito de Dependências (ERESOLVE peer conflict):**
   - No `package.json`, existia uma dependência direta conflitante com a versão do Vite e seu empacotador nativo. Removemos o conflito direto para permitir que o Vite resolva sua engine sem travar o `npm install`.
2. **Ambiente de Runtime e Scripts de Start:**
   - O comando `"start": "node server.ts"` falhava por tentar executar TypeScript nativamente no Node sem transpilação prévia.
   - Ajustamos o script de execução e adicionamos `tsx` às dependências de execução, permitindo inicialização tanto com TypeScript no backend quanto servindo a build estática otimizada de `dist/`.
3. **Compatibilidade ESM no Vite Config:**
   - Substituição de referências herdadas do CommonJS (`__dirname`) pelas diretivas modernas de ECMAScript (`fileURLToPath` e `import.meta.url`).
4. **Fallback Robusto e Roteamento SPA no Express:**
   - Integração completa no `server.ts` para servir o bundle do frontend e as rotas de API `/api/ai/coach` com fallback resiliente para planos de desenvolvimento (PDI) e simulação STAR mesmo sem chave de API externa configurada.

---

## 🚀 Como Executar o Projeto

### 1. Instalar as Dependências
```bash
npm install
```

### 2. Rodar em Modo Desenvolvimento
```bash
npm run dev
```
O servidor iniciará em `http://localhost:3000` com HMR (Hot Module Replacement) ativo.

### 3. Gerar Build de Produção
```bash
npm run build
```

### 4. Iniciar em Produção
```bash
npm start
```

---

## ⚙️ Variáveis de Ambiente (Opcional)

Crie um arquivo `.env` na raiz do projeto com:
```env
PORT=3000
GEMINI_API_KEY="SUA_CHAVE_AQUI" # Opcional: Se não preenchido, o sistema utiliza o motor inteligente de fallback estruturado local.
```

---

## 🧪 Tecnologias Utilizadas
- **Frontend:** React 19, TypeScript, Tailwind CSS, Lucide Icons, Canvas Confetti, D3.js, jsPDF
- **Backend:** Node.js, Express, tsx
- **IA:** Google GenAI SDK (Gemini) com fallback local inteligente
- **Bundler:** Vite
