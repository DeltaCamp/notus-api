export function beginsWithVowel(value: string): boolean {
  const firstLetter = value.charAt(0)
  return /[aeiou]/i.test(firstLetter)
}