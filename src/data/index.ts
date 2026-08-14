import { universities } from "./universities";
import { programs } from "./programs";
import { olympiads } from "./olympiads";
import { benefits } from "./benefits";
import type {
  Benefit,
  BenefitTypeId,
  Olympiad,
  OlympiadLevelId,
  Program,
  SubjectId,
  University,
} from "./types";

export { universities, programs, olympiads, benefits };
export * from "./types";

/* ---------------- словари по id ---------------- */

const universityMap = new Map(universities.map((u) => [u.id, u]));
const programMap = new Map(programs.map((p) => [p.id, p]));
const olympiadMap = new Map(olympiads.map((o) => [o.id, o]));

export const getUniversity = (id: string): University | undefined => universityMap.get(id);
export const getUniversityBySlug = (slug: string): University | undefined =>
  universities.find((u) => u.slug === slug);
export const getProgram = (id: string): Program | undefined => programMap.get(id);
export const getOlympiad = (id: string): Olympiad | undefined => olympiadMap.get(id);

/* ---------------- агрегаты ---------------- */

export const programsOf = (universityId: string): Program[] =>
  programs.filter((p) => p.universityId === universityId);

export const benefitsOfUniversity = (universityId: string): Benefit[] =>
  benefits.filter((b) => b.universityId === universityId);

export const benefitsOfOlympiad = (olympiadId: string): Benefit[] =>
  benefits.filter((b) => b.olympiadId === olympiadId);

/** Олимпиады, имеющие хотя бы одну льготу в данном вузе */
export const olympiadsOfUniversity = (universityId: string): Olympiad[] => {
  const ids = new Set(benefitsOfUniversity(universityId).map((b) => b.olympiadId));
  return olympiads.filter((o) => ids.has(o.id));
};

export interface UniversityStats {
  university: University;
  programCount: number;
  olympiadCount: number;
  benefitCount: number;
  confirmedCount: number;
  needsVerificationCount: number;
}

export const universityStats = (): UniversityStats[] =>
  universities.map((university) => {
    const b = benefitsOfUniversity(university.id);
    return {
      university,
      programCount: programsOf(university.id).length,
      olympiadCount: olympiadsOfUniversity(university.id).length,
      benefitCount: b.length,
      confirmedCount: b.filter((x) => x.status === "confirmed").length,
      needsVerificationCount: b.filter((x) => x.status === "needs_verification").length,
    };
  });

/** Топ олимпиад по числу льгот в базе */
export const popularOlympiads = (limit = 6): { olympiad: Olympiad; benefitCount: number }[] =>
  olympiads
    .map((o) => ({ olympiad: o, benefitCount: benefitsOfOlympiad(o.id).length }))
    .sort((a, b) => b.benefitCount - a.benefitCount)
    .slice(0, limit);

/* ---------------- фильтры олимпиад ---------------- */

export interface OlympiadFilter {
  query?: string;
  universityId?: string | null;
  subjects?: SubjectId[];
  levels?: OlympiadLevelId[];
  benefitTypes?: BenefitTypeId[];
}

export const filterOlympiads = (f: OlympiadFilter): Olympiad[] => {
  const q = f.query?.trim().toLowerCase() ?? "";
  return olympiads
    .filter((o) => {
      if (q) {
        const hay = `${o.name} ${o.shortName} ${o.organizer}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (f.universityId) {
        const has = benefits.some(
          (b) => b.universityId === f.universityId && b.olympiadId === o.id,
        );
        if (!has) return false;
      }
      if (f.subjects && f.subjects.length > 0) {
        const ok = o.subjectLevels.some((sl) => f.subjects!.includes(sl.subject));
        if (!ok) return false;
      }
      if (f.levels && f.levels.length > 0) {
        const ok = o.subjectLevels.some((sl) => f.levels!.includes(sl.level));
        if (!ok) return false;
      }
      if (f.benefitTypes && f.benefitTypes.length > 0) {
        const ok = benefits.some(
          (b) => b.olympiadId === o.id && f.benefitTypes!.includes(b.benefitType),
        );
        if (!ok) return false;
      }
      return true;
    })
    .sort((a, b) => benefitsOfOlympiad(b.id).length - benefitsOfOlympiad(a.id).length);
};

/* ---------------- фильтры льгот (для страницы вуза) ---------------- */

export interface BenefitFilter {
  query?: string;
  subject?: SubjectId | null;
  level?: OlympiadLevelId | null;
  benefitType?: BenefitTypeId | null;
}

export const filterBenefits = (universityId: string, f: BenefitFilter): Benefit[] =>
  benefitsOfUniversity(universityId)
    .filter((b) => {
      const o = getOlympiad(b.olympiadId);
      if (!o) return false;
      if (f.subject) {
        const subjectMatches = b.subject ? b.subject === f.subject : o.subjectLevels.some((sl) => sl.subject === f.subject);
        if (!subjectMatches) return false;
      }
      if (f.level) {
        const levelMatches = o.subjectLevels.some(
          (sl) => sl.level === f.level && (!f.subject || sl.subject === f.subject),
        );
        if (!levelMatches) return false;
      }
      if (f.benefitType && b.benefitType !== f.benefitType) return false;
      if (f.query?.trim()) {
        const q = f.query.trim().toLowerCase();
        if (!`${o.name} ${o.shortName}`.toLowerCase().includes(q)) return false;
      }
      return true;
    })
    .sort((a, b) => {
      const order: BenefitTypeId[] = ["bvi", "score100", "other"];
      const byType = order.indexOf(a.benefitType) - order.indexOf(b.benefitType);
      if (byType !== 0) return byType;
      const oa = getOlympiad(a.olympiadId)?.name ?? "";
      const ob = getOlympiad(b.olympiadId)?.name ?? "";
      return oa.localeCompare(ob, "ru");
    });

/* ---------------- источники для страницы «Источники» ---------------- */

export interface SourceGroup {
  university: University;
  retrievedAt: string;
  confirmed: number;
  needsVerification: number;
  total: number;
}

export const sourceGroups = (): SourceGroup[] =>
  universities.map((university) => {
    const b = benefitsOfUniversity(university.id);
    const dates = b.map((x) => x.retrievedAt).sort();
    return {
      university,
      retrievedAt: dates[dates.length - 1] ?? "—",
      confirmed: b.filter((x) => x.status === "confirmed").length,
      needsVerification: b.filter((x) => x.status === "needs_verification").length,
      total: b.length,
    };
  });

export const globalStats = {
  universities: universities.length,
  programs: programs.length,
  olympiads: olympiads.length,
  benefits: benefits.length,
  confirmedBenefits: benefits.filter((b) => b.status === "confirmed").length,
  dataYear: 2026,
};
