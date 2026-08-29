import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { NextResponse } from "next/server";

import { getLevel } from "@/lib/levels";
import { getPersona } from "@/lib/personas";
import { TutorResponseSchema, type HistoryItem, type LevelId, type PersonaId } from "@/lib/types";

export const runtime = "nodejs";

interface ChatRequestBody {
  personaId?: PersonaId;
  levelId?: LevelId;
  message?: string;
  history?: HistoryItem[];
}

function buildSystemPrompt(personaId: PersonaId | undefined, levelId: LevelId | undefined): string {
  const persona = getPersona(personaId);
  const level = getLevel(levelId);

  return `Você é um parceiro de conversação em francês para brasileiros que estão aprendendo o idioma.

PERSONAGEM ATUAL: ${persona.name} ${persona.emoji}
Você interpreta ${persona.systemDescription}.

NÍVEL DO ALUNO: ${level.label} — use ${level.description}.

REGRAS:
1. Continue a conversa em francês no campo "reply_fr", com 1 a 4 frases curtas e naturais, adequadas ao nível do aluno e à personalidade acima. Inclua uma pergunta ou comentário que incentive o aluno a responder de novo em francês.
2. Preencha "reply_pt" com uma tradução breve e natural de "reply_fr", em português do Brasil.
3. Analise a ÚLTIMA mensagem do aluno (em francês) procurando erros reais de gramática, conjugação, concordância, vocabulário ou ortografia.
   - Se encontrar erro: "had_mistake" = true, "original" = o trecho errado, "fixed" = a versão corrigida, e "note_pt" = um comentário sobre o erro no TOM DO PERSONAGEM (${persona.correctionStyle}).
   - Se a frase do aluno estiver correta: "had_mistake" = false, "original" = null, "fixed" = null, e "note_pt" pode ser um elogio bem curto no tom do personagem, ou null.
   - NUNCA invente um erro que não existe — só corrija o que está de fato errado.
   - Se a mensagem do aluno estiver em português, vazia ou incompreensível, incentive-o (no tom do personagem) a tentar em francês, e não preencha a correção (had_mistake = false).
4. "mood_emoji" deve ser um único emoji que resuma o humor da resposta.
5. Nunca saia do personagem e nunca mencione que você é uma IA, um modelo de linguagem ou similar.`;
}

export async function POST(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      {
        error:
          "ANTHROPIC_API_KEY não está configurada no servidor. Copie .env.example para .env.local, adicione sua chave e reinicie o app.",
      },
      { status: 500 }
    );
  }

  let body: ChatRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corpo da requisição inválido." }, { status: 400 });
  }

  const { personaId, levelId, message, history } = body;

  if (!message || typeof message !== "string" || !message.trim()) {
    return NextResponse.json({ error: "Mensagem vazia." }, { status: 400 });
  }

  const client = new Anthropic();

  const messages: Anthropic.MessageParam[] = [
    ...(Array.isArray(history) ? history : [])
      .slice(-20)
      .filter((item) => item && typeof item.text === "string" && item.text.trim())
      .map((item) => ({
        role: item.role === "assistant" ? ("assistant" as const) : ("user" as const),
        content: item.text,
      })),
    { role: "user" as const, content: message },
  ];

  try {
    const response = await client.messages.parse({
      model: process.env.ANTHROPIC_MODEL || "claude-opus-5",
      max_tokens: 1024,
      system: [
        {
          type: "text",
          text: buildSystemPrompt(personaId, levelId),
          cache_control: { type: "ephemeral" },
        },
      ],
      output_config: {
        format: zodOutputFormat(TutorResponseSchema),
        effort: "low",
      },
      messages,
    });

    if (!response.parsed_output) {
      return NextResponse.json(
        { error: "Não consegui entender a resposta da IA. Tenta de novo?" },
        { status: 502 }
      );
    }

    return NextResponse.json({ result: response.parsed_output });
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) {
      return NextResponse.json(
        { error: "Chave de API inválida. Confira o ANTHROPIC_API_KEY no seu .env.local." },
        { status: 401 }
      );
    }
    if (error instanceof Anthropic.RateLimitError) {
      return NextResponse.json(
        { error: "Muitas mensagens em pouco tempo. Espera uns segundos e tenta de novo." },
        { status: 429 }
      );
    }
    if (error instanceof Anthropic.APIError) {
      return NextResponse.json(
        { error: `Erro da API da Anthropic: ${error.message}` },
        { status: error.status ?? 500 }
      );
    }
    console.error("Chat API error:", error);
    return NextResponse.json({ error: "Erro inesperado ao falar com a IA." }, { status: 500 });
  }
}
