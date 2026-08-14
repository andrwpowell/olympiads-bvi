import { type Olympiad } from "./types";

export const OLYMPIADS: Olympiad[] = [
  {
    id: "allrussian_informatics",
    name: "Всероссийская олимпиада школьников по информатике",
    organizer: "ЦПМ",
    description: "Одна из самых престижных олимпиад в России по информатике, проводится в 4 этапа.",
    officialWebsiteUrl: "https://vos.olimpiada.ru/",
    classes: [7, 8, 9, 10, 11],
    subjectLevels: [
      { subject: "informatics", level: 4 },
    ],
    status: "confirmed",
  },
  {
    id: "allrussian_math",
    name: "Всероссийская олимпиада школьников по математике",
    organizer: "ЦПМ",
    description: "Классическая олимпиада по математике, является важным этапом для поступления на математические направления.",
    officialWebsiteUrl: "https://vos.olimpiada.ru/",
    classes: [7, 8, 9, 10, 11],
    subjectLevels: [
      { subject: "math", level: 4 },
    ],
    status: "confirmed",
  },
  {
    id: "kurchatov",
    name: "Открытая олимпиада школьников «Нанотехнологии»",
    organizer: "МИСиС",
    description: "Олимпиада по физике, химии и математике, ориентирована на учащихся старших классов.",
    officialWebsiteUrl: "https://olympic.misis.ru/",
    classes: [8, 9, 10, 11],
    subjectLevels: [
      { subject: "physics", level: 3 },
      { subject: "chemistry", level: 3 },
      { subject: "math", level: 3 },
    ],
    status: "confirmed",
  },
  {
    id: "phystech",
    name: "Олимпиада «Физтех»",
    organizer: "МФТИ",
    description: "Крупнейшая олимпиада по физике и математике, проводимая МФТИ, с международным участием.",
    officialWebsiteUrl: "https://olympiadphystech.ru/",
    classes: [8, 9, 10, 11],
    subjectLevels: [
      { subject: "physics", level: 3 },
      { subject: "math", level: 3 },
    ],
    status: "confirmed",
  },
  {
    id: "codeforces",
    name: "Олимпиада Codeforces",
    organizer: "Codeforces",
    description: "Онлайн-олимпиада по программированию, проводимая популярной платформой Codeforces.",
    officialWebsiteUrl: "https://codeforces.com/",
    classes: [9, 10, 11],
    subjectLevels: [
      { subject: "informatics", level: 3 },
    ],
    status: "draft",
  },
  {
    id: "informatics_camp",
    name: "Олимпиада в рамках летней школы по информатике",
    organizer: "ЛКШ",
    description: "Олимпиада, проводимая в рамках летней компьютерной школы, уровень задач высокий.",
    officialWebsiteUrl: "https://neerc.ifmo.ru/camps/",
    classes: [7, 8, 9, 10, 11],
    subjectLevels: [
      { subject: "informatics", level: 3 },
    ],
    status: "disputed",
  },
  {
    id: "bio_olympiad",
    name: "Всероссийская олимпиада по биологии",
    organizer: "МГУ",
    description: "Олимпиада по биологии, включает как теоретический, так и практический туры.",
    officialWebsiteUrl: "https://biology.msu.ru/",
    classes: [9, 10, 11],
    subjectLevels: [
      { subject: "biology", level: 4 },
    ],
    status: "confirmed",
  },
  {
    id: "chem_olympiad",
    name: "Всероссийская олимпиада по химии",
    organizer: "МГУ",
    description: "Классическая олимпиада по химии, проводится в несколько этапов.",
    officialWebsiteUrl: "https://chemistry.msu.ru/",
    classes: [9, 10, 11],
    subjectLevels: [
      { subject: "chemistry", level: 4 },
    ],
    status: "confirmed",
  },
  {
    id: "physics_olympiad",
    name: "Всероссийская олимпиада по физике",
    organizer: "МГУ",
    description: "Одна из старейших олимпиад в России, важна для поступления на физические направления.",
    officialWebsiteUrl: "https://physics.msu.ru/",
    classes: [9, 10, 11],
    subjectLevels: [
      { subject: "physics", level: 4 },
    ],
    status: "confirmed",
  },
  {
    id: "math_vseross",
    name: "Всероссийская олимпиада по математике (младшие классы)",
    organizer: "МЦНМО",
    description: "Олимпиада для учащихся 7-9 классов, служит подготовкой к более высоким этапам.",
    officialWebsiteUrl: "https://www.mccme.ru/",
    classes: [7, 8, 9],
    subjectLevels: [
      { subject: "math", level: 2 },
    ],
    status: "confirmed",
  },
];

export const OLYMPIAD_MAP = Object.fromEntries(OLYMPIADS.map(o => [o.id, o])) as Record<string, Olympiad>;
