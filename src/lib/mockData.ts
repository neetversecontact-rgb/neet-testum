export type Subject = "physics" | "chemistry" | "biology";

export type Option = { id: "A" | "B" | "C" | "D"; text: string };

export type Question = {
  id: string;
  subject: Subject;
  chapter: string;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  text: string;
  options: Option[];
  correct: "A" | "B" | "C" | "D";
  explanation: string;
  source?: string;
};

export const SUBJECT_META: Record<
  Subject,
  { label: string; chapters: number; questions: string; color: string }
> = {
  physics: { label: "Physics", chapters: 29, questions: "15K+", color: "physics" },
  chemistry: { label: "Chemistry", chapters: 30, questions: "15K+", color: "chemistry" },
  biology: { label: "Biology", chapters: 38, questions: "15K+", color: "biology" },
};

const Q = (
  id: string,
  subject: Subject,
  chapter: string,
  topic: string,
  difficulty: Question["difficulty"],
  text: string,
  opts: [string, string, string, string],
  correct: Question["correct"],
  explanation: string,
  source = "NEET PYQ",
): Question => ({
  id,
  subject,
  chapter,
  topic,
  difficulty,
  text,
  options: [
    { id: "A", text: opts[0] },
    { id: "B", text: opts[1] },
    { id: "C", text: opts[2] },
    { id: "D", text: opts[3] },
  ],
  correct,
  explanation,
  source,
});

export const QUESTIONS: Question[] = [
  // Physics
  Q("p1", "physics", "Kinematics", "Projectile Motion", "Medium",
    "A projectile is launched at 45° with speed 20 m/s. What is its maximum height? (g = 10 m/s²)",
    ["5 m", "10 m", "20 m", "40 m"], "B",
    "H = u²sin²θ / 2g = (400 × 0.5) / 20 = 10 m."),
  Q("p2", "physics", "Laws of Motion", "Friction", "Easy",
    "Coefficient of friction depends on which of the following?",
    ["Area of contact", "Nature of surfaces", "Mass of body", "Velocity"], "B",
    "Friction depends primarily on the nature of contacting surfaces, not area or mass."),
  Q("p3", "physics", "Electrostatics", "Coulomb's Law", "Medium",
    "Force between two point charges in vacuum is F. If a dielectric of constant K is introduced, the new force is:",
    ["F", "F/K", "FK", "F/K²"], "B",
    "F' = F / K when a dielectric medium replaces vacuum."),
  Q("p4", "physics", "Current Electricity", "Ohm's Law", "Easy",
    "Resistance of a wire is 4Ω. If length is doubled keeping volume constant, new resistance is:",
    ["8Ω", "16Ω", "4Ω", "2Ω"], "B",
    "R ∝ L²/V — doubling L (constant volume) gives R' = 4R = 16Ω."),
  Q("p5", "physics", "Modern Physics", "Photoelectric Effect", "Hard",
    "Threshold frequency of a metal is ν₀. Stopping potential for incident frequency 2ν₀ is:",
    ["hν₀/e", "2hν₀/e", "3hν₀/e", "hν₀/2e"], "A",
    "eV = h(2ν₀ - ν₀) = hν₀, so V = hν₀/e."),

  // Chemistry
  Q("c1", "chemistry", "Atomic Structure", "Quantum Numbers", "Medium",
    "Maximum number of electrons in a subshell with l = 3 is:",
    ["6", "10", "14", "18"], "C",
    "For l=3 (f-subshell), max electrons = 2(2l+1) = 14."),
  Q("c2", "chemistry", "Chemical Bonding", "Hybridization", "Medium",
    "Hybridization of central atom in XeF₄ is:",
    ["sp³", "sp³d", "sp³d²", "dsp²"], "C",
    "XeF₄ has 4 bond pairs + 2 lone pairs → sp³d² hybridization (square planar)."),
  Q("c3", "chemistry", "Thermodynamics", "Enthalpy", "Easy",
    "For an exothermic reaction, ΔH is:",
    ["Positive", "Negative", "Zero", "Infinite"], "B",
    "Exothermic reactions release heat → ΔH < 0."),
  Q("c4", "chemistry", "Organic Chemistry", "Aromaticity", "Medium",
    "Which of the following is aromatic?",
    ["Cyclobutadiene", "Cyclopentadienyl anion", "Cycloheptatriene", "Cyclooctatetraene"], "B",
    "Cyclopentadienyl anion has 6 π electrons satisfying Hückel's (4n+2) rule."),
  Q("c5", "chemistry", "p-Block Elements", "Group 15", "Hard",
    "Which gas is liberated when NH₄NO₂ is heated?",
    ["N₂O", "NO", "N₂", "NO₂"], "C",
    "NH₄NO₂ → N₂ + 2H₂O on heating."),

  // Biology
  Q("b1", "biology", "Cell Biology", "Cell Organelles", "Easy",
    "Powerhouse of the cell is:",
    ["Ribosome", "Mitochondria", "Lysosome", "Golgi apparatus"], "B",
    "Mitochondria produce ATP via oxidative phosphorylation."),
  Q("b2", "biology", "Genetics", "Mendelian Inheritance", "Medium",
    "Ratio of phenotypes in a typical dihybrid cross is:",
    ["3:1", "1:2:1", "9:3:3:1", "1:1:1:1"], "C",
    "Mendel's dihybrid cross gives 9:3:3:1 phenotypic ratio in F₂."),
  Q("b3", "biology", "Human Physiology", "Circulatory System", "Easy",
    "Normal human heartbeat rate per minute at rest is approximately:",
    ["50", "72", "90", "120"], "B",
    "Resting adult heart rate averages ~72 bpm."),
  Q("b4", "biology", "Plant Physiology", "Photosynthesis", "Medium",
    "Site of light reactions in chloroplast is:",
    ["Stroma", "Thylakoid membrane", "Outer membrane", "Inter-membrane space"], "B",
    "Light reactions occur on thylakoid membranes; Calvin cycle in stroma."),
  Q("b5", "biology", "Ecology", "Ecosystem", "Hard",
    "10% Law of energy transfer was proposed by:",
    ["Tansley", "Lindeman", "Odum", "Haeckel"], "B",
    "Raymond Lindeman (1942) formulated the 10% law of energy transfer."),
  Q("b6", "biology", "Reproduction", "Human Reproduction", "Medium",
    "Site of fertilization in humans is:",
    ["Ovary", "Uterus", "Fallopian tube (ampulla)", "Cervix"], "C",
    "Fertilization typically occurs in the ampullary region of the fallopian tube."),
];

