import type { ReactNode } from "react";
import {
  BENEFIT_TYPES,
  DIPLOMAS,
  LEVELS,
  STATUSES,
  SUBJECTS,
  type BenefitTypeId,
  type DataStatus,
  type DiplomaId,
  type OlympiadLevelId,
  type SubjectId,
} from "../data";

/* ================= кастомные SVG-иконки ================= */

const iconBase = "inline-block shrink-0";

export const IconExternal = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg viewBox="0 0 16 16" fill="none" className={`${iconBase} ${className}`} aria-hidden>
    <path d="M6.5 3.5H3.75A1.25 1.25 0 0 0 2.5 4.75v7.5a1.25 1.25 0 0 0 1.25 1.25h7.5a1.25 1.25 0 0 0 1.25-1.25V9.5M9.5 2.5h4v4M13 3 7 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconSearch = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 16 16" fill="none" className={`${iconBase} ${className}`} aria-hidden>
    <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.4" />
    <path d="m13.5 13.5-3.2-3.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

export const IconArrow = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 16 16" fill="none" className={`${iconBase} ${className}`} aria-hidden>
    <path d="M2.5 8h10.5M9 3.5 13.5 8 9 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconMedal = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 20 20" fill="none" className={`${iconBase} ${className}`} aria-hidden>
    <path d="M6 2h8l-2.2 5H8.2L6 2Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    <circle cx="10" cy="12.5" r="5" stroke="currentColor" strokeWidth="1.4" />
    <path d="m8.2 12.6 1.3 1.3 2.4-2.8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconShield = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 20 20" fill="none" className={`${iconBase} ${className}`} aria-hidden>
    <path d="M10 2 4 4.5v5c0 4 2.6 6.8 6 8.5 3.4-1.7 6-4.5 6-8.5v-5L10 2Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    <path d="m7.3 9.8 1.8 1.8 3.6-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconAlert = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 20 20" fill="none" className={`${iconBase} ${className}`} aria-hidden>
    <path d="M10 3 1.8 16.5h16.4L10 3Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    <path d="M10 8v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="10" cy="14.3" r="0.9" fill="currentColor" />
  </svg>
);

export const IconDoc = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 20 20" fill="none" className={`${iconBase} ${className}`} aria-hidden>
    <path d="M5 2.5h6.5L15 6v11.5H5V2.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    <path d="M11.5 2.5V6H15M7.5 10h5M7.5 13h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

export const IconCheck = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 16 16" fill="none" className={`${iconBase} ${className}`} aria-hidden>
    <path d="m2.5 8.5 3.5 3.5 7.5-8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconFilter = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 16 16" fill="none" className={`${iconBase} ${className}`} aria-hidden>
    <path d="M2 3.5h12M4.5 8h7M6.5 12.5h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

/* ================= бейджи ================= */

const badgeBase =
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium leading-5 whitespace-nowrap";

export const SubjectBadge = ({ subject, short = false }: { subject: SubjectId; short?: boolean }) => (
  <span className={`${badgeBase} ${SUBJECTS[subject].badge}`}>
    <span className={`h-1.5 w-1.5 rounded-full ${SUBJECTS[subject].dot}`} />
    {short ? SUBJECTS[subject].short : SUBJECTS[subject].label}
  </span>
);

export const LevelBadge = ({ level, short = false }: { level: OlympiadLevelId; short?: boolean }) => (
  <span className={`${badgeBase} ${LEVELS[level].badge}`}>{short ? LEVELS[level].short : LEVELS[level].label}</span>
);

export const BenefitBadge = ({ type, solid = false }: { type: BenefitTypeId; solid?: boolean }) => (
  <span className={`${badgeBase} ${solid ? BENEFIT_TYPES[type].solid : BENEFIT_TYPES[type].badge}`}>
    {type === "bvi" && <IconMedal className="w-3.5 h-3.5" />}
    {type === "score100" && <span className="font-mono font-bold text-[10px]">100</span>}
    {BENEFIT_TYPES[type].short}
  </span>
);

export const StatusChip = ({ status, hint = false }: { status: DataStatus; hint?: boolean }) => {
  const s = STATUSES[status];
  return (
    <span className={`${badgeBase} ${s.badge}`} title={hint ? s.hint : undefined}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot} ${status === "needs_verification" ? "animate-pulse-dot" : ""}`} />
      {s.label}
    </span>
  );
};

export const DiplomaLabel = ({ diploma }: { diploma: DiplomaId }) => (
  <span className="text-slate-300 text-[12px] capitalize">{DIPLOMAS[diploma]}</span>
);

/* ================= заголовки секций ================= */

export const SectionHeading = ({
  kicker,
  title,
  children,
  className = "",
}: {
  kicker: string;
  title: ReactNode;
  children?: ReactNode;
  className?: string;
}) => (
  <div className={`mb-8 ${className}`}>
    <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-signal-300/80 mb-3 flex items-center gap-2">
      <span className="h-px w-6 bg-signal-400/60" />
      {kicker}
    </p>
    <h2 className="font-display text-[clamp(1.4rem,3.2vw,2.2rem)] font-bold leading-tight text-slate-50">{title}</h2>
    {children && <div className="mt-3 max-w-2xl text-[15px] leading-relaxed text-slate-400">{children}</div>}
  </div>
);

/* ================= пустое состояние ================= */

export const EmptyState = ({ onReset, hasFilters }: { onReset?: () => void; hasFilters: boolean }) => (
  <div className="rounded-xl border border-dashed border-slate-600/40 bg-ink-850/60 px-6 py-16 text-center">
    <svg viewBox="0 0 96 64" className="mx-auto mb-5 h-16 w-24 text-slate-600" fill="none" aria-hidden>
      <circle cx="38" cy="28" r="17" stroke="currentColor" strokeWidth="2.5" />
      <path d="m51 41 12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M30 25c2-3 6-4.5 9-3.5M31.5 35.5c4 3 9.5 2.5 13-1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M76 14v8M72 18h8M84 40v6M81 43h6" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
    </svg>
    <p className="font-display text-lg font-semibold text-slate-200">По этим фильтрам ничего не найдено</p>
    <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-400">
      Попробуйте убрать часть условий: например, оставить только предмет или только уровень олимпиады.
    </p>
    {hasFilters && onReset && (
      <button
        onClick={onReset}
        className="mt-6 inline-flex items-center gap-2 rounded-lg border border-sky-400/40 bg-sky-400/10 px-4 py-2 text-sm font-medium text-sky-300 transition hover:bg-sky-400/20"
      >
        Сбросить все фильтры
        <IconArrow className="h-3.5 w-3.5" />
      </button>
    )}
  </div>
);
