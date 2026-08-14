import { useMemo, type ReactNode } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  DIPLOMAS,
  LEVELS,
  UNIVERSITY_ACCENTS,
  benefits,
  benefitsOfUniversity,
  getOlympiad,
  getProgram,
  programsOf,
  universities,
  type Benefit,
  type BenefitTypeId,
  type Olympiad,
  type Program,
  type University,
} from "../data";
import { Reveal, usePageMeta } from "../lib/hooks";
import {
  IconArrow,
  IconCheck,
  IconExternal,
  SectionHeading,
  StatusChip,
  BenefitBadge,
  SubjectBadge,
} from "../components/ui";

/* ============================================================
   ПОШАГОВЫЙ ПОДБОР ОЛИМПИАД: вуз → факультет → олимпиады
   Жёсткий сценарий из трёх шагов. Состояние живёт в URL
   (?uni=…&prog=…), поэтому «назад» в браузере = отмена шага,
   а подбором можно поделиться ссылкой.
   ============================================================ */

interface ResultRow {
  benefit: Benefit;
  olympiad: Olympiad;
  universityWide: boolean;
}

const order: Record<BenefitTypeId, number> = { bvi: 0, score100: 1, other: 2 };

/** Все записи benefits, связанные с парой «вуз + направление» */
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

/* ================= индикатор шагов ================= */
const STEP_META = [
  { n: 1, label: "Вуз" },
  { n: 2, label: "Факультет" },
  { n: 3, label: "Олимпиады" },
] as const;

const Stepper = ({ step, onStep }: { step: 1 | 2 | 3; onStep: (s: 1 | 2) => void }) => (
  <ol className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-0">
    {STEP_META.map((s, i) => {
      const done = step > s.n;
      const active = step === s.n;
      return (
        <li key={s.n} className="flex flex-1 items-center">
          <button
            onClick={() => done && onStep(s.n as 1 | 2)}
            disabled={!done}
            aria-current={active ? "step" : undefined}
            className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${
              active
                ? "border-sky-400/60 bg-sky-400/[0.08] shadow-[0_0_30px_-10px_rgba(56,189,248,0.6)]"
                : done
                  ? "cursor-pointer border-emerald-400/30 bg-emerald-400/[0.05] hover:border-emerald-400/60"
                  : "border-slate-700/60 bg-ink-850/60 opacity-55"
            }`}
          >
            <span
              className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg font-mono text-[12px] font-bold transition ${
                done ? "bg-emerald-400/15 text-emerald-300" : active ? "bg-signal-400 text-ink-950" : "bg-ink-700 text-slate-500"
              }`}
            >
              {done ? <IconCheck className="h-4 w-4" /> : `0${s.n}`}
            </span>
            <span className="min-w-0">
              <span className={`block font-mono text-[9.5px] uppercase tracking-[0.18em] ${active ? "text-signal-300" : "text-slate-500"}`}>
                шаг {s.n}
              </span>
              <span className={`block truncate text-[14px] font-semibold ${active ? "text-slate-50" : done ? "text-emerald-200/90" : "text-slate-400"}`}>
                {s.label}
              </span>
            </span>
          </button>
          {i < STEP_META.length - 1 && (
            <span className={`mx-2.5 hidden h-px w-8 shrink-0 sm:block ${step > s.n ? "bg-emerald-400/50" : "bg-slate-700/60"}`} aria-hidden />
          )}
        </li>
      );
    })}
  </ol>
);

/* ================= панель «назад / изменить выбор» ================= */
const Controls = ({ children }: { children?: ReactNode }) => (
  <div className="mb-6 flex flex-wrap items-center gap-2.5">{children}</div>
);

const BackButton = ({ onClick, children }: { onClick: () => void; children: ReactNode }) => (
  <button
    onClick={onClick}
    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-600/70 bg-ink-800/70 px-3.5 py-2 text-[12.5px] font-medium text-slate-300 transition hover:border-sky-400/50 hover:text-signal-300"
  >
    <IconArrow className="h-3.5 w-3.5 rotate-180" />
    {children}
  </button>
);

