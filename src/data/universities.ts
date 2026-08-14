import { UNIVERSITY_ACCENTS } from "./constants";
import { type University } from "./types";

export const UNIVERSITIES: Record<string, University> = {
  msu: {
    id: "msu",
    slug: "msu",
    name: "Московский государственный университет имени М. В. Ломоносова",
    shortName: "МГУ",
    city: "Москва",
    description: "Один из старейших и крупнейших университетов России, ведущий вуз страны с богатой историей и традициями.",
    accent: "red",
    websiteUrl: "https://www.msu.ru/",
  },
  mipt: {
    id: "mipt",
    slug: "mipt",
    name: "Московский физико-технический институт (государственный университет)",
    shortName: "МФТИ",
    city: "Москва / Долгопрудный",
    description: "Ведущий технический вуз России, известный своими школами по физике, математике и информатике.",
    accent: "blue",
    websiteUrl: "https://mipt.ru/",
  },
  hse: {
    id: "hse",
    slug: "hse",
    name: "Национальный исследовательский университет «Высшая школа экономики»",
    shortName: "НИУ ВШЭ",
    city: "Москва",
    description: "Университет с современной образовательной моделью, сильной экономической и социологической направленностью.",
    accent: "green",
    websiteUrl: "https://www.hse.ru/",
  },
  spbu: {
    id: "spbu",
    slug: "spbu",
    name: "Санкт-Петербургский государственный университет",
    shortName: "СПбГУ",
    city: "Санкт-Петербург",
    description: "Первый университет России, один из ведущих вузов страны с сильной научной и образовательной базой.",
    accent: "purple",
    websiteUrl: "https://spbu.ru/",
  },
  itmo: {
    id: "itmo",
    slug: "itmo",
    name: "Университет ИТМО",
    shortName: "ИТМО",
    city: "Санкт-Петербург",
    description: "Технологический университет, лидер в области информационных технологий, фотоники и робототехники.",
    accent: "amber",
    websiteUrl: "https://itmo.ru/",
  },
  bauman: {
    id: "bauman",
    slug: "bauman",
    name: "Московский государственный технический университет им. Н. Э. Баумана",
    shortName: "МГТУ им. Баумана",
    city: "Москва",
    description: "Крупнейший технический университет России, подготовка специалистов в области машиностроения и IT.",
    accent: "blue",
    websiteUrl: "https://bmstu.ru/",
  },
};

// для удобства — цвета по акцентам
export const UNIVERSITY_COLORS = Object.fromEntries(
  Object.entries(UNIVERSITIES).map(([id, u]) => [id, UNIVERSITY_ACCENTS[u.accent]])
) as Record<string, typeof UNIVERSITY_ACCENTS[keyof typeof UNIVERSITY_ACCENTS]>;
