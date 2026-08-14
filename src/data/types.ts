// ===== ТИПЫ =====

export type Subject =
  | "informatics"
  | "math"
  | "physics"
  | "chemistry"
  | "biology"
  | "geography"
  | "history"
  | "russian"
  | "foreign"
  | "social";

export type BenefitType = "bvi" | "kvota" | "points" | "special" | "other";

export type Status = "confirmed" | "draft" | "disputed" | "removed";

// ===== ИНТЕРФЕЙСЫ =====

export interface University {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  city: string;
  description: string;
  accent: "red" | "blue" | "green" | "purple" | "amber";
  websiteUrl: string;
}

export interface Program {
  id: string;
  universityId: string;
  name: string;
  level: "bachelor" | "magister" | "phd";
  profile: string;
  profileShort: string;
  code: string;
}

export interface Olympiad {
  id: string;
  name: string;
  organizer: string;
  description: string;
  officialWebsiteUrl: string;
  classes: number[];
  subjectLevels: Array<{ subject: Subject; level: number }>;
  status: Status;
}

export interface Benefit {
  id: string;
  olympiadId: string;
  universityId: string;
  programId?: string;
  subject?: Subject;
  benefitType: BenefitType;
  diploma: "winner" | "prize" | "participant" | "all";
  conditions: string;
  sourceUrl: string;
  year: number;
  status: Status;
}