const ChangeChip = ({ onClick, label, value, accent }: { onClick: () => void; label: string; value: string; accent?: string }) => (
  <button
    onClick={onClick}
    className={`group inline-flex max-w-full items-center gap-2 rounded-lg border px-3 py-1.5 text-[12.5px] font-semibold transition ${
      accent ?? "border-slate-600/70 bg-ink-800/80 text-slate-200 hover:border-sky-400/50 hover:text-signal-300"
    }`}
    title={`Изменить выбор: ${label}`}
  >
    <span className="truncate">{value}</span>
    <span className="shrink-0 rounded border border-current/30 px-1.5 py-px font-mono text-[9px] font-normal uppercase tracking-wider opacity-70 group-hover:opacity-100">
      изменить
    </span>
  </button>
);

/* ================= ШАГ 1: ВУЗ ================= */
const StepUniversity = ({ onSelect }: { onSelect: (u: University) => void }) => (
  <div>
    <h2 className="font-display text-xl font-bold text-slate-100">Шаг 1 — выберите вуз</h2>
    <p className="mt-1.5 text-[13.5px] text-slate-400">
      В справочнике шесть вузов. Учитываются только IT и математические направления.
    </p>
    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {universities.map((u, i) => {
        const a = UNIVERSITY_ACCENTS[u.accent];
        const progs = programsOf(u.id).length;
        const bens = benefitsOfUniversity(u.id).length;
        return (
          <Reveal key={u.id} delay={i * 60}>
            <button
              onClick={() => onSelect(u)}
              className="card-hover group relative w-full overflow-hidden rounded-xl border border-slate-700/60 bg-ink-850/80 p-5 text-left"
            >
              <span
                className={`pointer-events-none absolute -right-12 -top-14 h-36 w-36 rounded-full bg-gradient-to-br ${a.glow} to-transparent opacity-60 blur-2xl transition group-hover:opacity-100`}
              />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <span className={`rounded-lg border px-2.5 py-1 font-display text-[13px] font-bold ${a.chip}`}>{u.shortName}</span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500">{u.city}</span>
                </div>
                <p className="mt-4 min-h-[40px] text-[13.5px] font-semibold leading-snug text-slate-100">{u.name}</p>
                <p className="mt-2.5 font-mono text-[11px] text-slate-500">
                  {progs} направлений · {bens} записей о льготах
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-semibold text-signal-300 opacity-80 transition group-hover:translate-x-0.5 group-hover:opacity-100">
                  Выбрать вуз <IconArrow className="h-3.5 w-3.5" />
                </span>
              </div>
            </button>
          </Reveal>
        );
      })}
    </div>
  </div>
);

