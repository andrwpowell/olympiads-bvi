import { type ComponentPropsWithoutRef, type ReactNode } from "react";
import { SUBJECTS, BENEFIT_TYPES, STATUS_TYPES, type Subject, type BenefitType, type Status } from "../data";

/* ---------- иконки ---------- */
export const IconArrow = (props: ComponentPropsWithoutRef<"svg">) => (
  <svg viewBox="0 0 20 20" fill="none" {...props}>
    <path d="m7.5 5 5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconExternal = (props: ComponentPropsWithoutRef<"svg">) => (
  <svg viewBox="0 0 20 20" fill="none" {...props}>
    <path
      d="M12.5 4.5v4M4.5 5.5h7m-7 4h4m-4 4h7m-7-8v8h8"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const IconAlert = (props: ComponentPropsWithoutRef<"svg">) => (
  <svg viewBox="0 0 20 20" fill="none" {...props}>
    <path
      d="M10 4.5v6m0 4v-1M4.5 10h11"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* ---------- бейджики ---------- */
export const SubjectBadge = ({ subject, short }: { subject: Subject; short?: boolean }) => {
  const s = SUBJECTS[subject];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${s.chip} ${s.border}`}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: s.color }} />
      {short ? s.short : s.full}
    </span>
  );
};

export const LevelBadge = ({ level, short }: { level: number; short?: boolean }) => (
  <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-600/50 px-2.5 py-0.5 text-[11px] font-medium text-slate-300">
    <span className="outline-number font-display text-[10px] font-bold leading-none text-slate-500">{level}</span>
    {!short && <span>уровень</span>}
  </span>
);

export const BenefitBadge = ({ type }: { type: BenefitType }) => {
  const t = BENEFIT_TYPES[type];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${t.chip} ${t.border}`}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: t.color }} />
      {t.short}
    </span>
  );
};

/* ---------- статус ---------- */
export const StatusChip = ({ status, hint }: { status: Status; hint?: boolean }) => {
  const s = STATUS_TYPES[status];
  const content = (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10.5px] font-medium ${s.chip} ${s.border}`}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: s.color }} />
      {s.label}
    </span>
  );

  if (!hint) return content;

  return (
    <span className="group relative inline-block">
      {content}
      {s.hint && (
        <span className="absolute -top-8 left-1/2 z-10 hidden -translate-x-1/2 whitespace-nowrap rounded bg-slate-700 px-2 py-1 text-[10px] text-slate-200 shadow-lg group-hover:block">
          {s.hint}
        </span>
      )}
    </span>
  );
};

/* ---------- контейнер для текста с отступом сверху ---------- */
export const Section = ({ title, description, children }: { title: string; description?: string; children: ReactNode }) => (
  <section className="mt-16 first:mt-0">
    <div className="mx-auto max-w-4xl">
      <h2 className="font-display text-2xl font-bold text-slate-100">{title}</h2>
      {description && <p className="mt-3 text-[15px] leading-relaxed text-slate-400">{description}</p>}
      <div className="mt-8">{children}</div>
    </div>
  </section>
);

/* ---------- ячейка для сетки ---------- */
export const GridCell = ({ children }: { children: ReactNode }) => (
  <div className="md:col-span-2 lg:col-span-1">{children}</div>
);
