import { useMemo, useRef, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  BENEFIT_TYPES,
  LEVELS,
  SUBJECTS,
  UNIVERSITY_ACCENTS,
  benefits,
  getOlympiad,
  getProgram,
  getUniversityBySlug,
  programsOf,
  type Benefit,
  type BenefitTypeId,
  type Olympiad,
  type OlympiadLevelId,
  type Program,
  type SubjectId,
} from "../data";
import { Reveal, usePageMeta, usePrefersReducedMotion } from "../lib/hooks";
import {
  EmptyState,
  IconArrow,
  IconExternal,
  IconFilter,
  IconSearch,
  StatusChip,
} from "../components/ui";
import { BenefitCard, BenefitRow } from "../components/cards";

/* ============================================================
   Страница вуза = строгий двухшаговый каскад.
   Шаг 1: выбор факультета (ОБЯЗАТЕЛЬНО). Пока он не сделан —
          ниже нет ни фильтров, ни олимпиад.
   Шаг 2: закреплённый чип «Вуз — Факультет ✕» + фильтры
          (только внутри факультета) + таблица олимпиад,
          связанных с факультетом через benefits.ts.
   ============================================================ */

interface ResultRow {
  benefit: Benefit;
  olympiad: Olympiad;
  universityWide: boolean;
}

const order = { bvi: 0, score100: 1, other: 2 } as const;

/** Все записи benefits.ts для пары «вуз + факультет» (включая действующие на все программы вуза) */
const rowsFor = (universityId: string, programId: string): ResultRow[] =>
  benefits
    .filter((b) => b.universityId === universityId && (b.programId === programId || b.programId === null))
    .map((benefit) => {
      const olympiad = getOlympiad(benefit.olympiadId);
      return olympiad ? { benefit, olympiad, universityWide: benefit.programId === null } : null;
    })
    .filter((r): r is ResultRow => r !== null)
    .sort((a, b) => {
      const byType = order[a.benefit.benefitType] - order[b.benefit.benefitType];
      if (byType !== 0) return byType;
      const byStatus = (a.benefit.status === "confirmed" ? 0 : 1) - (b.benefit.status === "confirmed" ? 0 : 1);
      if (byStatus !== 0) return byStatus;
      return a.olympiad.name.localeCompare(b.olympiad.name, "ru");
    });

const applicableCount = (universityId: string, programId: string): number =>
  benefits.filter((b) => b.universityId === universityId && (b.programId === programId || b.programId === null)).length;

interface LocalFilter {
  query: string;
  subject: SubjectId | null;
  level: OlympiadLevelId | null;
  benefitType: BenefitTypeId | null;
}

const EMPTY_FILTER: LocalFilter = { query: "", subject: null, level: null, benefitType: null };

const applyFilters = (rows: ResultRow[], f: LocalFilter): ResultRow[] =>
  rows.filter(({ benefit, olympiad }) => {
    if (f.benefitType && benefit.benefitType !== f.benefitType) return false;
    if (f.subject) {
      const ok = benefit.subject
        ? benefit.subject === f.subject
        : olympiad.subjectLevels.some((sl) => sl.subject === f.subject);
      if (!ok) return false;
    }
    if (f.level) {
      const ok = olympiad.subjectLevels.some(
        (sl) => sl.level === f.level && (!f.subject || sl.subject === f.subject),
      );
      if (!ok) return false;
    }
    const q = f.query.trim().toLowerCase();
    if (q && !`${olympiad.name} ${olympiad.shortName}`.toLowerCase().includes(q)) return false;
    return true;
  });

const chipCls = (active: boolean, activeCls: string) =>
  `rounded-full border px-3 py-1.5 text-[12px] font-medium transition ${
    active
      ? activeCls
      : "border-slate-700/70 bg-ink-800/70 text-slate-400 hover:border-slate-500 hover:text-slate-200"
  }`;

/* ================= ШАГ 1: карточка факультета ================= */