export function questionsBySubject(s: Subject) {
  return QUESTIONS.filter((q) => q.subject === s);
}

export type TestMeta = {
  id: string;
  title: string;
  subject: Subject | "full";
  duration: number; // minutes
  totalQuestions: number;
  marks: number;
  badge?: string;
};

export const TEST_SERIES: TestMeta[] = [
  { id: "t1", title: "NEET Mock Test 01 — Full Syllabus", subject: "full", duration: 30, totalQuestions: 12, marks: 48, badge: "New" },
  { id: "t2", title: "Physics Chapter Test — Mechanics", subject: "physics", duration: 15, totalQuestions: 5, marks: 20 },
  { id: "t3", title: "Chemistry Sprint — Organic", subject: "chemistry", duration: 15, totalQuestions: 5, marks: 20 },
  { id: "t4", title: "Biology Marathon — Cell & Genetics", subject: "biology", duration: 20, totalQuestions: 6, marks: 24, badge: "Popular" },
];

export function questionsForTest(testId: string): Question[] {
  const t = TEST_SERIES.find((x) => x.id === testId);
  if (!t) return [];
  if (t.subject === "full") return QUESTIONS.slice(0, t.totalQuestions);
  return questionsBySubject(t.subject).slice(0, t.totalQuestions);
}

export const LEADERBOARD = [
  { rank: 1, name: "Aarav Mehta", score: 698, accuracy: 96, city: "Kota" },
  { rank: 2, name: "Saanvi Iyer", score: 692, accuracy: 95, city: "Hyderabad" },
  { rank: 3, name: "Vihaan Rao", score: 685, accuracy: 94, city: "Delhi" },
  { rank: 4, name: "Diya Sharma", score: 678, accuracy: 93, city: "Pune" },
  { rank: 5, name: "Arjun Nair", score: 671, accuracy: 92, city: "Bengaluru" },
  { rank: 6, name: "Myra Kapoor", score: 664, accuracy: 91, city: "Mumbai" },
  { rank: 7, name: "Kabir Singh", score: 658, accuracy: 90, city: "Lucknow" },
  { rank: 8, name: "Anaya Joshi", score: 651, accuracy: 90, city: "Ahmedabad" },
  { rank: 9, name: "Reyansh Das", score: 645, accuracy: 89, city: "Kolkata" },
  { rank: 10, name: "Ishita Verma", score: 639, accuracy: 88, city: "Jaipur" },
];

export const WEEKLY_PERF = [
  { day: "Mon", solved: 42, accuracy: 71 },
  { day: "Tue", solved: 65, accuracy: 78 },
  { day: "Wed", solved: 51, accuracy: 74 },
  { day: "Thu", solved: 88, accuracy: 82 },
  { day: "Fri", solved: 72, accuracy: 80 },
  { day: "Sat", solved: 110, accuracy: 86 },
  { day: "Sun", solved: 96, accuracy: 84 },
];
