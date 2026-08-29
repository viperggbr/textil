# 🇫🇷 Salut! — pratique de francês com IA

Um app pra treinar francês conversando (por voz ou texto) com parceiros de IA
que têm personalidade de verdade: um professor bravo que se choca com cada
erro, um corretor zoeiro que faz piada com as suas gafes, uma diva dramática,
um parisiense debochado e mais. Cada persona corrige seus erros de francês no
próprio estilo — e o app sempre te mostra a correção certa, ainda que
disfarçada de piada ou treta.

## ✨ Funcionalidades

- **Conversa em francês** por texto ou **falando no microfone** (reconhecimento
  de voz do navegador).
- **Respostas faladas em voz alta** pela IA (síntese de voz do navegador), com
  tom de voz (pitch/velocidade) ajustado por persona.
- **6 personas** com estilos bem diferentes de correção:
  - 😊 Professora Gentil — paciente e encorajadora
  - 😤 Professor Bravo — rabugento, exigente, dramático
  - 😂 Corretor Zoeiro — corrige na base da piada
  - 🥐 Parisiense Debochado — irônico, "bof..."
  - 🎭 Diva Dramática — cada erro é um escândalo
  - 🧘 Mestre Zen — calmo e motivacional
- **3 níveis** (iniciante / intermediário / avançado) que ajustam o vocabulário
  usado pela IA.
- **Correções destacadas** em um card separado da conversa (frase errada →
  frase certa → comentário no tom da persona), sem quebrar o fluxo do papo.
- **Tradução em português** de cada resposta da IA.
- Conversa fica salva no navegador (localStorage) — recarregou a página,
  continua de onde parou.

## 🧠 Como funciona

O "cérebro" das conversas é a API da Anthropic (Claude). Cada mensagem sua
vai pro servidor (rota `app/api/chat/route.ts`), que monta um prompt de
sistema com a persona e o nível escolhidos e pede pro modelo responder em um
formato estruturado (via [structured outputs](https://docs.claude.com) com
Zod): a fala em francês, a tradução, e se houve erro de gramática/vocabulário
— e como corrigir.

A voz (falar e ouvir) usa a **Web Speech API nativa do navegador** — não
precisa de nenhuma chave ou serviço extra pra isso, mas o suporte varia:
funciona bem no **Chrome** e **Edge** (desktop e Android); no Safari/iOS a
síntese de voz funciona mas o reconhecimento de fala é limitado; no Firefox o
reconhecimento de fala geralmente não é suportado — nesses casos o app cai
automaticamente para "só texto".

## 🚀 Rodando localmente

Pré-requisitos: Node.js 20+ e uma chave de API da Anthropic.

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Copie o arquivo de exemplo de variáveis de ambiente:

   ```bash
   cp .env.example .env.local
   ```

3. Crie uma chave em **https://console.anthropic.com/settings/keys** e cole
   em `ANTHROPIC_API_KEY` no `.env.local`. É uma API paga (cobra por uso, não
   por assinatura) — cada mensagem trocada custa uma fração de centavo; dá pra
   acompanhar o gasto no console da Anthropic. Se quiser economizar, troque
   `ANTHROPIC_MODEL` no mesmo arquivo para `claude-sonnet-5` ou
   `claude-haiku-4-5` (mais rápidos e mais baratos que o padrão
   `claude-opus-5`).

4. Rode o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

5. Abra **http://localhost:3000**, permita o uso do microfone quando o
   navegador pedir, escolha uma persona e manda um "Bonjour!" 🎙️

## 📁 Estrutura do projeto

```
app/
  page.tsx           # tela principal (client component)
  api/chat/route.ts  # rota que fala com a API da Anthropic
  layout.tsx, globals.css
components/          # PersonaPicker, LevelPicker, ChatBubble, CorrectionCard, Composer, VoiceSettings
hooks/
  useChat.ts               # estado da conversa + localStorage
  useSpeechRecognition.ts  # microfone -> texto
  useSpeechSynthesis.ts    # texto -> voz
lib/
  personas.ts, levels.ts   # definição das personas e níveis
  types.ts                 # tipos + schema (Zod) da resposta estruturada da IA
```

## 🌐 Deploy

O app é um projeto Next.js padrão, então funciona em qualquer host que rode
Next.js (Vercel é o mais direto). Ao fazer deploy, configure a variável de
ambiente `ANTHROPIC_API_KEY` (e opcionalmente `ANTHROPIC_MODEL`) nas
configurações do projeto na plataforma escolhida.

> ⚠️ **Atenção ao publicar:** a rota `/api/chat` não tem autenticação — qualquer
> pessoa com o link do app consegue mandar mensagens e consumir sua chave de
> API. Para uso pessoal isso não é um problema, mas se for compartilhar o link
> publicamente vale colocar uma senha simples na frente (ex.: Vercel
> Password Protection) ou algum outro controle de acesso.

## 💡 Possíveis próximos passos

- Cenários guiados (pedir comida num café, entrevista de emprego, etc.)
- Mais personas, ou deixar o usuário criar a sua própria
- Histórico de erros mais comuns pra revisar depois
- Autenticação/multiusuário, se for virar algo além de uso pessoal
