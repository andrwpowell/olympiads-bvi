import { useState } from "react";
import { Link } from "react-router-dom";
import { Reveal, usePageMeta } from "../lib/hooks";
import { IconArrow, SectionHeading, StatusChip } from "../components/ui";

const FACTORS = [
  { t: "Год приёма", d: "Правила переиздаются ежегодно: льгота 2025 года может исчезнуть или измениться в 2026-м." },
  { t: "Вуз", d: "Каждый вуз сам решает, какие олимпиады РСОШ засчитывать и на каких условиях." },
  { t: "Программа", d: "Внутри вуза льготы различаются по факультетам и конкурсным группам — вплоть до отдельных порогов ЕГЭ." },
  { t: "Уровень олимпиады", d: "Уровни 1–3 по Перечню РСОШ: чем выше уровень, тем шире список вузов, признающих диплом." },
  { t: "Категория диплома", d: "Победитель и призёр — разные льготы: БВИ чаще дают победителям, призёрам — 100 баллов." },
];

const FAQ = [
  {
    q: "Сайт официальный?",
    a: "Нет. Это независимый справочник для абитуриентов. Единственный юридически значимый документ — правила приёма конкретного вуза на конкретный год. Все записи снабжены ссылками на официальные страницы для проверки.",
  },
  {
    q: "Откуда берутся данные?",
    a: "Вручную из официальных источников: страниц приёмных комиссий, таблиц «засчитываемые олимпиады», перечня РСОШ. Каждая запись хранит sourceUrl и дату получения. Сейчас подтверждены данные МФТИ (таблица 2026 года) и общие права по ВсОШ и сборным; остальные вузы помечены «требует проверки».",
  },
  {
    q: "Почему часть записей жёлтые?",
    a: "Жёлтый статус «требует проверки» означает, что запись восстановлена по типовым схемам прошлых лет: так вуз делал раньше, но правила 2026 года нужно сверить вручную. Мы сознательно не выдаём предположения за факты.",
  },
  {
    q: "Как обновляются данные?",
    a: "На первом этапе — вручную: данные лежат в редактируемых TypeScript-файлах проекта (вузы, программы, олимпиады, льготы). Архитектура рассчитана на то, чтобы позже подключить автоматическое обновление с официальных страниц.",
  },
];

