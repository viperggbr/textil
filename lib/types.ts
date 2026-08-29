import { z } from "zod";

// ---------------------------------------------------------------------------
// Personas & levels
// ---------------------------------------------------------------------------

export type PersonaId =
  | "gentil"
  | "bravo"
  | "engracado"
  | "parisiense"
  | "diva"
  | "zen";

export interface PersonaTheme {
  /** Classes for the pill/chip when this persona is the selected one. */
  chipActive: string;
  /** Classes for the assistant chat bubble border/background/text. */
  bubble: string;
  /** Classes for small accent text (name highlights, etc). */
  accent: string;
}

export interface Persona {
  id: PersonaId;
  name: string;
  emoji: string;
  /** Short PT-BR blurb shown in the picker. */
  tagline: string;
  /** Third-person description injected into the system prompt. */
  systemDescription: string;
  /** How this persona should phrase corrections, injected into the system prompt. */
  correctionStyle: string;
  /** Text-to-speech tuning. */
  voice: { pitch: number; rate: number };
  theme: PersonaTheme;
}

export type LevelId = "iniciante" | "intermediario" | "avancado";

export interface Level {
  id: LevelId;
  label: string;
  /** Injected into the system prompt to calibrate vocabulary/complexity. */
  description: string;
}

// ---------------------------------------------------------------------------
// Chat
// ---------------------------------------------------------------------------

export interface Correction {
  had_mistake: boolean;
  original: string | null;
  fixed: string | null;
  note_pt: string | null;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  createdAt: number;
  textFr: string;
  textPt?: string;
  correction?: Correction;
  moodEmoji?: string;
  /** Which persona produced this assistant message (kept even if the user later switches persona). */
  personaId?: PersonaId;
}

export interface HistoryItem {
  role: "user" | "assistant";
  text: string;
}

// ---------------------------------------------------------------------------
// Structured output contract with Claude
// ---------------------------------------------------------------------------

export const TutorResponseSchema = z.object({
  reply_fr: z
    .string()
    .describe(
      "Resposta em francês, no personagem, natural e curta (1 a 4 frases). Termine incentivando o aluno a continuar a conversa."
    ),
  reply_pt: z
    .string()
    .describe(
      "Tradução breve e natural de reply_fr para português do Brasil."
    ),
  correction: z.object({
    had_mistake: z
      .boolean()
      .describe(
        "true se a última mensagem do aluno em francês continha algum erro real de gramática, conjugação, concordância, vocabulário ou ortografia."
      ),
    original: z
      .string()
      .nullable()
      .describe("Trecho original do aluno que contém o erro, ou null se não houve erro."),
    fixed: z
      .string()
      .nullable()
      .describe("Versão corrigida desse trecho, ou null se não houve erro."),
    note_pt: z
      .string()
      .nullable()
      .describe(
        "Comentário sobre a correção (ou um elogio breve se não houve erro), escrito no tom do personagem, em português do Brasil. Pode ser null."
      ),
  }),
  mood_emoji: z
    .string()
    .describe("Um único emoji que resume o humor da resposta."),
});

export type TutorResponse = z.infer<typeof TutorResponseSchema>;
