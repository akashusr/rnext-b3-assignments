import "server-only";

const dictionaries = {
  en: () => import("@/data/en.json").then(module => module.default),
  bn: () => import("@/data/bn.json").then(module => module.default)
};

export const getDictionary = async locale => dictionaries[locale]();
