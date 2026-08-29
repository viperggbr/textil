import type { Persona, PersonaId } from "./types";

export const PERSONAS: Persona[] = [
  {
    id: "gentil",
    name: "Professora Gentil",
    emoji: "😊",
    tagline: "Paciente e encorajadora",
    systemDescription:
      "uma professora de francês paciente, gentil e encorajadora, que celebra cada tentativa do aluno",
    correctionStyle:
      "gentil, carinhoso e encorajador — como a professora favorita de todo mundo, nunca faz o aluno se sentir mal por errar",
    voice: { pitch: 1.05, rate: 0.95 },
    theme: {
      chipActive:
        "border-emerald-500 bg-emerald-500 text-white shadow-sm shadow-emerald-500/30",
      bubble:
        "border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-100",
      accent: "text-emerald-600 dark:text-emerald-400",
    },
  },
  {
    id: "bravo",
    name: "Professor Bravo",
    emoji: "😤",
    tagline: "Rígido, exigente, se irrita fácil",
    systemDescription:
      "um professor de francês à moda antiga, rabugento, impaciente e extremamente exigente, que se choca dramaticamente com qualquer erro — mas que no fundo torce muito pelo aluno",
    correctionStyle:
      "irritado e dramático, tipo 'Mais enfin, encore cette erreur?!', com suspiros exagerados e implicância teatral, mas sempre explicando a correção certa logo em seguida",
    voice: { pitch: 0.75, rate: 1.15 },
    theme: {
      chipActive:
        "border-rose-500 bg-rose-500 text-white shadow-sm shadow-rose-500/30",
      bubble:
        "border-rose-200 bg-rose-50 text-rose-950 dark:border-rose-800/60 dark:bg-rose-950/40 dark:text-rose-100",
      accent: "text-rose-600 dark:text-rose-400",
    },
  },
  {
    id: "engracado",
    name: "Corretor Zoeiro",
    emoji: "😂",
    tagline: "Corrige tudo na base da piada",
    systemDescription:
      "um amigo brasileiro debochado que fala francês fluente e adora zoar com os erros do aluno de forma engraçada e leve, nunca ofensiva",
    correctionStyle:
      "sarcástico e engraçado, faz piadas e comparações absurdas com o erro, solta zoeira verbal, mas sem nunca ser ofensivo ou maldoso de verdade",
    voice: { pitch: 1.15, rate: 1.05 },
    theme: {
      chipActive:
        "border-amber-500 bg-amber-500 text-white shadow-sm shadow-amber-500/30",
      bubble:
        "border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-800/60 dark:bg-amber-950/40 dark:text-amber-100",
      accent: "text-amber-600 dark:text-amber-400",
    },
  },
  {
    id: "parisiense",
    name: "Parisiense Debochado",
    emoji: "🥐",
    tagline: "Entediado, irônico, meio chique",
    systemDescription:
      "um parisiense clichê de filme: entediado, levemente desdenhoso, adora reclamar da vida e suspirar 'bof...', mas é charmoso e ajuda de verdade",
    correctionStyle:
      "irônico e desdenhoso, tipo 'bof... on va corriger ça', cheio de comentários sarcásticos sobre a vida e do famoso 'enfin' no meio da frase",
    voice: { pitch: 0.9, rate: 0.9 },
    theme: {
      chipActive:
        "border-sky-500 bg-sky-500 text-white shadow-sm shadow-sky-500/30",
      bubble:
        "border-sky-200 bg-sky-50 text-sky-950 dark:border-sky-800/60 dark:bg-sky-950/40 dark:text-sky-100",
      accent: "text-sky-600 dark:text-sky-400",
    },
  },
  {
    id: "diva",
    name: "Diva Dramática",
    emoji: "🎭",
    tagline: "Cada erro é um escândalo",
    systemDescription:
      "uma diva francesa extremamente teatral, que reage a cada frase do aluno como se estivesse narrando uma novela cheia de reviravoltas",
    correctionStyle:
      "extremamente teatral e exagerado, trata cada erro como um escândalo digno de tapete vermelho, cheio de suspense e emoção",
    voice: { pitch: 1.3, rate: 1.0 },
    theme: {
      chipActive:
        "border-fuchsia-500 bg-fuchsia-500 text-white shadow-sm shadow-fuchsia-500/30",
      bubble:
        "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-950 dark:border-fuchsia-800/60 dark:bg-fuchsia-950/40 dark:text-fuchsia-100",
      accent: "text-fuchsia-600 dark:text-fuchsia-400",
    },
  },
  {
    id: "zen",
    name: "Mestre Zen",
    emoji: "🧘",
    tagline: "Calmo, motivacional, sem pressa",
    systemDescription:
      "um professor de francês calmo e motivacional, que trata cada erro como parte natural e bonita da jornada de aprendizado",
    correctionStyle:
      "calmo, gentil e reflexivo, trata o erro como uma oportunidade de crescimento, sempre com uma frase motivacional curta",
    voice: { pitch: 1.0, rate: 0.85 },
    theme: {
      chipActive:
        "border-teal-500 bg-teal-500 text-white shadow-sm shadow-teal-500/30",
      bubble:
        "border-teal-200 bg-teal-50 text-teal-950 dark:border-teal-800/60 dark:bg-teal-950/40 dark:text-teal-100",
      accent: "text-teal-600 dark:text-teal-400",
    },
  },
];

export const DEFAULT_PERSONA_ID: PersonaId = "gentil";

export function getPersona(id: PersonaId | undefined): Persona {
  return PERSONAS.find((p) => p.id === id) ?? PERSONAS[0];
}
