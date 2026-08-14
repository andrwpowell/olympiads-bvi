import type { Olympiad } from "./types";

/**
 * Олимпиады, релевантные IT / математическим программам шести вузов.
 *
 * Уровни по предметам взяты из Перечня олимпиад школьников и их уровней
 * на 2025/26 учебный год (приказ Минобрнауки России от 30.08.2025 № 669) —
 * в том виде, в каком они процитированы в официальной таблице
 * «Засчитываемые олимпиады» приёмной комиссии МФТИ:
 * https://pk.mipt.ru/bachelor/2026_olympiads/
 *
 * officialWebsiteUrl для части олимпиад указан агрегатор olimpiada.ru —
 * точные адреса официальных сайтов проверьте вручную (пометка на странице «Источники»).
 */

const RSOSH_SOURCE = "https://pk.mipt.ru/bachelor/2026_olympiads/";
const RETRIEVED = "2026-02-01";
const YEAR = 2026;

export const olympiads: Olympiad[] = [
  {
    id: "vsosh",
    name: "Всероссийская олимпиада школьников — заключительный этап",
    shortName: "ВсОШ",
    organizer: "Минпросвещения России",
    description:
      "Главная школьная олимпиада страны. Победители и призёры заключительного этапа получают БВИ по закону (ч. 4 ст. 71 ФЗ-273 «Об образовании») во все вузы, независимо от результатов ЕГЭ; право действует 4 года.",
    officialWebsiteUrl: "https://olimpiada.ru",
    subjectLevels: [
      { subject: "math", level: "vsosh" },
      { subject: "informatics", level: "vsosh" },
      { subject: "physics", level: "vsosh" },
    ],
    classes: [9, 10, 11],
    sourceUrl: RSOSH_SOURCE,
    retrievedAt: RETRIEVED,
    year: YEAR,
    status: "confirmed",
  },
  {
    id: "intl",
    name: "Международные олимпиады (IMO, IOI, IPhO и др.)",
    shortName: "Международные",
    organizer: "Сборные команды Российской Федерации",
    description:
      "Члены сборных команд РФ, участвовавших в международных олимпиадах по общеобразовательным предметам (перечень утверждён распоряжением Правительства РФ от 16.11.2024 № 3310-р), получают БВИ независимо от ЕГЭ.",
    officialWebsiteUrl: "https://ru.imo-official.org",
    subjectLevels: [
      { subject: "math", level: "international" },
      { subject: "informatics", level: "international" },
      { subject: "physics", level: "international" },
    ],
    classes: [9, 10, 11],
    sourceUrl: RSOSH_SOURCE,
    retrievedAt: RETRIEVED,
    year: YEAR,
    status: "confirmed",
  },
  {
    id: "lomonosov",
    name: "Олимпиада школьников «Ломоносов»",
    shortName: "Ломоносов",
    organizer: "МГУ им. М. В. Ломоносова",
    description:
      "Флагманская олимпиада МГУ по десяткам предметов. Для IT-направлений ключевые профили — математика (уровень 1) и информатика (уровень 2).",
    officialWebsiteUrl: "https://olymp.msu.ru",
    subjectLevels: [
      { subject: "math", level: "rsosh1" },
      { subject: "informatics", level: "rsosh2" },
      { subject: "physics", level: "rsosh1" },
    ],
    classes: [5, 6, 7, 8, 9, 10, 11],
    sourceUrl: RSOSH_SOURCE,
    retrievedAt: RETRIEVED,
    year: YEAR,
    status: "confirmed",
  },
  {
    id: "fishtech",
    name: "Олимпиада школьников «Физтех»",
    shortName: "Физтех",
    organizer: "МФТИ",
    description:
      "Домашняя олимпиада МФТИ. Математика — уровень 2, физика — уровень 1, профиль «Информатика и программирование» — уровень 3. МФТИ дополнительно засчитывает результаты победителей «Физтеха» за 10 класс.",
    officialWebsiteUrl: "https://pk.mipt.ru/olimp/",
    subjectLevels: [
      { subject: "math", level: "rsosh2" },
      { subject: "informatics", level: "rsosh3" },
      { subject: "physics", level: "rsosh1" },
    ],
    classes: [8, 9, 10, 11],
    sourceUrl: RSOSH_SOURCE,
    retrievedAt: RETRIEVED,
    year: YEAR,
    status: "confirmed",
  },
  {
    id: "vproba",
    name: "Всероссийская олимпиада школьников «Высшая проба»",
    shortName: "Высшая проба",
    organizer: "НИУ ВШЭ",
    description:
      "Олимпиада Вышки с высоким уровнем доверия вузов: математика и информатика — уровень 1, физика — уровень 2. Победители традиционно получают БВИ на IT-программы ряда вузов.",
    officialWebsiteUrl: "https://olymp.hse.ru",
    subjectLevels: [
      { subject: "math", level: "rsosh1" },
      { subject: "informatics", level: "rsosh1" },
      { subject: "physics", level: "rsosh2" },
    ],
    classes: [7, 8, 9, 10, 11],
    sourceUrl: RSOSH_SOURCE,
    retrievedAt: RETRIEVED,
    year: YEAR,
    status: "confirmed",
  },
  {
    id: "mos-olymp",
    name: "Московская олимпиада школьников",
    shortName: "Московская",
    organizer: "МГУ, Правительство Москвы и др.",
    description:
      "Одна из старейших олимпиад: математика, информатика и физика — уровень 1. Сильно котируется в МГУ, ВШЭ, МФТИ и ИТМО.",
    officialWebsiteUrl: "https://olimpiada.ru",
    subjectLevels: [
      { subject: "math", level: "rsosh1" },
      { subject: "informatics", level: "rsosh1" },
      { subject: "physics", level: "rsosh1" },
    ],
    classes: [5, 6, 7, 8, 9, 10, 11],
    sourceUrl: RSOSH_SOURCE,
    retrievedAt: RETRIEVED,
    year: YEAR,
    status: "confirmed",
  },
  {
    id: "spbu-olymp",
    name: "Олимпиада школьников Санкт-Петербургского государственного университета",
    shortName: "Олимпиада СПбГУ",
    organizer: "СПбГУ",
    description:
      "Собственная олимпиада СПбГУ: математика и информатика — уровень 1, физика — уровень 2. Ключевая олимпиада для поступления на «Математику и компьютерные науки».",
    officialWebsiteUrl: "https://olympiada.spbu.ru",
    subjectLevels: [
      { subject: "math", level: "rsosh1" },
      { subject: "informatics", level: "rsosh1" },
      { subject: "physics", level: "rsosh2" },
    ],
    classes: [5, 6, 7, 8, 9, 10, 11],
    sourceUrl: RSOSH_SOURCE,
    retrievedAt: RETRIEVED,
    year: YEAR,
    status: "confirmed",
  },
  {
    id: "oip",
    name: "Олимпиада школьников по информатике и программированию",
    shortName: "ОИиП",
    organizer: "Оргкомитет олимпиады (уточните в Перечне РСОШ)",
    description:
      "Профильная олимпиада по информатике 1-го уровня. По правилам МФТИ 2026 года победители получают БВИ на конкурсные группы ФПМИ при ЕГЭ/ВИ по математике от 85 баллов.",
    officialWebsiteUrl: "https://olimpiada.ru",
    subjectLevels: [{ subject: "informatics", level: "rsosh1" }],
    classes: [8, 9, 10, 11],
    sourceUrl: RSOSH_SOURCE,
    retrievedAt: RETRIEVED,
    year: YEAR,
    status: "confirmed",
  },
  {
    id: "open-prog",
    name: "Открытая олимпиада школьников по программированию",
    shortName: "Открытая (программирование)",
    organizer: "Оргкомитет олимпиады (уточните в Перечне РСОШ)",
    description:
      "Олимпиада 1-го уровня по информатике. В таблице МФТИ-2026 победителям даётся БВИ на все конкурсные группы ФПМИ при ЕГЭ/ВИ по математике от 85 баллов.",
    officialWebsiteUrl: "https://olimpiada.ru",
    subjectLevels: [{ subject: "informatics", level: "rsosh1" }],
    classes: [7, 8, 9, 10, 11],
    sourceUrl: RSOSH_SOURCE,
    retrievedAt: RETRIEVED,
    year: YEAR,
    status: "confirmed",
  },
  {
    id: "open-olymp",
    name: "Открытая олимпиада школьников",
    shortName: "Открытая олимпиада",
    organizer: "Оргкомитет олимпиады (уточните в Перечне РСОШ)",
    description:
      "Многопредметная олимпиада: информатика — уровень 1, математика и физика — уровень 3. Интересна прежде всего профилем по информатике.",
    officialWebsiteUrl: "https://olimpiada.ru",
    subjectLevels: [
      { subject: "math", level: "rsosh3" },
      { subject: "informatics", level: "rsosh1" },
      { subject: "physics", level: "rsosh3" },
    ],
    classes: [7, 8, 9, 10, 11],
    sourceUrl: RSOSH_SOURCE,
    retrievedAt: RETRIEVED,
    year: YEAR,
    status: "confirmed",
  },
  {
    id: "technocup",
    name: "Олимпиада школьников по программированию «Технокубок»",
    shortName: "Технокубок",
    organizer: "МФТИ, VK, МГТУ им. Баумана (уточните состав оргкомитета)",
    description:
      "Соревнование по спортивному программированию, уровень 2 по информатике. Для победителей предусмотрены льготы в конкурсных группах ФБВТ и ВШПИ МФТИ.",
    officialWebsiteUrl: "https://techno-cup.ru",
    subjectLevels: [{ subject: "informatics", level: "rsosh2" }],
    classes: [8, 9, 10, 11],
    sourceUrl: RSOSH_SOURCE,
    retrievedAt: RETRIEVED,
    year: YEAR,
    status: "confirmed",
  },
  {
    id: "innopolis",
    name: "Международная олимпиада «Innopolis Open»",
    shortName: "Innopolis Open",
    organizer: "Университет Иннополис",
    description:
      "Международная олимпиада в Перечне РСОШ: информатика и математика — уровень 2. В МФТИ даёт льготы конкурсным группам ФБВТ (победителям, информатика от 80).",
    officialWebsiteUrl: "https://open.innopolis.university",
    subjectLevels: [
      { subject: "math", level: "rsosh2" },
      { subject: "informatics", level: "rsosh2" },
    ],
    classes: [7, 8, 9, 10, 11],
    sourceUrl: RSOSH_SOURCE,
    retrievedAt: RETRIEVED,
    year: YEAR,
    status: "confirmed",
  },
  {
    id: "kurcatov",
    name: "Олимпиада Курчатов",
    shortName: "Курчатов",
    organizer: "НИЦ «Курчатовский институт», НИЯУ МИФИ (уточните)",
    description:
      "Физико-математическая олимпиада, профильная для НИЯУ МИФИ: математика и физика — уровень 2.",
    officialWebsiteUrl: "https://olimpiada.ru",
    subjectLevels: [
      { subject: "math", level: "rsosh2" },
      { subject: "physics", level: "rsosh2" },
    ],
    classes: [6, 7, 8, 9, 10, 11],
    sourceUrl: RSOSH_SOURCE,
    retrievedAt: RETRIEVED,
    year: YEAR,
    status: "confirmed",
  },
  {
    id: "rosatom",
    name: "Отраслевая физико-математическая олимпиада школьников «Росатом»",
    shortName: "Росатом",
    organizer: "Госкорпорация «Росатом», вузы-партнёры",
    description:
      "Отраслевая олимпиада: физика — уровень 1, математика и информатика — уровень 2. Традиционно важна для НИЯУ МИФИ — опорного вуза Росатома.",
    officialWebsiteUrl: "https://olimpiada.ru",
    subjectLevels: [
      { subject: "math", level: "rsosh2" },
      { subject: "informatics", level: "rsosh2" },
      { subject: "physics", level: "rsosh1" },
    ],
    classes: [7, 8, 9, 10, 11],
    sourceUrl: RSOSH_SOURCE,
    retrievedAt: RETRIEVED,
    year: YEAR,
    status: "confirmed",
  },
  {
    id: "nto",
    name: "Национальная технологическая олимпиада (НТО)",
    shortName: "НТО",
    organizer: "Платформа НТИ, Кружковое движение",
    description:
      "Командная инженерная олимпиада с технологическими профилями: «Искусственный интеллект», «Информационная безопасность», «Большие данные и машинное обучение» и др. Уровни профилей — 2–3; льготы зависят от профиля.",
    officialWebsiteUrl: "https://ntcontest.ru",
    subjectLevels: [{ subject: "informatics", level: "rsosh3" }],
    classes: [8, 9, 10, 11],
    sourceUrl: RSOSH_SOURCE,
    retrievedAt: RETRIEVED,
    year: YEAR,
    status: "confirmed",
  },
  {
    id: "ai-olymp",
    name: "Всероссийская олимпиада по искусственному интеллекту",
    shortName: "Олимпиада по ИИ",
    organizer: "Оргкомитет олимпиады (уточните в Перечне РСОШ)",
    description:
      "Профиль «Искусственный интеллект», уровень 2. По правилам МФТИ-2026 победители получают БВИ на все группы ФПМИ (ЕГЭ/ВИ по математике от 85), победители и призёры — на группы ВШПИ (информатика от 80).",
    officialWebsiteUrl: "https://olimpiada.ru",
    subjectLevels: [{ subject: "informatics", level: "rsosh2" }],
    classes: [8, 9, 10, 11],
    sourceUrl: RSOSH_SOURCE,
    retrievedAt: RETRIEVED,
    year: YEAR,
    status: "confirmed",
  },
  {
    id: "shag",
    name: "Олимпиада школьников «Шаг в будущее»",
    shortName: "Шаг в будущее",
    organizer: "МГТУ им. Н. Э. Баумана",
    description:
      "Инженерная олимпиада Бауманки: физика — уровень 2, информатика и математика — уровень 3.",
    officialWebsiteUrl: "https://step-into-the-future.ru",
    subjectLevels: [
      { subject: "math", level: "rsosh3" },
      { subject: "informatics", level: "rsosh3" },
      { subject: "physics", level: "rsosh2" },
    ],
    classes: [5, 6, 7, 8, 9, 10, 11],
    sourceUrl: RSOSH_SOURCE,
    retrievedAt: RETRIEVED,
    year: YEAR,
    status: "confirmed",
  },
  {
    id: "tournament-gorodov",
    name: "Турнир городов",
    shortName: "Турнир городов",
    organizer: "Оргкомитет Турнира городов (уточните в Перечне РСОШ)",
    description:
      "Легендарная математическая олимпиада, уровень 1. В МФТИ победители и призёры получают БВИ на все группы ФПМИ при ЕГЭ/ВИ по математике от 85 баллов.",
    officialWebsiteUrl: "https://olimpiada.ru",
    subjectLevels: [{ subject: "math", level: "rsosh1" }],
    classes: [8, 9, 10, 11],
    sourceUrl: RSOSH_SOURCE,
    retrievedAt: RETRIEVED,
    year: YEAR,
    status: "confirmed",
  },
  {
    id: "ommo",
    name: "Объединённая межвузовская олимпиада школьников (ОММО)",
    shortName: "ОММО",
    organizer: "Консорциум вузов (уточните в Перечне РСОШ)",
    description:
      "Межвузовская олимпиада: математика — уровень 2, физика — уровень 3. Математический профиль засчитывается рядом технических вузов.",
    officialWebsiteUrl: "https://olimpiada.ru",
    subjectLevels: [
      { subject: "math", level: "rsosh2" },
      { subject: "physics", level: "rsosh3" },
    ],
    classes: [8, 9, 10, 11],
    sourceUrl: RSOSH_SOURCE,
    retrievedAt: RETRIEVED,
    year: YEAR,
    status: "confirmed",
  },
];
