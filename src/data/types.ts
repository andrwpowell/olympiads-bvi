/**
 * ============================================================
 *  МОДЕЛЬ ДАННЫХ СПРАВОЧНИКА
 *  Все записи редактируются вручную в файлах src/data/*.ts
 *
 *  status:
 *    - "confirmed"        — проверено по официальному источнику (см. sourceUrl)
 *    - "needs_verification" — записана по типовым/прошлогодним схемам,
 *                             обязательна ручная проверка по правилам приёма
 *    - "draft"            — черновик, показывается только как заглушка
 * ============================================================
 */

export type SubjectId = "math" | "informatics" | "physics";

/** Уровень олимпиады: ВсОШ / международная / РСОШ 1-2-3 */
export type OlympiadLevelId = "vsosh" | "international" | "rsosh1" | "rsosh2" | "rsosh3";

export type BenefitTypeId = "bvi" | "score100" | "other";

/** Категория диплома, для которой действует льгота */
export type DiplomaId = "winner" | "prize" | "winner-prize";

export type DataStatus = "confirmed" | "needs_verification" | "draft";

/** Уровень олимпиады по конкретному предмету (у одной олимпиады уровни различаются) */
export interface SubjectLevel {
  subject: SubjectId;
  level: OlympiadLevelId;
}

export interface University {
  id: string;
  slug: string;
  name: string;
  shortName: string; // «ВШЭ», «МФТИ»…
  city: string;
  website: string;
  admissionPageUrl: string; // страница приёмной комиссии / правил приёма
  description: string;
  /** акцентный цвет карточки вуза */
  accent: "sky" | "cyan" | "rose" | "violet" | "teal" | "amber";
}

export interface Program {
  id: string;
  universityId: string;
  name: string;
  /** код направления, если известен (01.03.02 и т.п.) */
  code?: string;
  faculty: string;
  degree: "бакалавриат" | "специалитет";
  subjects: SubjectId[];
  sourceUrl: string;
  note?: string;
}

export interface Olympiad {
  id: string;
  name: string;
  shortName: string;
  organizer: string;
  description: string;
  officialWebsiteUrl: string;
  /** уровни по предметам (по Перечню РСОШ или статусу ВсОШ/международной) */
  subjectLevels: SubjectLevel[];
  /** классы участия */
  classes: number[];
  sourceUrl: string;
  retrievedAt: string; // YYYY-MM-DD
  year: number; // год приёма, к которому относится запись
  status: DataStatus;
}

export interface Benefit {
  id: string;
  universityId: string;
  /** null = льгота действует на все профильные IT/мат. программы вуза */
  programId: string | null;
  olympiadId: string;
  /** предмет, по которому действует льгота; null — по профилю олимпиады */
  subject: SubjectId | null;
  benefitType: BenefitTypeId;
  diploma: DiplomaId;
  conditions: string;
  year: number;
  sourceUrl: string;
  retrievedAt: string;
  status: DataStatus;
}

/* ================= СЛОВАРИ ================= */

export const SUBJECTS: Record<SubjectId, { label: string; short: string; badge: string; dot: string }> = {
  math: {
    label: "Математика",
    short: "мат",
    badge: "border-sky-400/30 bg-sky-400/10 text-sky-300",
    dot: "bg-sky-400",
  },
  informatics: {
    label: "Информатика",
    short: "инф",
    badge: "border-cyan-400/30 bg-cyan-400/10 text-cyan-300",
    dot: "bg-cyan-400",
  },
  physics: {
    label: "Физика",
    short: "физ",
    badge: "border-amber-400/30 bg-amber-400/10 text-amber-300",
    dot: "bg-amber-400",
  },
};

export const LEVELS: Record<OlympiadLevelId, { label: string; short: string; badge: string }> = {
  vsosh: { label: "ВсОШ · заключительный этап", short: "ВсОШ", badge: "border-amber-300/40 bg-amber-300/10 text-amber-200" },
  international: { label: "Международная олимпиада", short: "Международная", badge: "border-rose-400/40 bg-rose-400/10 text-rose-300" },
  rsosh1: { label: "РСОШ · уровень 1", short: "РСОШ-1", badge: "border-sky-400/40 bg-sky-400/10 text-sky-300" },
  rsosh2: { label: "РСОШ · уровень 2", short: "РСОШ-2", badge: "border-teal-400/40 bg-teal-400/10 text-teal-300" },
  rsosh3: { label: "РСОШ · уровень 3", short: "РСОШ-3", badge: "border-slate-400/30 bg-slate-400/10 text-slate-300" },
};

export const BENEFIT_TYPES: Record<BenefitTypeId, { label: string; short: string; badge: string; solid: string }> = {
  bvi: {
    label: "БВИ — без вступительных испытаний",
    short: "БВИ",
    badge: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
    solid: "bg-emerald-400/90 text-emerald-950",
  },
  score100: {
    label: "100 баллов по предмету",
    short: "100 баллов",
    badge: "border-sky-400/40 bg-sky-400/10 text-sky-300",
    solid: "bg-sky-400/90 text-sky-950",
  },
  other: {
    label: "Другая льгота / дополнительные баллы",
    short: "Другое",
    badge: "border-slate-400/30 bg-slate-400/10 text-slate-300",
    solid: "bg-slate-400/90 text-slate-950",
  },
};

export const DIPLOMAS: Record<DiplomaId, string> = {
  winner: "победитель",
  prize: "призёр",
  "winner-prize": "победитель / призёр",
};

export const STATUSES: Record<DataStatus, { label: string; badge: string; dot: string; hint: string }> = {
  confirmed: {
    label: "Подтверждено",
    badge: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
    dot: "bg-emerald-400",
    hint: "Проверено по официальному документу — ссылка в колонке «Источник».",
  },
  needs_verification: {
    label: "Требует проверки",
    badge: "border-amber-400/40 bg-amber-400/10 text-amber-300",
    dot: "bg-amber-400",
    hint: "Записано по типовым схемам прошлых лет. Обязательно сверьте с правилами приёма вуза.",
  },
  draft: {
    label: "Черновик",
    badge: "border-slate-400/30 bg-slate-400/10 text-slate-300",
    dot: "bg-slate-400",
    hint: "Запись добавлена как заготовка и ещё не заполнена.",
  },
};

export const UNIVERSITY_ACCENTS: Record<
  University["accent"],
  { text: string; border: string; chip: string; glow: string }
> = {
  sky: { text: "text-sky-300", border: "hover:border-sky-400/50", chip: "bg-sky-400/10 text-sky-300 border-sky-400/30", glow: "from-sky-400/20" },
  cyan: { text: "text-cyan-300", border: "hover:border-cyan-400/50", chip: "bg-cyan-400/10 text-cyan-300 border-cyan-400/30", glow: "from-cyan-400/20" },
  rose: { text: "text-rose-300", border: "hover:border-rose-400/50", chip: "bg-rose-400/10 text-rose-300 border-rose-400/30", glow: "from-rose-400/20" },
  violet: { text: "text-violet-300", border: "hover:border-violet-400/50", chip: "bg-violet-400/10 text-violet-300 border-violet-400/30", glow: "from-violet-400/20" },
  teal: { text: "text-teal-300", border: "hover:border-teal-400/50", chip: "bg-teal-400/10 text-teal-300 border-teal-400/30", glow: "from-teal-400/20" },
  amber: { text: "text-amber-300", border: "hover:border-amber-400/50", chip: "bg-amber-400/10 text-amber-300 border-amber-400/30", glow: "from-amber-400/20" },
};
