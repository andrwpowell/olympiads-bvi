import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LEVELS,
  SUBJECTS,
  filterOlympiads,
  globalStats,
  popularOlympiads,
  universities,
  universityStats,
  type OlympiadLevelId,
  type SubjectId,
} from "../data";
import { Reveal, useCountUp, usePageMeta, usePrefersReducedMotion, useScramble } from "../lib/hooks";
import {
  IconAlert,
  IconArrow,
  IconExternal,
  IconMedal,
  IconShield,
  LevelBadge,
  SectionHeading,
  SubjectBadge,
} from "../components/ui";
import { UniversityCard } from "../components/cards";

/* ---------- статистика ---------- */
const Stat = ({ value, label, delay }: { value: number; label: string; delay: number }) => {
  const { ref, value: v } = useCountUp(value);
  return (
    <Reveal delay={delay}>
      <div className="border-l-2 border-sky-400/30 pl-4">
        <p className="font-display text-3xl font-bold text-slate-50">
          <span ref={ref}>{v}</span>
        </p>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">{label}</p>
      </div>
    </Reveal>
  );
};

/* ---------- панель быстрого подбора ---------- */
const QuickFinder = () => {
  const navigate = useNavigate();
  const [uni, setUni] = useState("");
  const [subject, setSubject] = useState<SubjectId | "">("");
  const [level, setLevel] = useState<OlympiadLevelId | "">("");

  const found = useMemo(
    () =>
      filterOlympiads({
        universityId: uni || null,
        subjects: subject ? [subject] : undefined,
        levels: level ? [level] : undefined,
      }).length,
    [uni, subject, level],
  );

  const selectCls =
    "w-full rounded-lg border border-slate-700/70 bg-ink-800/90 px-3 py-2.5 text-[13.5px] text-slate-200 outline-none transition focus:border-sky-400/60 focus:ring-2 focus:ring-sky-400/20";

  const submit = () => {
    const params = new URLSearchParams();
    if (uni) params.set("uni", uni);
    if (subject) params.set("subj", subject);
    if (level) params.set("lvl", level);
    navigate(`/olympiads?${params.toString()}`);
  };

  return (
    <div className="relative rounded-xl border border-slate-700/60 bg-ink-850/90 p-6 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)]">
      <div className="pointer-events-none absolute -top-px left-6 right-6 h-px bg-gradient-to-r from-transparent via-sky-400/70 to-transparent" />
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-signal-300">быстрый подбор</p>
        <span className="flex items-center gap-1.5 font-mono text-[10px] text-slate-500">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-dot" />
          база {globalStats.dataYear}
        </span>
      </div>
      <h3 className="mt-3 font-display text-lg font-bold text-slate-100">Найти свою олимпиаду</h3>

      <div className="mt-5 space-y-3.5">
        <label className="block">
          <span className="mb-1.5 block font-mono text-[10.5px] uppercase tracking-wider text-slate-500">Вуз</span>
          <select className={selectCls} value={uni} onChange={(e) => setUni(e.target.value)}>
            <option value="">Все вузы</option>
            {universities.map((u) => (
              <option key={u.id} value={u.id}>{u.shortName} — {u.city}</option>
            ))}
          </select>
        </label>
        <div>
          <span className="mb-1.5 block font-mono text-[10.5px] uppercase tracking-wider text-slate-500">Предмет</span>
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(SUBJECTS) as SubjectId[]).map((s) => (
              <button
                key={s}
                onClick={() => setSubject(subject === s ? "" : s)}
                className={`rounded-lg border px-2 py-2 text-[12px] font-medium transition ${
                  subject === s
                    ? `${SUBJECTS[s].badge} border-current`
                    : "border-slate-700/70 bg-ink-800/70 text-slate-400 hover:border-slate-600 hover:text-slate-200"
                }`}
              >
                {SUBJECTS[s].label}
              </button>
            ))}
          </div>
        </div>
        <label className="block">
          <span className="mb-1.5 block font-mono text-[10.5px] uppercase tracking-wider text-slate-500">Уровень олимпиады</span>
          <select className={selectCls} value={level} onChange={(e) => setLevel(e.target.value as OlympiadLevelId | "")}>
            <option value="">Любой уровень</option>
            {(Object.keys(LEVELS) as OlympiadLevelId[]).map((l) => (
              <option key={l} value={l}>{LEVELS[l].label}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-700/60 pt-4">
        <p className="font-mono text-[11px] text-slate-500">
          найдено: <span className={found > 0 ? "text-emerald-300" : "text-rose-300"}>{found}</span>
        </p>
        <button
          onClick={submit}
          className="inline-flex items-center gap-2 rounded-lg bg-signal-400 px-4 py-2.5 text-[13px] font-semibold text-ink-950 transition hover:bg-sky-300 hover:shadow-[0_0_30px_-6px_rgba(56,189,248,0.8)]"
        >
          Показать олимпиады
          <IconArrow className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};

/* ---------- бегущая строка ---------- */
const Ticker = () => {
  const reduced = usePrefersReducedMotion();
  const items = popularOlympiads(10);
  const row = items.map((i, idx) => (
    <span key={idx} className="mx-5 inline-flex items-center gap-3">
      <span className="font-display text-[13px] font-semibold text-slate-300">{i.olympiad.shortName}</span>
      {i.olympiad.subjectLevels.slice(0, 2).map((sl) => (
        <LevelBadge key={sl.subject} level={sl.level} short />
      ))}
      <span className="text-sky-400/40">✦</span>
    </span>
  ));
  return (
    <div className="marquee-hover relative overflow-hidden border-y border-slate-800/80 bg-ink-900/50 py-3.5">
      <div className={`flex w-max whitespace-nowrap ${reduced ? "" : "animate-marquee"}`}>
        <div className="flex items-center">{row}</div>
        <div className="flex items-center" aria-hidden>{row}</div>
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-ink-950 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-ink-950 to-transparent" />
    </div>
  );
};

/* ---------- «Что такое БВИ» ---------- */
const BVI_STEPS = [
  {
    n: "01",
    title: "Особое право, а не баллы",
    text: "БВИ — зачисление без вступительных испытаний: олимпиадник занимает отдельную квоту и не участвует в общем конкурсе баллов. Это право дают победителям и призёрам ВсОШ и членам сборных РФ на международных олимпиадах.",
  },
  {
    n: "02",
    title: "РСОШ: решает каждый вуз сам",
    text: "Для олимпиад из Перечня РСОШ вуз самостоятельно определяет, каким программам, за какой уровень и какой категории дипломантов давать БВИ или 100 баллов. Один и тот же диплом в разных вузах работает по-разному.",
  },
  {
    n: "03",
    title: "Подтверждение ЕГЭ",
    text: "Льготы по олимпиадам РСОШ почти всегда подтверждаются результатом ЕГЭ по профилю олимпиады — как правило, не ниже 75 баллов (у вузов бывают пороги 80–85). Для БВИ по ВсОШ и сборным ЕГЭ не нужен.",
  },
  {
    n: "04",
    title: "Срок действия и год правил",
    text: "Право по ВсОШ действует 4 года. Льготы РСОШ действуют в приёмную кампанию, следующую за годом олимпиады, и переиздаются ежегодно: правила приёма 2026 года отличаются от правил 2025-го.",
  },
];

const WhatIsBvi = () => (
  <section className="mx-auto max-w-6xl px-4 py-20" id="bvi">
    <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="lg:sticky lg:top-32 lg:self-start">
        <SectionHeading kicker="ликбез" title={<>Что такое <span className="text-emerald-300">БВИ</span> и как оно работает</>}>
          <p>
            Право на поступление без вступительных испытаний закреплено в ч. 4 ст. 71 Федерального закона
            № 273-ФЗ «Об образовании в РФ». Ниже — четыре правила, без которых таблицы льгот не прочитать.
          </p>
        </SectionHeading>
        <Reveal delay={120}>
          <div className="flex items-start gap-3 rounded-xl border border-emerald-400/25 bg-emerald-400/[0.06] p-4">
            <IconShield className="mt-0.5 h-5 w-5 text-emerald-300" />
            <p className="text-[13px] leading-relaxed text-emerald-100/80">
              Даже с БВИ придётся предоставить аттестат и, для льгот РСОШ, подтвердить профильный предмет
              ЕГЭ. Следите за сроками подачи согласий на зачисление.
            </p>
          </div>
        </Reveal>
      </div>
      <div className="space-y-4">
        {BVI_STEPS.map((s, i) => (
          <Reveal key={s.n} delay={i * 90}>
            <div className="card-hover group flex gap-5 rounded-xl border border-slate-700/50 bg-ink-850/80 p-6">
              <span className="outline-number font-display text-4xl font-black leading-none transition group-hover:[-webkit-text-stroke-color:rgba(52,211,153,0.55)]">
                {s.n}
              </span>
              <div>
                <h3 className="font-display text-[15px] font-bold text-slate-100">{s.title}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-slate-400">{s.text}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/* ================= страница ================= */

export default function HomePage() {
  usePageMeta(
    "Олимпиады с БВИ — справочник поступления в IT-вузы",
    "Олимпиады, дающие БВИ и 100 баллов при поступлении на IT и математические программы ВШЭ, МФТИ, МИФИ, МГУ, ИТМО и СПбГУ.",
  );
  const title = useScramble("ОЛИМПИАДЫ С БВИ");
  const stats = universityStats();
  const popular = popularOlympiads(6);

  return (
    <>
      {/* ---------- открытие ---------- */}
      <section className="relative mx-auto max-w-6xl px-4 pb-16 pt-14 sm:pt-20">
        <div className="grid items-start gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <Reveal>
              <p className="inline-flex items-center gap-2.5 rounded-full border border-slate-700/70 bg-ink-800/70 px-3.5 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.2em] text-slate-400">
                <span className="h-1.5 w-1.5 rounded-full bg-signal-400 animate-pulse-dot" />
                справочник абитуриента · приём {globalStats.dataYear}
              </p>
            </Reveal>
            <h1 className="mt-6 font-display text-[clamp(1.9rem,5.6vw,3.9rem)] font-black leading-[1.04] tracking-tight text-slate-50">
              <span className="whitespace-pre">{title}</span>
              <span className="mt-2 block text-slate-300">
                в <span className="text-signal-300">IT</span> и математические вузы
              </span>
            </h1>
            <Reveal delay={150}>
              <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-slate-400">
                Какие олимпиады дают право поступления <strong className="font-semibold text-emerald-300">без вступительных испытаний</strong> или{" "}
                <strong className="font-semibold text-sky-300">100 баллов</strong> по предмету — на информатику, прикладную математику,
                программную инженерию, науку о данных, ИИ и информационную безопасность. Шесть вузов, фильтры по
                предмету и уровню, ссылки на официальные правила.
              </p>
            </Reveal>
            <Reveal delay={230}>
              <div className="mt-7 flex max-w-xl items-start gap-3 rounded-xl border border-amber-400/30 bg-amber-400/[0.07] px-4 py-3.5">
                <IconAlert className="mt-0.5 h-4.5 w-4.5 shrink-0 text-amber-300" />
                <p className="text-[13px] leading-relaxed text-amber-100/90">
                  <strong className="font-semibold text-amber-200">Информация требует проверки.</strong> Правила приёма
                  меняются каждый год. Перед подачей документов обязательно смотрите официальные сайты вузов —{" "}
                  <Link to="/sources" className="link-underline font-semibold text-amber-200">страница «Источники»</Link>.
                </p>
              </div>
            </Reveal>
            <Reveal delay={300}>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link
                  to="/picker"
                  className="group inline-flex items-center gap-2.5 rounded-lg bg-signal-400 px-6 py-3.5 text-[14px] font-bold text-ink-950 shadow-[0_0_36px_-10px_rgba(56,189,248,0.65)] transition hover:bg-sky-300 hover:shadow-[0_0_44px_-8px_rgba(56,189,248,0.85)]"
                >
                  <IconMedal className="h-4.5 w-4.5" />
                  Подобрать олимпиады — 3 шага
                  <IconArrow className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link
                  to="/olympiads"
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-600/70 px-5 py-3.5 text-[13.5px] font-semibold text-slate-200 transition hover:border-sky-400/50 hover:text-signal-300"
                >
                  Все олимпиады
                </Link>
              </div>
            </Reveal>
            <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
              <Stat value={globalStats.universities} label="вузов" delay={0} />
              <Stat value={globalStats.olympiads} label="олимпиад" delay={80} />
              <Stat value={globalStats.benefits} label="записей о льготах" delay={160} />
              <Stat value={globalStats.programs} label="программ" delay={240} />
            </div>
          </div>
          <Reveal delay={200} className="lg:mt-2">
            <QuickFinder />
          </Reveal>
        </div>
      </section>

      <Ticker />

      {/* ---------- вузы ---------- */}
      <section className="mx-auto max-w-6xl px-4 pt-20">
        <Reveal>
          <SectionHeading kicker="шесть вузов" title="Куда можно поступить по олимпиаде">
            <p>Только профильные IT и математические направления: информатика, прикладная математика, программная инженерия, ИБ, Data Science и ИИ.</p>
          </SectionHeading>
        </Reveal>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((s, i) => (
            <Reveal key={s.university.id} delay={(i % 3) * 90}>
              <UniversityCard
                university={s.university}
                programCount={s.programCount}
                olympiadCount={s.olympiadCount}
                benefitCount={s.benefitCount}
                confirmedCount={s.confirmedCount}
              />
            </Reveal>
          ))}
        </div>
      </section>

      <WhatIsBvi />

      {/* ---------- популярные олимпиады ---------- */}
      <section className="mx-auto max-w-6xl px-4 pt-6">
        <Reveal>
          <SectionHeading kicker="рейтинг базы" title="Самые «льготные» олимпиады">
            <p>Отсортированы по числу записей о льготах в справочнике. ВсОШ и международные олимпиады дают БВИ во всех шести вузах по закону.</p>
          </SectionHeading>
        </Reveal>
        <div className="overflow-hidden rounded-xl border border-slate-700/50 bg-ink-850/60">
          {popular.map((p, i) => (
            <Reveal key={p.olympiad.id} delay={i * 60}>
              <Link
                to={`/olympiads?q=${encodeURIComponent(p.olympiad.shortName)}`}
                className="group flex items-center gap-4 border-b border-slate-800/70 px-5 py-4 transition last:border-0 hover:bg-white/[0.03] sm:gap-6 sm:px-7"
              >
                <span className={`w-10 shrink-0 font-display text-2xl font-black sm:text-3xl ${i < 3 ? "text-signal-300" : "outline-number"}`}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-[14px] font-bold text-slate-100 transition group-hover:text-signal-300">
                    {p.olympiad.shortName}
                  </p>
                  <p className="mt-0.5 truncate text-[12px] text-slate-500">{p.olympiad.name}</p>
                </div>
                <div className="hidden items-center gap-1.5 md:flex">
                  {p.olympiad.subjectLevels.slice(0, 3).map((sl) => (
                    <SubjectBadge key={sl.subject} subject={sl.subject} short />
                  ))}
                </div>
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 font-mono text-[11px] text-emerald-300">
                  <IconMedal className="h-3.5 w-3.5" />
                  {p.benefitCount} льгот
                </span>
                <IconArrow className="h-4 w-4 shrink-0 text-slate-600 transition group-hover:translate-x-1 group-hover:text-signal-300" />
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- полезные ссылки ---------- */}
      <section className="mx-auto max-w-6xl px-4 pt-20">
        <Reveal>
          <SectionHeading kicker="первоисточники" title="Что читать в первую очередь" />
        </Reveal>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { t: "Перечень олимпиад РСОШ и их уровни", d: "Приказ Минобрнауки — какие олимпиады в принципе дают льготы", u: "https://pk.mipt.ru/bachelor/2026_olympiads/", tag: "норматив" },
            { t: "Засчитываемые олимпиады — МФТИ 2026", d: "Самая детальная открытая таблица льгот по конкурсным группам", u: "https://pk.mipt.ru/bachelor/2026_olympiads/", tag: "таблица" },
            { t: "Особые права — МГУ (ЦПК)", d: "PDF с льготами победителям и призёрам к правилам приёма", u: "https://cpk.msu.ru/files/2026/olymp_benefits.pdf", tag: "pdf" },
            { t: "Победителям и призёрам — НИЯУ МИФИ", d: "Раздел приёмной комиссии с перечнем засчитываемых олимпиад", u: "https://admission.mephi.ru/admission/baccalaureate-and-specialty/specials/winners", tag: "вуз" },
            { t: "Олимпиады школьников — НИУ ВШЭ", d: "«Высшая проба» и льготы для дипломантов олимпиад", u: "https://olymp.hse.ru", tag: "вуз" },
            { t: "olimpiada.ru — календарь и результаты", d: "Информационный ресурс обо всех олимпиадах Перечня", u: "https://olimpiada.ru", tag: "агрегатор" },
          ].map((l, i) => (
            <Reveal key={l.u + l.t} delay={(i % 2) * 80}>
              <a
                href={l.u}
                target="_blank"
                rel="noreferrer"
                className="card-hover group flex items-center justify-between gap-4 rounded-xl border border-slate-700/50 bg-ink-850/70 px-5 py-4 hover:border-sky-400/40"
              >
                <div className="min-w-0">
                  <p className="flex items-center gap-2.5 text-[13.5px] font-semibold text-slate-100">
                    {l.t}
                    <span className="rounded border border-slate-600/60 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-slate-500">{l.tag}</span>
                  </p>
                  <p className="mt-1 truncate text-[12px] text-slate-500">{l.d}</p>
                </div>
                <IconExternal className="h-4 w-4 shrink-0 text-slate-600 transition group-hover:text-signal-300" />
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="mx-auto max-w-6xl px-4 pt-20">
        <Reveal>
          <div className="relative overflow-hidden rounded-xl border border-sky-400/25 bg-ink-850 px-6 py-10 sm:px-10">
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-sky-400/15 blur-[90px]" />
            <div className="pointer-events-none absolute -bottom-28 -left-16 h-64 w-64 rounded-full bg-emerald-400/10 blur-[90px]" />
            <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div>
                <h2 className="font-display text-xl font-bold text-slate-50 sm:text-2xl">Готовы искать свою льготу?</h2>
                <p className="mt-2 max-w-lg text-[14px] leading-relaxed text-slate-400">
                  Откройте полный список олимпиад и отфильтруйте его по вузу, предмету и уровню — или изучите
                  таблицы льгот конкретного вуза.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link to="/olympiads" className="inline-flex items-center gap-2 rounded-lg bg-signal-400 px-5 py-3 text-[13.5px] font-semibold text-ink-950 transition hover:bg-sky-300">
                  Все олимпиады <IconArrow className="h-4 w-4" />
                </Link>
                <Link to="/universities" className="inline-flex items-center gap-2 rounded-lg border border-slate-600/70 px-5 py-3 text-[13.5px] font-semibold text-slate-200 transition hover:border-sky-400/50 hover:text-signal-300">
                  Вузы и программы
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