const ProgramCard = ({
  program,
  accent,
  count,
  delay,
  onSelect,
}: {
  program: Program;
  accent: keyof typeof UNIVERSITY_ACCENTS;
  count: number;
  delay: number;
  onSelect: () => void;
}) => {
  const a = UNIVERSITY_ACCENTS[accent];
  return (
    <Reveal delay={delay}>
      <button
        onClick={onSelect}
        className={`card-hover group relative w-full overflow-hidden rounded-xl border border-slate-700/60 bg-ink-850/80 p-5 text-left sm:p-6 ${a.border}`}
      >
        <span className={`pointer-events-none absolute -right-14 -top-16 h-40 w-40 rounded-full bg-gradient-to-br ${a.glow} to-transparent opacity-50 blur-2xl transition group-hover:opacity-100`} />
        <div className="relative">
          <div className="flex items-start justify-between gap-4">
            <span className={`font-display text-xl font-bold tracking-tight ${a.text}`}>{program.code ?? "•••"}</span>
            <span
              className={`shrink-0 rounded-full border px-2.5 py-1 font-mono text-[10.5px] ${
                count > 0
                  ? "border-emerald-400/30 bg-emerald-400/[0.08] text-emerald-300"
                  : "border-slate-700 text-slate-500"
              }`}
            >
              {count > 0 ? `${count} записей` : "нет записей"}
            </span>
          </div>
          <p className="mt-3 text-[15px] font-semibold leading-snug text-slate-100">{program.name}</p>
          <p className="mt-1.5 line-clamp-2 text-[12px] leading-relaxed text-slate-500">{program.faculty}</p>
          <div className="mt-4 flex items-center justify-between">
            <span className="rounded border border-slate-700/70 px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-wider text-slate-500">
              {program.degree}
            </span>
            <span className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-signal-300 opacity-80 transition group-hover:translate-x-0.5 group-hover:opacity-100">
              Выбрать <IconArrow className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </button>
    </Reveal>
  );
};

/* ================= ШАГ 2: фильтры + таблица внутри факультета ================= */

