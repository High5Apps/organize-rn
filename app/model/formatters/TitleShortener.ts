import { SINGLE_CHARACTER_ELIPSIS } from './TruncateText';

const MAX_LENGTH = 5;

const getMaxLength = (titles: string[]) => titles.reduce(
  (accumulator, currentValue) => Math.max(accumulator, currentValue.length),
  0,
);

const allUnique = (titles: string[]) => (
  titles.length === new Set(titles).size
);

// Note that this doesn't properly handle multi-emoji graphemes like 🧑‍🚒
// To properly handle that, Intl.segmenter will need to be supported by RN
// https://retyui.github.io/react-native-compat-table/
// https://stackoverflow.com/a/71619350/2421313
const unicodeSlice = (text: string, start: number, end?: number) => (
  Array.from(text).slice(start, end).join('')
);

const getLettersFromStartAndEnd = (s: string, start: number, end?: number) => (
  `${unicodeSlice(s, 0, start)}${end ? SINGLE_CHARACTER_ELIPSIS : ''}${end ? unicodeSlice(s, -1 * end) : ''}`
);

const getUpToNInitials = (s: string, n: number) => (
  s.split(' ')
    .slice(0, n)
    .map((w) => unicodeSlice(w, 0, 1)?.toUpperCase())
    .join('')
);

export default function getShortenedTitles(titles?: string[]) {
  if (titles === undefined) { return []; }

  if (getMaxLength(titles) <= MAX_LENGTH) {
    return titles;
  }

  for (let n = 1; n <= MAX_LENGTH; n += 1) {
    const prefixes = titles.map((t) => getLettersFromStartAndEnd(t, n));
    if (allUnique(prefixes)) {
      return prefixes;
    }

    const initials = titles.map((t) => getUpToNInitials(t, n));
    if (allUnique(initials)) {
      return initials;
    }

    if (n % 2 === 0) {
      const halfN = n / 2;
      const truncatedMiddles = titles.map(
        (t) => getLettersFromStartAndEnd(t, halfN, halfN),
      );
      if (allUnique(truncatedMiddles)) {
        return truncatedMiddles;
      }
    }

    // Skip n=1 because it's covered by truncatedMiddles above
    // Stop at MAX_LENGTH - 2 to remain below MAX_LENGTH, since the first
    // character and a single-character-ellipse are both prepended
    if (n > 1 && n <= (MAX_LENGTH - 2)) {
      const suffixes = titles.map((t) => getLettersFromStartAndEnd(t, 1, n));
      if (allUnique(suffixes)) {
        return suffixes;
      }
    }
  }

  return titles.map((t) => getLettersFromStartAndEnd(t, MAX_LENGTH));
}