/* ================= ШАГ 2: ФАКУЛЬТЕТ ================= */
const StepFaculty = ({ university, onSelect }: { university: University; onSelect: (p: Program) => void }) => {
  const a = UNIVERSITY_ACCENTS[university.accent];
  const progs = programsOf(university.id);
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2.5">
        <span className={`rounded-lg border px-2.5 py-1 font-display text-[13px] font-bold ${a.chip}`}>{university.shortName}</span>
        <h2 className="font-display text-xl font-bold text-slate-100">Шаг 2 — выберите факультет / направление</h2>
      </div>
      <p className="mt-1.5 text-[13.5px] text-slate-400">
        Все IT и математические направления {university.shortName}, которые есть в базе ({progs.length}). У каждого — число записей о льготах.
      </p>

      <div className="mt-6 overflow-hidden rounded-xl border border-slate-700/50 bg-ink-850/70">
        {progs.map((p, i) => {
          const count = applicableCount(university.id, p.id);
          return (
            <Reveal key={p.id} delay={i * 50}>
              <button
                onClick={() => onSelect(p)}
                className="group flex w-full items-center gap-4 border-b border-slate-800/70 px-5 py-4 text-left transition last:border-0 hover:bg-white/[0.03] sm:px-6"
              >
                <span className={`w-16 shrink-0 font-mono text-[11.5px] font-semibold ${a.text}`}>{p.code ?? "—"}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[14px] font-semibold leading-snug text-slate-100">{p.name}</span>
                  <span className="mt-0.5 block truncate text-[11.5px] text-slate-500">
                    {p.faculty} · {p.degree}
                  </span>
                </span>
                <span
                  className={`hidden shrink-0 rounded-full border px-2.5 py-1 font-mono text-[10.5px] sm:inline ${
                    count > 0 ? "border-emerald-400/30 bg-emerald-400/[0.08] text-emerald-300" : "border-slate-700 text-slate-500"
                  }`}
                >
                  {count > 0 ? `${count} ${count === 1 ? "запись" : count < 5 ? "записи" : "записей"}` : "нет записей"}
                </span>
                <IconArrow className="h-4 w-4 shrink-0 text-slate-600 transition group-hover:translate-x-1 group-hover:text-signal-300" />
              </button>
            </Reveal>
          );
        })}
      </div>
      <p className="mt-3 font-mono text-[10.5px] leading-relaxed text-slate-500">
        * в счёт входят и льготы, действующие на все профильные программы вуза (ВсОШ, сборные и т.п.).
      </p>
    </div>
  );
};

/* ================= ШАГ 3: карточка олимпиады ================= */
const Field = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="rounded-lg border border-slate-700/50 bg-ink-900/60 px-3 py-2.5">
    <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-slate-500">{label}</p>
    <div className="mt-1.5 text-[12.5px] font-semibold text-slate-200">{children}</div>
  </div>
);

