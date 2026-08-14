import { useEffect, useState, type ReactNode } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { IconAlert } from "./ui";
import { globalStats } from "../data";

/* ---------- фоновые слои ---------- */
const BackgroundFX = () => (
  <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
    <div className="absolute inset-0 bg-ink-950" />
    <div className="bg-grid absolute inset-0" />
    <div className="animate-float-slow absolute -top-40 -left-40 h-[560px] w-[560px] rounded-full bg-sky-500/10 blur-[140px]" />
    <div className="animate-float-slower absolute top-1/3 -right-52 h-[620px] w-[620px] rounded-full bg-teal-500/8 blur-[150px]" />
    <div className="animate-float-slow absolute -bottom-56 left-1/4 h-[520px] w-[520px] rounded-full bg-violet-500/7 blur-[140px]" />
    <div className="bg-noise absolute inset-0" />
  </div>
);

/* ---------- логотип ---------- */
const Logo = () => (
  <Link to="/" className="group flex items-center gap-2.5">
    <span className="grid h-9 w-9 place-items-center rounded-lg border border-sky-400/30 bg-ink-800 shadow-[0_0_24px_-6px_rgba(56,189,248,0.5)] transition group-hover:border-sky-400/60">
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
        <path d="M9 5.5C5.8 6.6 5.3 9 5.3 12s.5 5.4 3.7 6.5" stroke="#38bdf8" strokeWidth="1.7" strokeLinecap="round" />
        <path d="M15 5.5c3.2 1.1 3.7 3.5 3.7 6.5s-.5 5.4-3.7 6.5" stroke="#38bdf8" strokeWidth="1.7" strokeLinecap="round" />
        <path d="m9.5 12.3 1.9 1.9 3.4-4.4" stroke="#34d399" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
    <span className="leading-none">
      <span className="block font-display text-[13px] font-bold tracking-wide text-slate-100">
        БВИ·<span className="text-signal-300">СПРАВОЧНИК</span>
      </span>
      <span className="mt-1 block font-mono text-[9px] uppercase tracking-[0.24em] text-slate-500">
        олимпиады → вузы · IT
      </span>
    </span>
  </Link>
);

const NAV = [
  { to: "/", label: "Главная", end: true },
  { to: "/picker", label: "Подбор" },
  { to: "/universities", label: "Вузы" },
  { to: "/olympiads", label: "Олимпиады" },
  { to: "/sources", label: "Источники" },
  { to: "/about", label: "О проекте" },
];

/* ---------- шапка ---------- */
const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => setOpen(false), [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50">
      <div className="border-b border-amber-400/15 bg-amber-400/[0.06] backdrop-blur">
        <p className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-4 py-1.5 text-center font-mono text-[10.5px] leading-4 tracking-wide text-amber-300/90 sm:text-[11px]">
          <IconAlert className="h-3.5 w-3.5 shrink-0" />
          <span>
            Данные требуют проверки. Перед подачей документов смотрите официальные сайты вузов —{" "}
            <Link to="/sources" className="link-underline font-semibold text-amber-200">
              источники
            </Link>
          </span>
        </p>
      </div>

      <div
        className={`border-b transition-all duration-300 ${
          scrolled
            ? "border-slate-700/60 bg-ink-950/85 backdrop-blur-xl shadow-[0_8px_30px_-16px_rgba(0,0,0,0.8)]"
            : "border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Logo />

          <nav className="hidden items-center gap-1 md:flex">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `relative rounded-lg px-3.5 py-2 text-[13.5px] font-medium transition ${
                    isActive
                      ? "text-signal-300 bg-sky-400/10"
                      : "text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <Link
              to="/picker"
              className="ml-3 rounded-lg bg-signal-400 px-4 py-2 text-[13px] font-semibold text-ink-950 transition hover:bg-sky-300 hover:shadow-[0_0_28px_-6px_rgba(56,189,248,0.7)]"
            >
              Подобрать олимпиады
            </Link>
          </nav>

          <button
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-lg border border-slate-700/70 text-slate-300 md:hidden"
            aria-label="Меню"
            aria-expanded={open}
          >
            <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none">
              {open ? (
                <path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              ) : (
                <path d="M3 5.5h14M3 10h14M3 14.5h9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>

        {open && (
          <nav className="border-t border-slate-800 bg-ink-900/95 px-4 py-3 backdrop-blur-xl md:hidden">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `block rounded-lg px-3 py-2.5 text-sm font-medium ${
                    isActive ? "bg-sky-400/10 text-signal-300" : "text-slate-300"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
};

/* ---------- футер ---------- */
const Footer = () => (
  <footer className="mt-24 border-t border-slate-800/80 bg-ink-900/60">
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm text-[13px] leading-relaxed text-slate-400">
            Неофициальный справочник олимпиад, дающих право на поступление без вступительных испытаний
            и другие льготы на IT и математические программы шести вузов.
          </p>
          <p className="mt-4 font-mono text-[11px] text-slate-500">
            база: {globalStats.olympiads} олимпиад · {globalStats.benefits} записей о льготах · приём {globalStats.dataYear}
          </p>
        </div>
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">Разделы</p>
          <ul className="mt-4 space-y-2.5 text-[13.5px]">
            {NAV.map((n) => (
              <li key={n.to}>
                <Link to={n.to} className="link-underline text-slate-300 hover:text-signal-300">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">Дисклеймер</p>
          <p className="mt-4 text-[13px] leading-relaxed text-slate-400">
            Сайт не связан с приёмными комиссиями. Льготы зависят от года приёма, вуза, программы,
            уровня олимпиады и категории диплома. Записи со статусом{" "}
            <span className="text-amber-300">«Требует проверки»</span> обязательно сверяйте с
            официальными правилами приёма.
          </p>
        </div>
      </div>
      <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-slate-800/80 pt-6 sm:flex-row sm:items-center">
        <p className="font-mono text-[11px] text-slate-500">© {new Date().getFullYear()} · справочник «Олимпиады с БВИ»</p>
        <p className="font-mono text-[11px] text-slate-500">данные обновляются вручную · v0.1</p>
      </div>
    </div>
  </footer>
);

/* ---------- каркас ---------- */
export const Layout = ({ children }: { children: ReactNode }) => (
  <div className="min-h-screen">
    <BackgroundFX />
    <Header />
    <main>{children}</main>
    <Footer />
  </div>
);
