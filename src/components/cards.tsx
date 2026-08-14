import { Link } from "react-router-dom";
import {
  BENEFIT_TYPES,
  DIPLOMAS,
  UNIVERSITY_ACCENTS,
  benefitsOfOlympiad,
  getOlympiad,
  getProgram,
  getUniversity,
  type Benefit,
  type Olympiad,
} from "../data";
import {
  BenefitBadge,
  IconArrow,
  IconExternal,
  LevelBadge,
  StatusChip,
  SubjectBadge,
} from "./ui";

/* ================= карточка вуза ================= */

export const UniversityCard = ({
  university,
  programCount,
  olympiadCount,
  benefitCount,
  confirmedCount,
}: {
  university: ReturnType<typeof getUniversity> & object;
  programCount: number;
  olympiadCount: number;
  benefitCount: number;
  confirmedCount: number;
}) => {
  const u = university!;
  const a = UNIVERSITY_ACCENTS[u.accent];
  return (
    <Link
      to={`/universities/${u.slug}`}
      className={`card-hover group relative flex flex-col overflow-hidden rounded-xl border border-slate-700/50 bg-ink-850/80 p-6 ${a.border}`}
    >
      <div className={`pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-gradient-to-br ${a.glow} to-transparent blur-2xl opacity-70 transition group-hover:opacity-100`} />
      <div className="flex items-start justify-between gap-3">
        <span className={`grid h-11 w-11 place-items-center rounded-lg border font-display text-[13px] font-bold ${a.chip}`}>
          {u.shortName.slice(0, 4)}
        </span>
        <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-slate-500">{u.city}</span>
      </div>
      <h3 className="mt-4 font-display text-[15.5px] font-bold leading-snug text-slate-100">{u.name}</h3>
      <p className="mt-2.5 line-clamp-3 text-[13px] leading-relaxed text-slate-400">{u.description}</p>
      <div className="mt-5 grid grid-cols-3 gap-2 border-t border-slate-700/50 pt-4">
        <div>
          <p className="font-display text-lg font-bold text-slate-100">{programCount}</p>
          <p className="font-mono text-[9.5px] uppercase tracking-wider text-slate-500">программ</p>
        </div>
        <div>
          <p className="font-display text-lg font-bold text-slate-100">{olympiadCount}</p>
          <p className="font-mono text-[9.5px] uppercase tracking-wider text-slate-500">олимпиад</p>
        </div>
        <div>
          <p className="font-display text-lg font-bold text-slate-100">{benefitCount}</p>
          <p className="font-mono text-[9.5px] uppercase tracking-wider text-slate-500">льгот</p>
        </div>
      </div>
      <span className="mt-5 inline-flex items-center gap-2 text-[13px] font-semibold text-signal-300">
        Смотреть олимпиады
        <IconArrow className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
      </span>
      {confirmedCount > 0 && (
        <span className="absolute right-4 bottom-4 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 font-mono text-[9.5px] text-emerald-300">
          {confirmedCount} подтв.
        </span>
      )}
    </Link>
  );
};

/* ================= карточка олимпиады ================= */

