import type { Level, LevelId } from "./types";

export const LEVELS: Level[] = [
  {
    id: "iniciante",
    label: "Iniciante",
    description:
      "frases curtas e bem simples, vocabulário básico do dia a dia (nível A1-A2)",
  },
  {
    id: "intermediario",
    label: "Intermediário",
    description:
      "frases naturais de tamanho médio, vocabulário comum do cotidiano (nível B1)",
  },
  {
    id: "avancado",
    label: "Avançado",
    description:
      "conversa fluida e rica, com expressões idiomáticas e vocabulário mais sofisticado (nível B2+)",
  },
];

export const DEFAULT_LEVEL_ID: LevelId = "intermediario";

export function getLevel(id: LevelId | undefined): Level {
  return LEVELS.find((l) => l.id === id) ?? LEVELS[1];
}