const OlympiadResultCard = ({ row, university }: { row: ResultRow; university: University }) => {
  const { benefit: b, olympiad: o, universityWide } = row;
  const a = UNIVERSITY_ACCENTS[university.accent];
  const subject = b.subject ?? o.subjectLevels[0]?.subject;
  const levels = o.subjectLevels.filter((sl) => !b.subject || sl.subject === b.subject);

  return (
    <article className="card-hover relative rounded-xl border border-slate-700/60 bg-ink-850/80 p-5">
      {universityWide && (
        <span className="absolute -top-2.5 left-5 z-10 rounded-full border border-sky-400/40 bg-ink-900 px-2.5 py-0.5 font-mono text-[9.5px] uppercase tracking-wider text-signal-300">
          действует на все программы вуза
        </span>
      )}

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <BenefitBadge type={b.benefitType} solid />
            <StatusChip status={b.status} hint />
          </div>
          <h3 className="mt-2.5 text-[15px] font-bold leading-snug text-slate-50">{o.name}</h3>
          <p className={`mt-0.5 font-mono text-[10px] uppercase tracking-wider ${a.text}`}>{o.organizer}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Field label="Предмет">
          {subject ? <SubjectBadge subject={subject} short /> : <span className="text-slate-400">по профилю</span>}
        </Field>
        <Field label="Уровень">
          {levels.length ? levels.map((sl) => <span key={sl.subject} className="mr-1 inline-block">{LEVELS[sl.level].short}</span>) : "—"}
        </Field>
        <Field label="Тип диплома">
          <span className="capitalize">{DIPLOMAS[b.diploma]}</span>
        </Field>
        <Field label="Год приёма">{b.year}</Field>
      </div>

      {b.conditions && (
        <p className="mt-3.5 rounded-lg border border-slate-700/40 bg-ink-900/40 px-3.5 py-3 text-[12.5px] leading-relaxed text-slate-400">
          <span className="mr-1.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-slate-500">Условия:</span>
          {b.conditions}
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2.5 border-t border-slate-700/50 pt-3.5">
        <a
          href={b.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-sky-400/40 bg-sky-400/10 px-3 py-1.5 text-[12px] font-semibold text-signal-300 transition hover:bg-sky-400/20"
        >
          Источник <IconExternal className="h-3.5 w-3.5" />
        </a>
        <div className="flex items-center gap-3 font-mono text-[10.5px] text-slate-500">
          <span>получено {b.retrievedAt}</span>
          <a href={o.officialWebsiteUrl} target="_blank" rel="noreferrer" className="link-underline text-slate-400 hover:text-signal-300">
            сайт олимпиады
          </a>
        </div>
      </div>
    </article>
  );
};

/* ================= ШАГ 3: ОЛИМПИАДЫ ================= */
const StepOlympiads = ({
  university,
  program,
  onChangeFaculty,
  onChangeUniversity,
}: {
  university: University;
  program: Program;
  onChangeFaculty: () => void;
  onChangeUniversity: () => void;
}) => {
  const rows = useMemo(() => rowsFor(university.id, program.id), [university.id, program.id]);
  const confirmed = rows.filter((r) => r.benefit.status === "confirmed").length;
  const toCheck = rows.filter((r) => r.benefit.status === "needs_verification").length;
  const a = UNIVERSITY_ACCENTS[university.accent];

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <span className={`rounded-lg border px-2.5 py-1 font-display text-[12px] font-bold ${a.chip}`}>{university.shortName}</span>
        <IconArrow className="h-3.5 w-3.5 text-slate-600" />
        <span className="rounded-lg border border-slate-600/70 bg-ink-800/80 px-2.5 py-1 text-[12px] font-medium text-slate-200">
          {program.name}
        </span>
      </div>
      <h2 className="mt-3 font-display text-xl font-bold text-slate-100">Шаг 3 — олимпиады и льготы</h2>

      {rows.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-slate-600/40 bg-ink-850/60 px-6 py-14 text-center">
          <svg viewBox="0 0 96 64" className="mx-auto mb-5 h-16 w-24 text-slate-600" fill="none" aria-hidden>
            <rect x="14" y="10" width="44" height="44" rx="8" stroke="currentColor" strokeWidth="2.5" />
            <path d="M26 26h20M26 34h14M26 42h18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            <path d="m66 30 14 14M80 30 66 44" stroke="#38bdf8" strokeWidth="2.2" strokeLinecap="round" opacity="0.6" />
          </svg>
          <p className="font-display text-lg font-semibold text-slate-200">По этому направлению записей пока нет</p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-400">
            База заполняется вручную, и льготы для «{program.name}» в {university.shortName} ещё не внесены.
            Актуальные правила — на официальном сайте приёмной комиссии.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href={university.admissionPageUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-signal-400 px-4 py-2.5 text-[13px] font-semibold text-ink-950 transition hover:bg-sky-300"
            >
              Официальный сайт {university.shortName} <IconExternal className="h-3.5 w-3.5" />
            </a>
            <button
              onClick={onChangeFaculty}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-600/70 px-4 py-2.5 text-[13px] font-medium text-slate-200 transition hover:border-sky-400/50 hover:text-signal-300"
            >
              Другое направление
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-xl border border-slate-700/50 bg-ink-850/70 px-5 py-3.5">
            <p className="text-[13px] text-slate-300">
              Найдено <strong className="font-display text-[16px] text-slate-50">{rows.length}</strong>{" "}
              {rows.length === 1 ? "олимпиада" : rows.length < 5 ? "олимпиады" : "олимпиад"} с льготами
            </p>
            <span className="hidden h-4 w-px bg-slate-700 sm:block" />
            <span className="font-mono text-[11px] text-emerald-300">✓ подтверждено: {confirmed}</span>
            <span className="font-mono text-[11px] text-amber-300">! проверить: {toCheck}</span>
            <span className="ml-auto hidden items-center gap-2 md:flex">
              <StatusChip status="confirmed" hint />
              <StatusChip status="needs_verification" hint />
            </span>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {rows.map((r, i) => (
              <Reveal key={r.benefit.id} delay={Math.min(i, 6) * 50}>
                <OlympiadResultCard row={r} university={university} />
              </Reveal>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-400/25 bg-amber-400/[0.05] px-5 py-4">
            <p className="max-w-2xl text-[12.5px] leading-relaxed text-amber-100/85">
              Льготы действуют для приёма <strong className="text-amber-200">{Math.max(...rows.map((r) => r.benefit.year))} года</strong> и
              зависят от категории диплома и порога ЕГЭ. Перед подачей документов сверьте условия по ссылке «Источник».
            </p>
            <a
              href={university.admissionPageUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-amber-400/40 px-3.5 py-2 text-[12px] font-semibold text-amber-200 transition hover:bg-amber-400/10"
            >
              Приёмная комиссия <IconExternal className="h-3.5 w-3.5" />
            </a>
          </div>
        </>
      )}
    </div>
  );
};

/* ================= страница ================= */
export default function PickerPage() {
  usePageMeta(
    "Подбор олимпиад — вуз, факультет, льготы",
    "Пошаговый подбор: выберите вуз и IT/математическое направление — получите олимпиады с БВИ и 100 баллами.",
  );
  const [params, setParams] = useSearchParams();

  const uniParam = params.get("uni");
  const progParam = params.get("prog");
  const university = universities.find((u) => u.id === uniParam) ?? null;
  const program = university && progParam ? getProgram(progParam) ?? null : null;
  const validProgram = program && university && program.universityId === university.id ? program : null;

  const step: 1 | 2 | 3 = !university ? 1 : !validProgram ? 2 : 3;

  return (
    <section className="mx-auto max-w-5xl px-4 pb-10 pt-14">
      <Reveal>
        <SectionHeading kicker="пошаговый подбор" title="Найдите свои олимпиады за три шага">
          <p>
            Вуз → факультет → олимпиады. Покажем, какие олимпиады дают{" "}
            <strong className="font-semibold text-emerald-300">БВИ</strong> или{" "}
            <strong className="font-semibold text-sky-300">100 баллов</strong> на выбранное направление: с предметом,
            уровнем, категорией диплома, условиями, годом и ссылкой на официальный источник.
          </p>
        </SectionHeading>
      </Reveal>

      <Reveal delay={120}>
        <Stepper step={step} onStep={(s) => setParams(s === 1 ? {} : { uni: university?.id ?? "" }, { replace: true })} />
      </Reveal>

      <div className="mt-8">
        {step === 2 && university && (
          <Controls>
            <BackButton onClick={() => setParams({})}>Назад: к выбору вуза</BackButton>
          </Controls>
        )}
        {step === 3 && university && validProgram && (
          <Controls>
            <BackButton onClick={() => setParams({ uni: university.id })}>Назад: к факультетам</BackButton>
            <ChangeChip onClick={() => setParams({ uni: university.id })} label="факультет" value={validProgram.name} />
            <ChangeChip
              onClick={() => setParams({})}
              label="вуз"
              value={university.shortName}
              accent={`${UNIVERSITY_ACCENTS[university.accent].chip}`}
            />
          </Controls>
        )}
      </div>

      {/* key пересоздаёт блок шага — срабатывает анимация входа */}
      <div key={step} className="step-in">
        {step === 1 && <StepUniversity onSelect={(u) => setParams({ uni: u.id })} />}
        {step === 2 && university && <StepFaculty university={university} onSelect={(p) => setParams({ uni: university.id, prog: p.id })} />}
        {step === 3 && university && validProgram && (
          <StepOlympiads
            university={university}
            program={validProgram}
            onChangeFaculty={() => setParams({ uni: university.id })}
            onChangeUniversity={() => setParams({})}
          />
        )}
      </div>

      <Reveal>
        <p className="mt-12 text-center font-mono text-[11px] text-slate-600">
          Совет: скопируйте адрес страницы после выбора — подбор сохранится в ссылке.{" "}
          <Link to="/olympiads" className="link-underline text-slate-400 hover:text-signal-300">
            Или листайте все олимпиады →
          </Link>
        </p>
      </Reveal>
    </section>
  );
}
