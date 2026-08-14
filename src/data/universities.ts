import type { University } from "./types";

/**
 * Вузы, входящие в справочник.
 * Ссылки admissionPageUrl ведут на официальные страницы приёмных комиссий.
 */
export const universities: University[] = [
  {
    id: "hse",
    slug: "hse",
    name: "НИУ «Высшая школа экономики»",
    shortName: "ВШЭ",
    city: "Москва",
    website: "https://www.hse.ru",
    admissionPageUrl: "https://olymp.hse.ru",
    description:
      "Один из лидеров по IT-направлениям: Факультет компьютерных наук (совместно с Яндексом) — прикладная математика и информатика, программная инженерия; Факультет математики. Проводит олимпиаду «Высшая проба».",
    accent: "sky",
  },
  {
    id: "mipt",
    slug: "mipt",
    name: "Московский физико-технический институт",
    shortName: "МФТИ",
    city: "Долгопрудный",
    website: "https://mipt.ru",
    admissionPageUrl: "https://pk.mipt.ru/bachelor/2026_olympiads/",
    description:
      "Физтех-школа прикладной математики и информатики (ФПМИ) — ПМИ, информатика и вычислительная техника, ИИ. Приёмная комиссия публикует детальную таблицу засчитываемых олимпиад с порогами ЕГЭ по каждой конкурсной группе.",
    accent: "cyan",
  },
  {
    id: "mephi",
    slug: "mephi",
    name: "НИЯУ «МИФИ»",
    shortName: "МИФИ",
    city: "Москва",
    website: "https://mephi.ru",
    admissionPageUrl: "https://admission.mephi.ru/admission/baccalaureate-and-specialty/specials/winners",
    description:
      "Национальный исследовательский ядерный университет: сильная школа информационной безопасности и прикладной математики, опорный вуз Росатома. Льготы олимпиадникам публикует раздел приёмной комиссии «Победителям и призёрам олимпиад».",
    accent: "rose",
  },
  {
    id: "msu",
    slug: "msu",
    name: "Московский государственный университет им. М. В. Ломоносова",
    shortName: "МГУ",
    city: "Москва",
    website: "https://www.msu.ru",
    admissionPageUrl: "https://cpk.msu.ru",
    description:
      "Классическая математическая школа: ВМК и механико-математический факультет. Организатор олимпиады «Ломоносов». Особые права публикуются Центром приёмных комиссий (cpk.msu.ru) в PDF-документе к правилам приёма.",
    accent: "violet",
  },
  {
    id: "itmo",
    slug: "itmo",
    name: "Университет ИТМО",
    shortName: "ИТМО",
    city: "Санкт-Петербург",
    website: "https://itmo.ru",
    admissionPageUrl: "https://abiturient.itmo.ru",
    description:
      "Единственный семикратный чемпион мира по программированию ICPC. Сильные программы по прикладной математике и информатике, программной инженерии, ИИ и информационной безопасности (ФБИТ).",
    accent: "teal",
  },
  {
    id: "spbu",
    slug: "spbu",
    name: "Санкт-Петербургский государственный университет",
    shortName: "СПбГУ",
    city: "Санкт-Петербург",
    website: "https://spbu.ru",
    admissionPageUrl: "https://abiturient.spbu.ru",
    description:
      "Старейший университет страны. Программа «Математика и компьютерные науки» математико-механического факультета — одна из самых конкурентных в Петербурге. Проводит собственную Олимпиаду школьников СПбГУ.",
    accent: "amber",
  },
];
