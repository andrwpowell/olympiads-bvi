# БВИ·Справочник — олимпиады с БВИ в IT и математические вузы

Неофициальный справочник олимпиад, дающих право на **поступление без вступительных испытаний (БВИ)** и другие
льготы (100 баллов по предмету) на IT и математические направления шести вузов:

**НИУ ВШЭ · МФТИ · НИЯУ МИФИ · МГУ · Университет ИТМО · СПбГУ**

Темная тема, фильтры по вузу / предмету / уровню олимпиады / типу льготы, поиск, адаптивная верстка
(таблица на десктопе, карточки на мобильных), статусы данных `confirmed / needs_verification / draft`.

> ⚠️ Сайт не связан с приёмными комиссиями. Записи со статусом «Требует проверки» обязательно сверяйте
> с официальными правилами приёма (раздел «Источники» на сайте).

---

## Технологии

Проект собран в окружении **Vite + React 18 + TypeScript + Tailwind CSS v4** с клиентским роутингом
(`react-router-dom`, HashRouter — работает на любом статическом хостинге без настройки rewrites).
Архитектура сознательно повторяет структуру Next.js App Router, чтобы перенос был механическим:

| Здесь (Vite SPA)                    | Аналог в Next.js App Router              |
| ----------------------------------- | ---------------------------------------- |
| `src/pages/HomePage.tsx`            | `app/page.tsx`                           |
| `src/pages/UniversitiesPage.tsx`    | `app/universities/page.tsx`              |
| `src/pages/UniversityPage.tsx`      | `app/universities/[slug]/page.tsx`       |
| `src/pages/OlympiadsPage.tsx`       | `app/olympiads/page.tsx`                 |
| `src/pages/SourcesPage.tsx`         | `app/sources/page.tsx`                   |
| `src/pages/AboutPage.tsx`           | `app/about/page.tsx`                     |
| `usePageMeta()` (title/description) | `export const metadata` / `generateMetadata` |
| `public/robots.txt`, `public/favicon.svg` | те же файлы в `public/`            |

Слой данных (`src/data/*`) фреймворк-независим и одинаково работает в обеих архитектурах.

---

## Запуск локально

```bash
npm install        # установка зависимостей
npm run dev        # дев-сервер (http://localhost:5173)
npm run build      # продакшен-сборка в dist/
npm run typecheck  # проверка типов