const Faq = () => {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="overflow-hidden rounded-xl border border-slate-700/50 bg-ink-850/70">
      {FAQ.map((f, i) => (
        <div key={i} className="border-b border-slate-800/80 last:border-0">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-white/[0.02]"
            aria-expanded={open === i}
          >
            <span className="text-[14px] font-semibold text-slate-100">{f.q}</span>
            <svg viewBox="0 0 16 16" className={`h-4 w-4 shrink-0 text-signal-300 transition-transform duration-300 ${open === i ? "rotate-45" : ""}`} fill="none">
              <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
          <div className={`grid transition-[grid-template-rows] duration-300 ease-out ${open === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
            <div className="overflow-hidden">
              <p className="px-5 pb-5 text-[13.5px] leading-relaxed text-slate-400">{f.a}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default function AboutPage() {
  usePageMeta(
    "О проекте — олимпиады с БВИ",
    "Зачем нужен справочник олимпиад с БВИ, как устроены льготы и как обновляются данные.",
  );
  return (
    <section className="mx-auto max-w-6xl px-4 pb-10 pt-14">
      <Reveal>
        <SectionHeading kicker="раздел / о проекте" title="Справочник, который экономит абитуриенту десятки часов">
          <p>
            Право на БВИ и льготы по олимпиадам разбросано по десяткам документов: федеральный закон, Перечень
            РСОШ, правила приёма каждого вуза, таблицы по конкурсным группам. Мы собираем всё это в одну
            фильтруемую базу — по шести главным IT и математическим вузам страны.
          </p>
        </SectionHeading>
      </Reveal>

      {/* факторы льгот */}
      <Reveal>
        <h2 className="mb-4 font-display text-lg font-bold text-slate-100">Льгота — это функция пяти переменных</h2>
      </Reveal>
      <div className="flex flex-wrap gap-2.5">
        {FACTORS.map((f, i) => (
          <Reveal key={f.t} delay={i * 70}>
            <details className="group w-64 rounded-xl border border-slate-700/50 bg-ink-850/80 p-4 open:border-sky-400/40">
              <summary className="flex cursor-pointer list-none items-center justify-between font-display text-[13.5px] font-bold text-slate-100 [&::-webkit-details-marker]:hidden">
                {f.t}
                <span className="font-mono text-[10px] text-signal-300 transition group-open:rotate-90">▸</span>
              </summary>
              <p className="mt-2.5 text-[12.5px] leading-relaxed text-slate-400">{f.d}</p>
            </details>
          </Reveal>
        ))}
      </div>

      {/* статусы */}
      <div className="mt-14 grid gap-8 lg:grid-cols-2">
        <Reveal>
          <div>
            <h2 className="font-display text-lg font-bold text-slate-100">Честные статусы данных</h2>
            <div className="mt-4 space-y-3">
              <div className="flex items-start gap-3 rounded-xl border border-slate-700/50 bg-ink-850/70 p-4">
                <StatusChip status="confirmed" />
                <p className="text-[12.5px] leading-relaxed text-slate-400">
                  Запись сверена с официальным документом: у МФТИ это таблица «Засчитываемые олимпиады» 2026
                  года, для ВсОШ и сборных — федеральное законодательство.
                </p>
              </div>
              <div className="flex items-start gap-3 rounded-xl border border-slate-700/50 bg-ink-850/70 p-4">
                <StatusChip status="needs_verification" />
                <p className="text-[12.5px] leading-relaxed text-slate-400">
                  Типовая схема прошлых лет со ссылкой, где проверить. Не факт — ориентир для поиска в правилах
                  приёма 2026 года.
                </p>
              </div>
              <div className="flex items-start gap-3 rounded-xl border border-slate-700/50 bg-ink-850/70 p-4">
                <StatusChip status="draft" />
                <p className="text-[12.5px] leading-relaxed text-slate-400">
                  Черновик записи: добавлен в базу, но ещё не заполнен. Такой подход исключает выдуманные данные.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div>
            <h2 className="font-display text-lg font-bold text-slate-100">Как устроены данные</h2>
            <p className="mt-4 text-[13.5px] leading-relaxed text-slate-400">
              База хранится в четырёх TypeScript-файлах, которые удобно редактировать вручную:
            </p>
            <div className="mt-4 overflow-hidden rounded-xl border border-slate-700/60 bg-ink-950/90">
              {[
                ["src/data/universities.ts", "6 вузов, сайты, страницы приёмных комиссий"],
                ["src/data/programs.ts", "19 профильных направлений и факультетов"],
                ["src/data/olympiads.ts", "19 олимпиад с уровнями по предметам"],
                ["src/data/benefits.ts", "записи «вуз × программа × олимпиада → льгота»"],
              ].map(([f, d]) => (
                <div key={f} className="flex flex-col gap-1 border-b border-slate-800/80 px-4 py-3 last:border-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                  <code className="font-mono text-[11.5px] text-signal-300">{f}</code>
                  <span className="text-[11.5px] text-slate-500">{d}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-[12.5px] leading-relaxed text-slate-500">
              Позже слой данных можно заменить автоматической выгрузкой с официальных страниц — интерфейсы и
              типы останутся прежними.
            </p>
          </div>
        </Reveal>
      </div>

      {/* FAQ */}
      <Reveal>
        <div className="mt-14">
          <h2 className="mb-4 font-display text-lg font-bold text-slate-100">Частые вопросы</h2>
          <Faq />
        </div>
      </Reveal>

      {/* финальный дисклеймер */}
      <Reveal>
        <div className="mt-14 rounded-xl border border-amber-400/30 bg-amber-400/[0.06] p-6 sm:p-7">
          <p className="text-[13.5px] leading-relaxed text-amber-100/90">
            <strong className="font-semibold text-amber-200">Важно.</strong> Справочник помогает сориентироваться,
            но не заменяет правила приёма. Льгота, которая работала в прошлом году, могла измениться. Перед
            подачей документов откройте{" "}
            <Link to="/sources" className="link-underline font-semibold text-amber-200">официальные источники</Link>{" "}
            и сверьте каждую запись — это займёт несколько минут.
          </p>
          <Link to="/olympiads" className="mt-5 inline-flex items-center gap-2 rounded-lg bg-signal-400 px-5 py-2.5 text-[13px] font-semibold text-ink-950 transition hover:bg-sky-300">
            Перейти к олимпиадам <IconArrow className="h-4 w-4" />
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
