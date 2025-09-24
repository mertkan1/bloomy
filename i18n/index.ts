import en from './dictionaries/en.json'
import tr from './dictionaries/tr.json'

export type Locale = 'en' | 'tr'

const dictionaries: Record<Locale, Record<string, string>> = { en, tr }

export function getDictionary(locale: Locale) {
  return dictionaries[locale]
}