export const OlympiadCard = ({ olympiad }: { olympiad: Olympiad }) => {
  const list = benefitsOfOlympiad(olympiad.id);
  const byUniversity = new Map<string, Set<string>>();
  list.forEach((b) => {
    const key = b.universityId;
    if (!byUniversity.has(key)) byUniversity.set(key, new Set());
    byUniversity.get(key)!.add(BENEFIT_TYPES[b.benefitType].short);
  });
  return (
    <article className="card-hover group rounded-xl border border-slate-700/50 bg-ink-850/80 p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-display text-[15.5px] font-bold leading-snug text-slate-100">
            <a href={olympiad.officialWebsiteUrl} target="_blank" rel="noreferrer" className="link-underline hover:text-signal-300">
              {olympiad.name}
            </a>
          </h3>
          <p className="mt-1 font-mono text-[11px] text-slate-500">{olympiad.organizer}</p>
        </div>
        <StatusChip status={olympiad.status} hint />
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {olympiad.subjectLevels.map((sl) => (
          <span key={sl.subject} className="inline-flex items-center gap-1.5">
            <SubjectBadge subject={sl.subject} short />
            <LevelBadge level={sl.level} short />
          </span>
        ))}
      </div>

      <p className="mt-3.5 text-[13px] leading-relaxed text-slate-400">{olympiad.description}</p>

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-700/50 pt-4">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">Льготы:</span>
        {[...byUniversity.entries()].map(([uid, types]) => {
          const u = getUniversity(uid);
          if (!u) return null;
          const a = UNIVERSITY_ACCENTS[u.accent];
          return (
            <Link
              key={uid}
              to={`/universities/${u.slug}`}
              className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] font-semibold transition hover:brightness-125 ${a.chip}`}
            >
              {u.shortName}
              <span className="font-mono text-[9.5px] font-normal opacity-80">{[...types].join(" · ")}</span>
            </Link>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <span className="font-mono text-[10.5px] text-slate-500">
          классы: {olympiad.classes.length ? `${Math.min(...olympiad.classes)}–${Math.max(...olympiad.classes)}` : "—"}
        </span>
        <a
          href={olympiad.officialWebsiteUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-signal-300 hover:text-sky-200"
        >
          Сайт олимпиады <IconExternal />
        </a>
      </div>
    </article>
  );
};

/* ================= льгота: строка таблицы (desktop) ================= */

export const BenefitRow = ({ benefit }: { benefit: Benefit }) => {
  const o = getOlympiad(benefit.olympiadId);
  const p = benefit.programId ? getProgram(benefit.programId) : null;
  if (!o) return null;
  return (
    <tr className="group border-b border-slate-800/70 transition hover:bg-white/[0.025]">
      <td className="px-4 py-4 align-top">
        <p className="text-[13.5px] font-semibold leading-snug text-slate-100">{o.name}</p>
        <div className="mt-1.5 flex flex-wrap gap-1">
          {o.subjectLevels
            .filter((sl) => !benefit.subject || sl.subject === benefit.subject)
            .map((sl) => (
              <LevelBadge key={sl.subject} level={sl.level} short />
            ))}
        </div>
      </td>
      <td className="px-4 py-4 align-top">
        <div className="flex flex-col gap-1.5">
          {benefit.subject ? (
            <SubjectBadge subject={benefit.subject} short />
          ) : (
            <span className="text-[12px] text-slate-400">по профилю</span>
          )}
          <span className="max-w-[150px] text-[11.5px] leading-snug text-slate-500">
            {p ? p.name : "все профильные программы"}
          </span>
        </div>
      </td>
      <td className="px-4 py-4 align-top">
        <div className="flex flex-col items-start gap-1.5">
          <BenefitBadge type={benefit.benefitType} />
          <span className="text-[11.5px] text-slate-400">{DIPLOMAS[benefit.diploma]}</span>
        </div>
      </td>
      <td className="max-w-[300px] px-4 py-4 align-top">
        <p className="text-[12px] leading-relaxed text-slate-400">{benefit.conditions}</p>
      </td>
      <td className="px-4 py-4 align-top">
        <div className="flex flex-col items-start gap-1.5">
          <StatusChip status={benefit.status} hint />
          <a
            href={benefit.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-[11px] text-signal-300/90 hover:text-sky-200"
          >
            Источник <IconExternal className="h-3 w-3" />
          </a>
        </div>
      </td>
    </tr>
  );
};

/* ================= льгота: карточка (mobile) ================= */

export const BenefitCard = ({ benefit }: { benefit: Benefit }) => {
  const o = getOlympiad(benefit.olympiadId);
  const p = benefit.programId ? getProgram(benefit.programId) : null;
  if (!o) return null;
  return (
    <article className="rounded-xl border border-slate-700/50 bg-ink-850/80 p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[14px] font-semibold leading-snug text-slate-100">{o.name}</p>
        <BenefitBadge type={benefit.benefitType} />
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {benefit.subject ? (
          <SubjectBadge subject={benefit.subject} short />
        ) : (
          <span className="rounded-full border border-slate-600/50 px-2.5 py-0.5 text-[11px] text-slate-400">по профилю</span>
        )}
        {o.subjectLevels
          .filter((sl) => !benefit.subject || sl.subject === benefit.subject)
          .map((sl) => (
            <LevelBadge key={sl.subject} level={sl.level} short />
          ))}
      </div>
      <p className="mt-3 text-[12px] leading-relaxed text-slate-400">{benefit.conditions}</p>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-700/50 pt-3">
        <div className="flex items-center gap-2">
          <StatusChip status={benefit.status} hint />
          <span className="text-[11px] text-slate-500">{DIPLOMAS[benefit.diploma]}</span>
        </div>
        <a href={benefit.sourceUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[11.5px] font-medium text-signal-300">
          Источник <IconExternal className="h-3 w-3" />
        </a>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <p className="font-mono text-[10.5px] text-slate-500">{p ? p.name : "Все профильные программы вуза"}</p>
        <p className="flex items-center gap-2.5 font-mono text-[10.5px] text-slate-500">
          <span>
            приём <span className="text-slate-300">{benefit.year}</span>
          </span>
          <a href={o.officialWebsiteUrl} target="_blank" rel="noreferrer" className="link-underline text-slate-400 hover:text-signal-300">
            сайт олимпиады
          </a>
        </p>
      </div>
    </article>
  );
};