const FacultyResults = ({
  universityId,
  universityShort,
  program,
  accentChip,
  onReset,
}: {
  universityId: string;
  universityShort: string;
  program: Program;
  accentChip: string;
  onReset: () => void;
}) => {
  const [filter, setFilter] = useState<LocalFilter>(EMPTY_FILTER);

  const allRows = useMemo(() => rowsFor(universityId, program.id), [universityId, program.id]);
  const rows = useMemo(() => applyFilters(allRows, filter), [allRows, filter]);

  const filtersActive = Boolean(filter.query || filter.subject || filter.level || filter.benefitType);
  const wideCount = allRows.filter((r) => r.universityWide).length;

  return (
    <div className="step-in">
      {/* закреплённый чип выбора */}
      <div className="sticky top-[7.4rem] z-30 -mx-4 border-y border-slate-800/70 bg-ink-950/90 px-4 py-3 backdrop-blur-xl sm:top-24 sm:mx-0 sm:rounded-xl sm:border">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className={`inline-flex max-w-full items-center gap-2 rounded-lg border py-1.5 pl-3 pr-1.5 text-[12.5px] font-semibold ${accentChip}`}>
            <span className="truncate">
              {universityShort} — {program.name}
            </span>
            <button
              onClick={onReset}
              aria-label="Сбросить выбор факультета"
              title="Сбросить выбор факультета"
              className="grid h-6 w-6 shrink-0 place-items-center rounded-md transition hover:bg-white/10"
            >
              <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" aria-hidden>
                <path d="m2.5 2.5 7 7m0-7-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </span>
          <button
            onClick={onReset}
            className="rounded-lg border border-slate-600/70 px-3 py-1.5 text-[12px] font-medium text-slate-300 transition hover:border-sky-400/50 hover:text-signal-300"
          >
            Изменить факультет
          </button>
          <span className="ml-auto font-mono text-[11px] text-slate-500">
            записей: <span className="text-slate-200">{allRows.length}</span>
          </span>
        </div>
      </div>

      <h2 className="mt-8 font-display text-[clamp(1.25rem,2.6vw,1.7rem)] font-bold leading-tight text-slate-50">
        Шаг 2 — олимпиады для выбранного факультета
      </h2>
      <p className="mt-1.5 text-[13.5px] text-slate-400">
        Только записи, связанные с направлением «{program.name}» через базу льгот
        {wideCount > 0 && " (включая действующие на все программы вуза)"}.
      </p>

      {allRows.length === 0 ? (
        <div className="mt-6">
          <EmptyState hasFilters={false} />
          <div className="-mt-10 pb-4 text-center">
            <p className="mx-auto max-w-md text-[13px] leading-relaxed text-slate-400">
              По направлению «{program.name}» записей пока нет — база заполняется вручную. Актуальные льготы
              публикуются на официальной странице приёмной комиссии.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* фильтры по льготам — только внутри факультета */}
          <div className="mt-6 rounded-xl border border-slate-700/60 bg-ink-850/70 p-4 sm:p-5">
            <div className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.2em] text-slate-500">
              <IconFilter className="h-4 w-4" /> фильтры по льготам
              <span className="hidden text-slate-600 normal-case tracking-normal sm:inline">· только внутри выбранного факультета</span>
            </div>
            <div className="mt-3.5 flex flex-col gap-3">
              <label className="relative block">
                <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  value={filter.query}
                  onChange={(e) => setFilter((f) => ({ ...f, query: e.target.value }))}
                  placeholder="Поиск по названию олимпиады…"
                  className="w-full rounded-lg border border-slate-700/70 bg-ink-800/90 py-2.5 pl-9 pr-3 text-[13.5px] text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-sky-400/60 focus:ring-2 focus:ring-sky-400/20"
                />
              </label>
              <div className="flex flex-wrap items-center gap-2">
                <span className="mr-0.5 font-mono text-[10px] uppercase tracking-wider text-slate-600">предмет</span>
                {(Object.keys(SUBJECTS) as SubjectId[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => setFilter((f) => ({ ...f, subject: f.subject === s ? null : s }))}
                    className={chipCls(filter.subject === s, `${SUBJECTS[s].badge} border-current`)}
                  >
                    {SUBJECTS[s].label}
                  </button>
                ))}
                <span className="ml-2 mr-0.5 font-mono text-[10px] uppercase tracking-wider text-slate-600">уровень</span>
                {(Object.keys(LEVELS) as OlympiadLevelId[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => setFilter((f) => ({ ...f, level: f.level === l ? null : l }))}
                    className={chipCls(filter.level === l, `${LEVELS[l].badge} border-current`)}
                  >
                    {LEVELS[l].short}
                  </button>
                ))}
                <span className="ml-2 mr-0.5 font-mono text-[10px] uppercase tracking-wider text-slate-600">льгота</span>
                {(Object.keys(BENEFIT_TYPES) as BenefitTypeId[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setFilter((f) => ({ ...f, benefitType: f.benefitType === t ? null : t }))}
                    className={chipCls(filter.benefitType === t, `${BENEFIT_TYPES[t].badge} border-current`)}
                  >
                    {BENEFIT_TYPES[t].short}
                  </button>
                ))}
              </div>
            </div>
            {filtersActive && (
              <div className="mt-3.5 flex items-center justify-between border-t border-slate-800 pt-3">
                <p className="font-mono text-[11.5px] text-slate-500">
                  найдено: <span className="text-emerald-300">{rows.length}</span> из {allRows.length}
                </p>
                <button
                  onClick={() => setFilter(EMPTY_FILTER)}
                  className="text-[12px] font-medium text-signal-300 transition hover:text-sky-200"
                >
                  Сбросить фильтры
                </button>
              </div>
            )}
          </div>

          {/* результаты */}
          {rows.length === 0 ? (
            <div className="mt-6 rounded-xl border border-dashed border-slate-600/40 bg-ink-850/60 px-6 py-12 text-center">
              <p className="font-display text-base font-semibold text-slate-200">По этим фильтрам записей нет</p>
              <p className="mx-auto mt-1.5 max-w-md text-[13px] text-slate-400">
                Уберите часть условий — например, оставьте только тип льготы или только предмет.
              </p>
              <button
                onClick={() => setFilter(EMPTY_FILTER)}
                className="mt-5 inline-flex items-center gap-2 rounded-lg border border-sky-400/40 bg-sky-400/10 px-4 py-2 text-[13px] font-medium text-sky-300 transition hover:bg-sky-400/20"
              >
                Сбросить фильтры <IconArrow className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <>
              <div className="mt-6 hidden overflow-hidden rounded-xl border border-slate-700/50 bg-ink-850/60 lg:block">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-slate-700/60 bg-ink-900/80">
                      {["Олимпиада и уровень", "Предмет / программа", "Льгота", "Условия", "Статус и источник"].map((h) => (
                        <th key={h} className="px-4 py-3.5 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-slate-500">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => (
                      <BenefitRow key={r.benefit.id} benefit={r.benefit} />
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-6 grid gap-4 lg:hidden">
                {rows.map((r) => (
                  <BenefitCard key={r.benefit.id} benefit={r.benefit} />
                ))}
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-2.5">
                <StatusChip status="confirmed" hint />
                <StatusChip status="needs_verification" hint />
                <span className="text-[11.5px] text-slate-500">— наведите на бейдж, чтобы прочитать пояснение.</span>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

/* ================= страница ================= */

export default function UniversityPage() {
  const { slug = "" } = useParams();
  const [params, setParams] = useSearchParams();
  const reduced = usePrefersReducedMotion();

  const university = getUniversityBySlug(slug);
  const progs = useMemo(() => (university ? programsOf(university.id) : []), [university]);

  const progParam = params.get("prog");
  const program = progParam ? getProgram(progParam) ?? null : null;
  const validProgram = program && university && program.universityId === university.id ? program : null;

  const resultsRef = useRef<HTMLDivElement | null>(null);

  usePageMeta(
    university
      ? `${university.shortName} — олимпиады с БВИ и льготами`
      : "Вуз не найден — олимпиады с БВИ",
    university
      ? `Олимпиады, дающие БВИ и 100 баллов на IT и математические программы: ${university.name}.`
      : undefined,
  );

  if (!university) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-24">
        <EmptyState hasFilters={false} />
        <div className="mt-6 text-center">
          <Link to="/universities" className="inline-flex items-center gap-2 text-sm font-semibold text-signal-300">
            К списку вузов <IconArrow className="h-4 w-4" />
          </Link>
        </div>
      </section>
    );
  }

  const a = UNIVERSITY_ACCENTS[university.accent];
  const uniBenefits = benefits.filter((b) => b.universityId === university.id);

  const selectProgram = (p: Program) => {
    setParams({ prog: p.id });
    requestAnimationFrame(() => {
      resultsRef.current?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    });
  };

  return (
    <section className="mx-auto max-w-6xl px-4 pb-10 pt-14">
      {/* ---------- шапка вуза (без изменений) ---------- */}
      <Reveal>
        <nav className="mb-6 font-mono text-[11px] text-slate-500">
          <Link to="/" className="hover:text-slate-300">главная</Link>
          <span className="mx-2">/</span>
          <Link to="/universities" className="hover:text-slate-300">вузы</Link>
          <span className="mx-2">/</span>
          <span className="text-signal-300">{university.shortName.toLowerCase()}</span>
        </nav>
        <div className="relative overflow-hidden rounded-xl border border-slate-700/60 bg-ink-850/90 p-7 sm:p-9">
          <div className={`pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-gradient-to-br ${a.glow} to-transparent blur-3xl`} />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-3">
                <span className={`grid h-12 w-12 place-items-center rounded-lg border font-display text-sm font-bold ${a.chip}`}>
                  {university.shortName.slice(0, 4)}
                </span>
                <div>
                  <h1 className="font-display text-[clamp(1.25rem,3vw,1.9rem)] font-bold leading-tight text-slate-50">
                    {university.name}
                  </h1>
                  <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500">{university.city}</p>
                </div>
              </div>
              <p className="mt-4 text-[14px] leading-relaxed text-slate-400">{university.description}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <a href={university.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-slate-600/70 px-3.5 py-2 text-[12.5px] font-medium text-slate-200 transition hover:border-sky-400/50 hover:text-signal-300">
                  Официальный сайт <IconExternal className="h-3.5 w-3.5" />
                </a>
                <a href={university.admissionPageUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg bg-signal-400/90 px-3.5 py-2 text-[12.5px] font-semibold text-ink-950 transition hover:bg-sky-300">
                  Приёмная комиссия <IconExternal className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
            <div className="grid shrink-0 grid-cols-3 gap-4 rounded-xl border border-slate-700/60 bg-ink-900/70 p-5 md:w-64">
              <div>
                <p className="font-display text-2xl font-bold text-slate-50">{progs.length}</p>
                <p className="font-mono text-[9.5px] uppercase tracking-wider text-slate-500">программ</p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-slate-50">{uniBenefits.length}</p>
                <p className="font-mono text-[9.5px] uppercase tracking-wider text-slate-500">льгот</p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-emerald-300">
                  {uniBenefits.filter((b) => b.status === "confirmed").length}
                </p>
                <p className="font-mono text-[9.5px] uppercase tracking-wider text-slate-500">подтв.</p>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      {/* ---------- каскад: факультет → олимпиады ---------- */}
      <div ref={resultsRef} className="mt-12 scroll-mt-40 sm:scroll-mt-32">
        {!validProgram ? (
          /* ШАГ 1: только список факультетов, ниже ничего */
          <div>
            <Reveal>
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="mb-2.5 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-signal-300/80">
                    <span className="h-px w-6 bg-signal-400/60" />
                    обязательный шаг
                  </p>
                  <h2 className="font-display text-[clamp(1.35rem,3vw,2rem)] font-bold leading-tight text-slate-50">
                    Шаг 1 — выбери факультет
                  </h2>
                  <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-slate-400">
                    Все IT и математические направления {university.shortName} из базы справочника. Олимпиады и
                    льготы появятся после выбора — общего списка по вузу здесь нет.
                  </p>
                </div>
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-slate-500">
                  {progs.length} направлений
                </p>
              </div>
            </Reveal>
            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              {progs.map((p, i) => (
                <ProgramCard
                  key={p.id}
                  program={p}
                  accent={university.accent}
                  count={applicableCount(university.id, p.id)}
                  delay={(i % 2) * 80}
                  onSelect={() => selectProgram(p)}
                />
              ))}
            </div>
            <p className="mt-4 font-mono text-[10.5px] leading-relaxed text-slate-500">
              * счётчик включает и записи, действующие на все профильные программы вуза (ВсОШ, сборные и т.п.)
            </p>
          </div>
        ) : (
          /* ШАГ 2: чип + фильтры + таблица факультета */
          <FacultyResults
            key={validProgram.id}
            universityId={university.id}
            universityShort={university.shortName}
            program={validProgram}
            accentChip={a.chip}
            onReset={() => setParams({})}
          />
        )}
      </div>
    </section>
  );
}
