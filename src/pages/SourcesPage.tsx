import { Reveal, usePageMeta } from "../lib/hooks";
import { sourceGroups, UNIVERSITY_ACCENTS, STATUSES } from "../data";
import { IconCheck, IconDoc, IconExternal, SectionHeading, StatusChip } from "../components/ui";

const GLOBAL_SOURCES = [
  {
    title: "Перечень олимпиад школьников и их уровней на 2025/26 учебный год",
    desc: "Утверждён приказом Минобрнауки России от 30.08.2025 № 669. Определяет, какие олимпиады в принципе могут давать льготы.",
    url: "https://pk.mipt.ru/bachelor/2026_olympiads/",
    tag: "нормативная база",
  },
  {
    title: "olimpiada.ru — российский совет олимпиад школьников",
    desc: "Календарь, задания, результаты и официальные страницы всех олимпиад Перечня.",
    url: "https://olimpiada.ru",
    tag: "агрегатор",
  },
  {
    title: "Федеральный закон № 273-ФЗ «Об образовании в РФ», ст. 71",
    desc: "Особые права при приёме: БВИ для победителей и призёров ВсОШ и членов сборных РФ.",
    url: "http://www.consultant.ru/document/cons_doc_LAW_140174/",
    tag: "закон",
  },
];

export default function SourcesPage() {
  usePageMeta(
    "Источники данных — олимпиады с БВИ",
    "Официальные источники справочника: страницы приёмных комиссий ВШЭ, МФТИ, МИФИ, МГУ, ИТМО и СПбГУ, перечень РСОШ, даты обновления данных.",
  );
  const groups = sourceGroups();

  return (
    <section className="mx-auto max-w-6xl px-4 pb-10 pt-14">
      <Reveal>
        <SectionHeading kicker="раздел / источники" title="Откуда берутся данные">
          <p>
            Каждая запись о льготе содержит ссылку на источник и дату получения данных. Записи со статусом{" "}
            <StatusChip status="needs_verification" /> записаны по типовым схемам прошлых лет и{" "}
            <strong className="text-amber-300">обязательно требуют ручной проверки</strong> по правилам приёма
            конкретного года.
          </p>
        </SectionHeading>
      </Reveal>

      {/* ---------- по вузам ---------- */}
      <div className="grid gap-4 md:grid-cols-2">
        {groups.map((g, i) => {
          const a = UNIVERSITY_ACCENTS[g.university.accent];
          return (
            <Reveal key={g.university.id} delay={(i % 2) * 80}>
              <article className={`card-hover flex h-full flex-col rounded-xl border border-slate-700/50 bg-ink-850/80 p-6 ${a.border}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-[15px] font-bold text-slate-100">{g.university.name}</h3>
                    <p className="mt-1 font-mono text-[10.5px] uppercase tracking-[0.16em] text-slate-500">{g.university.city}</p>
                  </div>
                  <span className={`rounded-lg border px-2.5 py-1 font-mono text-[10.5px] ${a.chip}`}>{g.university.shortName}</span>
                </div>

                <ul className="mt-4 space-y-2.5 text-[13px]">
                  <li>
                    <a href={g.university.website} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-2 text-slate-300 hover:text-signal-300">
                      <IconExternal className="h-3.5 w-3.5 text-slate-500 group-hover:text-signal-300" />
                      {g.university.website.replace("https://", "")}
                    </a>
                  </li>
                  <li>
                    <a href={g.university.admissionPageUrl} target="_blank" rel="noreferrer" className="group inline-flex items-start gap-2 text-slate-300 hover:text-signal-300">
                      <IconDoc className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-500 group-hover:text-signal-300" />
                      <span className="link-underline break-all">{g.university.admissionPageUrl.replace("https://", "")}</span>
                    </a>
                  </li>
                </ul>

                <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-slate-700/50 pt-4">
                  <span className="font-mono text-[11px] text-slate-500">
                    обновлено: <span className="text-slate-300">{g.retrievedAt}</span>
                  </span>
                  <span className="font-mono text-[11px] text-emerald-300">{g.confirmed} подтв.</span>
                  <span className="font-mono text-[11px] text-amber-300">{g.needsVerification} треб. проверки</span>
                  <span className="font-mono text-[11px] text-slate-500">всего {g.total}</span>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>

      {/* ---------- общие источники ---------- */}
      <Reveal>
        <h2 className="mt-14 mb-5 font-display text-lg font-bold text-slate-100">Общие официальные ресурсы</h2>
      </Reveal>
      <div className="grid gap-3 md:grid-cols-3">
        {GLOBAL_SOURCES.map((s, i) => (
          <Reveal key={s.url} delay={i * 80}>
            <a href={s.url} target="_blank" rel="noreferrer" className="card-hover group flex h-full flex-col rounded-xl border border-slate-700/50 bg-ink-850/70 p-5 hover:border-sky-400/40">
              <span className="w-fit rounded border border-slate-600/60 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-slate-500">{s.tag}</span>
              <p className="mt-3 text-[13.5px] font-semibold leading-snug text-slate-100 transition group-hover:text-signal-300">{s.title}</p>
              <p className="mt-2 text-[12px] leading-relaxed text-slate-500">{s.desc}</p>
              <span className="mt-auto pt-3 inline-flex items-center gap-1.5 text-[12px] font-medium text-signal-300">
                открыть <IconExternal className="h-3 w-3" />
              </span>
            </a>
          </Reveal>
        ))}
      </div>

      {/* ---------- чек-лист проверки ---------- */}
      <Reveal>
        <div className="mt-14 rounded-xl border border-sky-400/25 bg-ink-850/80 p-7 sm:p-8">
          <h2 className="font-display text-lg font-bold text-slate-100">Как проверить запись за 5 минут</h2>
          <ol className="mt-5 grid gap-4 sm:grid-cols-2">
            {[
              "Откройте sourceUrl из записи — это страница приёмной комиссии или официальный документ вуза.",
              "Найдите раздел «Особые права» / «Олимпиады» в правилах приёма на нужный год.",
              "Сверьте три вещи: уровень олимпиады по Перечню, категорию диплома (победитель/призёр) и порог подтверждения ЕГЭ.",
              "Проверьте, к какой программе или конкурсной группе привязана льгота: они отличаются даже внутри одного вуза.",
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border border-emerald-400/40 bg-emerald-400/10 text-emerald-300">
                  <IconCheck className="h-3 w-3" />
                </span>
                <span className="text-[13.5px] leading-relaxed text-slate-300">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </Reveal>

      {/* ---------- статусы ---------- */}
      <Reveal>
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {(Object.keys(STATUSES) as (keyof typeof STATUSES)[]).map((k) => (
            <div key={k} className="rounded-xl border border-slate-700/50 bg-ink-850/70 p-5">
              <StatusChip status={k} />
              <p className="mt-3 text-[12.5px] leading-relaxed text-slate-400">{STATUSES[k].hint}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
