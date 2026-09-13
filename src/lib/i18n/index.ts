import { en } from "./en";
import { es } from "./es";
import { zh } from "./zh";
import { ar } from "./ar";
import { fr } from "./fr";
import { pt } from "./pt";
import { ru } from "./ru";
import { de } from "./de";

export type Lang = "en" | "es" | "zh" | "ar" | "fr" | "pt" | "ru" | "de";

export interface LangMeta {
  code: Lang;
  label: string; // native name
  flag: string;
  dir: "ltr" | "rtl";
}

/** The 8 main languages supported by QFS Explorer */
export const LANGS: LangMeta[] = [
  { code: "en", label: "English", flag: "🇺🇸", dir: "ltr" },
  { code: "es", label: "Español", flag: "🇪🇸", dir: "ltr" },
  { code: "zh", label: "中文", flag: "🇨🇳", dir: "ltr" },
  { code: "ar", label: "العربية", flag: "🇸🇦", dir: "rtl" },
  { code: "fr", label: "Français", flag: "🇫🇷", dir: "ltr" },
  { code: "pt", label: "Português", flag: "🇧🇷", dir: "ltr" },
  { code: "ru", label: "Русский", flag: "🇷🇺", dir: "ltr" },
  { code: "de", label: "Deutsch", flag: "🇩🇪", dir: "ltr" },
];

export const DICTS: Record<Lang, Record<string, string>> = { en, es, zh, ar, fr, pt, ru, de };

export function isLang(v: string | null | undefined): v is Lang {
  return !!v && LANGS.some((l) => l.code === v);
}

/**
 * Translate `key` into `lang`, falling back to English and then to the raw key
 * (keys are English source strings, so untranslated keys still render sensible text).
 */
export function translate(lang: Lang, key: string): string {
  return DICTS[lang]?.[key] ?? en[key] ?? key;
}

export type TFunc = (key: string) => string;
