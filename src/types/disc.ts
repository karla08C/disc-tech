export type DiscLetter = 'D' | 'I' | 'S' | 'C';

export interface DiscPercentages {
  D: number;
  I: number;
  S: number;
  C: number;
}

export interface DiscCounts {
  D: number;
  I: number;
  S: number;
  C: number;
}

export interface QuestionOption {
  text: string;
  letter: DiscLetter;
}

export interface Question {
  id: number;
  prompt: string;
  options: QuestionOption[];
}

export interface DebugItem {
  issue: string;
  fix: string;
}

export interface ProfileDetails {
  letter: DiscLetter;
  title: string;
  tagline: string;
  summary: string;
  superpowers: string[];
  debugs: DebugItem[];
  careers: string[];
  growthAreas: string[];
  color: string;
  accentColor: string;
  badgeBg: string;
  iconName: string;
}

export interface DualProfile {
  code: string;
  title: string;
  subtitle: string;
  description: string;
  naturalStrength: string;
}

export interface TechCareer {
  id: string;
  title: string;
  primaryDisc: DiscLetter;
  secondaryDisc?: DiscLetter;
  description: string;
  salaryRange: string;
  keySkills: string[];
  weights: Record<DiscLetter, number>;
  dailyRoutine?: string[];
  typicalDeliverables?: string[];
  commonChallenges?: string;
  discFitReason?: string;
  roadmapUrl?: string;
  roadmapLabel?: string;
}

export interface TestRecord {
  id: string;
  name: string;
  date: string;
  dominant: DiscLetter;
  secondary: DiscLetter;
  pct: DiscPercentages;
  note?: string;
  mode?: QuizMode;
}

export type QuizMode = 'standard' | 'beginner';

export interface PreviousBackground {
  id: string;
  label: string;
  examples: string;
  transferableSkills: string[];
  recommendedAreaIds: string[];
  transitionTip: string;
}

export interface EntryTechArea {
  id: string;
  title: string;
  shortName: string;
  codeLevel: 'no-code' | 'low-code' | 'code';
  codeLevelLabel: string;
  entryCurve: string;
  primaryDisc: DiscLetter;
  secondaryDisc: DiscLetter;
  weights: Record<DiscLetter, number>;
  affinityFocus: 'visual' | 'data' | 'logic' | 'people';
  summary: string;
  dayToDay: string;
  likeIf: string[];
  avoidIf: string[];
  entryRoles: string[];
  salaryEntryRange: string;
  first30Days: {
    week: string;
    focus: string;
  }[];
  starterProject: string;
  freeTools: string[];
  roadmapUrl?: string;
  roadmapLabel?: string;
}

export interface RoadmapStage {
  step: string;
  title: string;
  summary: string;
  topics: string[];
}

export interface RoadmapTrack {
  id: string;
  title: string;
  category: 'design' | 'engineering' | 'product-data' | 'infra-sec';
  categoryLabel: string;
  url: string;
  primaryDisc: DiscLetter;
  secondaryDisc: DiscLetter;
  weights: Record<DiscLetter, number>;
  overview: string;
  discAdvice: Record<DiscLetter, string>;
  stages: RoadmapStage[];
}


