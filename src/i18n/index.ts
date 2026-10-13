import en from './en.json';
import sk from './sk.json';

export const locales = ['en', 'sk'] as const;
export type Locale = (typeof locales)[number];

type Dictionary = typeof en;
const dictionaries: Record<Locale, Dictionary> = { en, sk };

type Key<T> = {
  [K in keyof T & string]: T[K] extends string ? K : `${K}.${Key<T[K]>}`;
}[keyof T & string];
export type TranslationKey = Key<Dictionary>;

function lookup(dict: unknown, key: string): string | undefined {
  const value = key.split('.').reduce<any>((node, part) => node?.[part], dict);
  return typeof value === 'string' ? value : undefined;
}

function keys(node: object, prefix = ''): string[] {
  return Object.entries(node).flatMap(([k, v]) =>
    typeof v === 'string' ? [prefix + k] : keys(v, `${prefix}${k}.`),
  );
}

// fail build on missing translation
const missing = locales.flatMap((locale) =>
  keys(en)
    .filter((key) => lookup(dictionaries[locale], key) === undefined)
    .map((key) => `${locale}: ${key}`),
);
if (missing.length) {
  throw new Error(`Missing translations:\n  ${missing.join('\n  ')}`);
}

export function useI18n(current: string | undefined) {
  const locale: Locale = locales.includes(current as Locale) ? (current as Locale) : 'en';
  const t = (key: TranslationKey, params: Record<string, string | number> = {}) =>
    lookup(dictionaries[locale], key)!.replace(/\{(\w+)\}/g, (_, name) => String(params[name]));
  return { locale, t };
}
