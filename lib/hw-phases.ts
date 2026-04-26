export type HWPhase = "menstrual" | "follicular" | "ovulation" | "luteal";

export interface PhaseData {
  key: HWPhase;
  name: string;
  emoji: string;
  dayRange: string;
  tagline: string;
  color: string;
  colorSoft: string;
  moonPhase: number; // 0=new, 0.25=waxing, 0.5=half, 0.75=waning, 1=full
  description: string;
  symptoms: string[];
  energy: number;
  mood: number;
  libido: number;
  tips: string[];
  hormone: string;
}

export const HW_PHASES: Record<HWPhase, PhaseData> = {
  menstrual: {
    key: "menstrual",
    name: "Menstrual",
    emoji: "🌑",
    dayRange: "Days 1–5",
    tagline: "Rest & release",
    color: "#f43f5e",
    colorSoft: "rgba(244,63,94,0.18)",
    moonPhase: 0,
    description:
      "Your body is shedding last cycle's lining. This is a time for deep rest, introspection, and gentleness with yourself. Honor your body's wisdom — this phase is a quiet reset.",
    symptoms: ["Cramps", "Lower back ache", "Fatigue", "Bloating", "Headache", "Mood dips", "Tender breasts", "Food cravings"],
    energy: 2,
    mood: 2,
    libido: 1,
    tips: [
      "Warm baths & heating pads help cramps",
      "Iron-rich foods like lentils & spinach",
      "Gentle yoga or walking",
      "Cancel plans guilt-free — rest is productive",
      "Journaling helps process emotions",
    ],
    hormone: "Estrogen & progesterone are at their lowest",
  },
  follicular: {
    key: "follicular",
    name: "Follicular",
    emoji: "🌒",
    dayRange: "Days 6–13",
    tagline: "Rise & bloom",
    color: "#a855f7",
    colorSoft: "rgba(168,85,247,0.18)",
    moonPhase: 0.25,
    description:
      "Estrogen is rising and your follicles are maturing. You'll notice more energy, creativity, and a natural optimism returning. This is your season to start new projects and connect with others.",
    symptoms: ["Increased energy", "Clearer skin", "Elevated mood", "Higher focus", "Social butterflies", "Light discharge", "Sensitivity to smell"],
    energy: 4,
    mood: 4,
    libido: 3,
    tips: [
      "Great time to try new workouts (HIIT, strength)",
      "Brainstorm and start new projects",
      "High-protein foods support follicle health",
      "Social plans feel easier — lean in",
      "Track your creative ideas",
    ],
    hormone: "Estrogen rises steadily; FSH peaks to mature follicle",
  },
  ovulation: {
    key: "ovulation",
    name: "Ovulation",
    emoji: "🌕",
    dayRange: "Days 14–16",
    tagline: "Peak & radiate",
    color: "#f0abfc",
    colorSoft: "rgba(240,171,252,0.18)",
    moonPhase: 1,
    description:
      "Your egg is released — you're at your peak magnetism, clarity, and confidence. Estrogen and testosterone surge together, making you feel unstoppable. Lean into visibility.",
    symptoms: ["Peak energy", "Mild pelvic twinge", "Increased discharge", "Slight temp rise", "Heightened senses", "Glowing skin"],
    energy: 5,
    mood: 5,
    libido: 5,
    tips: [
      "Big presentations & interviews — this is your moment",
      "Intense workouts feel amazing now",
      "Eggs, zinc-rich foods for hormonal support",
      "Connect deeply with people you care about",
      "Fertility is highest — plan accordingly",
    ],
    hormone: "LH surge triggers ovulation; estrogen peaks",
  },
  luteal: {
    key: "luteal",
    name: "Luteal",
    emoji: "🌖",
    dayRange: "Days 17–28",
    tagline: "Soften & prepare",
    color: "#fb923c",
    colorSoft: "rgba(251,146,60,0.18)",
    moonPhase: 0.75,
    description:
      "Progesterone rises to prepare for a potential pregnancy. If conception doesn't occur, both hormones drop, bringing PMS. This is a time for winding down, finishing projects, and nesting.",
    symptoms: ["Bloating", "Breast tenderness", "Mood swings", "Fatigue", "Cravings", "Acne flare-ups", "Irritability", "Anxiety", "Brain fog"],
    energy: 3,
    mood: 2,
    libido: 2,
    tips: [
      "Magnesium helps with cramps & mood (dark chocolate!)",
      "Complete tasks before things feel heavy",
      "Reduce caffeine & alcohol — they amplify PMS",
      "Comfort foods are okay — be compassionate",
      "Wind down routines & earlier bedtimes",
    ],
    hormone: "Progesterone dominates; drops toward end of phase",
  },
};

/** Map the existing cycle lib phase keys → HW phase keys */
export function toHWPhase(phase: string): HWPhase {
  if (phase === "ovulatory") return "ovulation";
  if (phase === "menstrual" || phase === "follicular" || phase === "luteal") return phase;
  return "follicular";
}

export const HW_SYMPTOMS = [
  { id: "cramps", label: "Cramps", icon: "⚡" },
  { id: "headache", label: "Headache", icon: "🌀" },
  { id: "bloating", label: "Bloating", icon: "💧" },
  { id: "fatigue", label: "Fatigue", icon: "😴" },
  { id: "backache", label: "Back Ache", icon: "🦴" },
  { id: "nausea", label: "Nausea", icon: "🌊" },
  { id: "acne", label: "Acne", icon: "✨" },
  { id: "tender", label: "Tender Breasts", icon: "🌸" },
  { id: "cravings", label: "Cravings", icon: "🍫" },
  { id: "discharge", label: "Discharge", icon: "💎" },
  { id: "spotting", label: "Spotting", icon: "🩸" },
  { id: "insomnia", label: "Insomnia", icon: "🌙" },
];

export const HW_MOODS = [
  { id: "happy", label: "Happy", emoji: "😊" },
  { id: "calm", label: "Calm", emoji: "😌" },
  { id: "energized", label: "Energized", emoji: "⚡" },
  { id: "anxious", label: "Anxious", emoji: "😰" },
  { id: "sad", label: "Sad", emoji: "😢" },
  { id: "irritable", label: "Irritable", emoji: "😤" },
  { id: "sensitive", label: "Sensitive", emoji: "🥺" },
  { id: "confident", label: "Confident", emoji: "💪" },
];
