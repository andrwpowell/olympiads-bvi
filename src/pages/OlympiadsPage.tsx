import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  BENEFIT_TYPES,
  LEVELS,
  SUBJECTS,
  filterOlympiads,
  universities,
  type BenefitTypeId,
  type OlympiadLevelId,
  type SubjectId,
} from "../data";
import { Reveal, usePageMeta } from "../lib/hooks";
import { EmptyState, IconFilter, IconSearch, SectionHeading } from "../components/ui";
import { OlympiadCard } from "../components/cards";

const chip = (active: boolean, activeCls: string) =>
  `rounded-full border px-3 py-1.5 text-[12px] font-medium transition ${
    active
      ? activeCls
      : "border-slate-700/70 bg-ink-800/70 text-slate-400 hover:border-slate-500 hover:text-slate-200"
  }`;

export default function OlympiadsPage() {
  usePageMeta(
    "Все олимпиады — справочник БВИ",
    "Полный список олимпиад с льготами для IT и математических программ: фильтры по вузу, предмету, уровню РСОШ и типу льготы.",
  );
  const [params, setParams] = useSearchParams();

  const [uni, setUni] = useState(params.get("uni") ?? "");
  const [subjects, setSubjects] = useState<SubjectId[]>(
    (params.get("subj")?.split(",").filter(Boolean) as SubjectId[]) ?? [],
  );
  const [levels, setLevels] = useState<OlympiadLevelId[]>(
    (params.get("lvl")?.split(",").filter(Boolean) as OlympiadLevelId[]) ?? [],
  );
  const [types, setTypes] = useState<BenefitTypeId[]>(
    (params.get("type")?.split(",").filter(Boolean) as BenefitTypeId[]) ?? [],
  );
  const [query, setQuery] = useState(params.get("q") ?? "");

  // синхронизация фильтров с URL (deep-links с главной страницы)
  useEffect(() => {
    const p = new URLSearchParams();
    if (uni) p.set("uni", uni);
    if (subjects.length) p.set("subj", subjects.join(","));
    if (levels.length) p.set("lvl", levels.join(","));
    if (types.length) p.set("type", types.join(","));
    if (query.trim()) p.set("q", query.trim());
    setParams(p, { replace: true });
  }, [uni, subjects, levels, types, query, setParams]);

  const toggle = <T,>(list: T[], v: T, set: (x: T[]) => void) =>
    set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  const results = useMemo(
    () =>
      filterOlympiads({
        query,
        universityId: uni || null,
        subjects: subjects.length ? subjects : undefined,
        levels: levels.length ? levels : undefined,
        benefitTypes: types.length ? types : undefined,
      }),
    [query, uni, subjects, levels, types],
  );

  const hasFilters = Boolean(query || uni || subjects.length || levels.length || types.length);
  const reset = () => {
    setUni("");
    setSubjects([]);
    setLevels([]);
    setTypes([]);
    setQuery("");
  };

  const selectCls =
    "w-full rounded-lg border border-slate-700/70 bg-ink-800/90 px-3 py-2.5 text-[13px] text-slate-200 outline-none transition focus:border-sky-400/60 focus:ring-2 focus:ring-sky-400/20";

  return (
    <section className="mx-auto max-w-6xl px-4 pb-10 pt-14">
      <Reveal>
        <SectionHeading kicker="раздел / олимпиады" title={`${results.length} из ${filterOlympiads({}).length} олимпиад в базе`}>
          <p>
            Уровни указаны по Перечню РСОШ на 2025/26 учебный год (приказ Минобрнауки от 30.08.2025 № 669).
            Льготы по каждой олимпиаде — в карточке и на страницах вузов.
          </p>
        </SectionHeading>
      </Reveal>

      <div className="grid gap-8 lg:grid-cols-[290px_1fr]">
        {/* ---------- сайдбар фильтров ---------- */}
        <aside className="lg:sticky lg:top-36 lg:self-start">
          <Reveal>
            <div className="rounded-xl border border-slate-700/60 bg-ink-850/80 p-5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">
                  <IconFilter className="h-4 w-4" /> фильтры
                </span>
                {hasFilters && (
                  <button onClick={reset} className="text-[11.5px] font-medium text-signal-300 hover:text-sky-200">
                    сбросить
                  </button>
                )}
              </div>

              <label className="relative mt-4 block">
                <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Название олимпиады…"
                  className="w-full rounded-lg border border-slate-700/70 bg-ink-800/90 py-2.5 pl-9 pr-3 text-[13px] text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-sky-400/60 focus:ring-2 focus:ring-sky-400/20"
                />
              </label>

              <label className="mt-4 block">
                <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-wider text-slate-500">Вуз</span>
                <select className={selectCls} value={uni} onChange={(e) => setUni(e.target.value)}>
                  <option value="">Все вузы</option>
                  {universities.map((u) => (
                    <option key={u.id} value={u.id}>{u.shortName}</option>
                  ))}
                </select>
              </label>

              <p className="mt-5 mb-2 font-mono text-[10px] uppercase tracking-wider text-slate-500">Предмет</p>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(SUBJECTS) as SubjectId[]).map((s) => (
                  <button key={s} onClick={() => toggle(subjects, s, setSubjects)} className={chip(subjects.includes(s), `${SUBJECTS[s].badge} border-current`)}>
                    {SUBJECTS[s].label}
                  </button>
                ))}
              </div>

              <p className="mt-5 mb-2 font-mono text-[10px] uppercase tracking-wider text-slate-500">Уровень</p>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(LEVELS) as OlympiadLevelId[]).map((l) => (
                  <button key={l} onClick={() => toggle(levels, l, setLevels)} className={chip(levels.includes(l), `${LEVELS[l].badge} border-current`)}>
                    {LEVELS[l].short}
                  </button>
                ))}
              </div>

              <p className="mt-5 mb-2 font-mono text-[10px] uppercase tracking-wider text-slate-500">Тип льготы</p>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(BENEFIT_TYPES) as BenefitTypeId[]).map((t) => (
                  <button key={t} onClick={() => toggle(types, t, setTypes)} className={chip(types.includes(t), `${BENEFIT_TYPES[t].badge} border-current`)}>
                    {BENEFIT_TYPES[t].short}
                  </button>
                ))}
              </div>
            </div>
          </Reveal>
        </aside>

        {/* ---------- результаты ---------- */}
        <div>
          {results.length === 0 ? (
            <EmptyState onReset={reset} hasFilters={hasFilters} />
          ) : (
            <div className="grid gap-4">
              {results.map((o, i) => (
                <Reveal key={o.id} delay={Math.min(i, 5) * 60}>
                  <OlympiadCard olympiad={o} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
