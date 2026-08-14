import { Reveal, usePageMeta } from "../lib/hooks";
import { universityStats } from "../data";
import { SectionHeading } from "../components/ui";
import { UniversityCard } from "../components/cards";
import { IconExternal } from "../components/ui";

export default function UniversitiesPage() {
  usePageMeta(
    "Вузы — олимпиады с БВИ в IT-вузы",
    "ВШЭ, МФТИ, МИФИ, МГУ, ИТМО и СПбГУ: профильные IT и математические программы, страницы приёмных комиссий и правила приёма.",
  );
  const stats = universityStats();

  return (
    <section className="mx-auto max-w-6xl px-4 pb-10 pt-14">
      <Reveal>
        <SectionHeading kicker="раздел / вузы" title="Шесть вузов — только профильные направления">
          <p>
            В справочник включены лишь программы, связанные с информатикой, математикой, программной инженерией,
            информационной безопасностью, Data Science и ИИ. У каждого вуза — ссылки на официальный сайт и
            страницу правил приёма.
          </p>
        </SectionHeading>
      </Reveal>

      <div className="grid gap-5 sm:grid-cols-2">
        {stats.map((s, i) => (
          <Reveal key={s.university.id} delay={(i % 2) * 90}>
            <div className="flex h-full flex-col">
              <UniversityCard
                university={s.university}
                programCount={s.programCount}
                olympiadCount={s.olympiadCount}
                benefitCount={s.benefitCount}
                confirmedCount={s.confirmedCount}
              />
              <div className="mt-3 flex items-center justify-between gap-3 rounded-lg border border-slate-800 bg-ink-900/70 px-4 py-2.5">
                <a
                  href={s.university.website}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-[12px] font-medium text-slate-400 transition hover:text-signal-300"
                >
                  {s.university.website.replace("https://", "")} <IconExternal className="h-3 w-3" />
                </a>
                <a
                  href={s.university.admissionPageUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="link-underline inline-flex items-center gap-1.5 text-[12px] font-semibold text-signal-300"
                >
                  Правила приёма <IconExternal className="h-3 w-3" />
                </a>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
