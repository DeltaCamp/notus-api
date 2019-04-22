import { beginsWithVowel } from "./beginsWithVowel";

export function addArticle(noun: string, { an, a } = { an: 'an', a: 'a' }): string {
  if (!noun) { return '' }
  return beginsWithVowel(noun) ? `${an} ${noun}` : `${a} ${noun}`
}