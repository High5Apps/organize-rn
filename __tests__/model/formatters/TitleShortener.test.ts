import getShortenedTitles from '../../../app/model/formatters/TitleShortener';
import {
  SINGLE_CHARACTER_ELIPSIS,
} from '../../../app/model/formatters/TruncateText';

const E = SINGLE_CHARACTER_ELIPSIS;

describe('getShortenedTitles', () => {
  it.each([
    [undefined, []],
    [['Yes', 'No'], ['Yes', 'No']],
    [['aaaaa', 'bbbbb', 'ccccc'], ['aaaaa', 'bbbbb', 'ccccc']],
    [['aaaaaa', 'aaaaab', 'aaaaac'], [`a${E}a`, `a${E}b`, `a${E}c`]],
    [['aaaaaaa', 'aaaaaba', 'aaaaaca'], [`a${E}aa`, `a${E}ba`, `a${E}ca`]],
    [
      ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
    ],
    [['Creative Goose', 'Successful Lynx', 'Marvelous Swan'], ['C', 'S', 'M']],
    [['Creative Goose', 'Creative Lynx', 'Marvelous Swan'], ['CG', 'CL', 'MS']],
    [['Creative', 'Creative Lynx', 'Marvelous Swan'], ['C', 'CL', 'MS']],
    [['aa bb cc', 'aa cc bb', 'aa bb bb'], ['ABC', 'ACB', 'ABB']],
    [['aaaaabaaa', 'aaaaacaaa'], ['aaaaa', 'aaaaa']],
    [['😤😰🕰️ 😤', '😤😂🕰️ 🥶'], ['😤😰', '😤😂']],
    [['😤😰🕰️ 😤', '😤😰🕰️ 🥶'], ['😤😤', '😤🥶']],
    [['😤😰🕰️😤😤', '😤😰🕰️🥶🥶'], [`😤${E}😤`, `😤${E}🥶`]],

    // This will fail until RN gets Intl.segmenter support
    // https://stackoverflow.com/a/71619350/2421313
    // [['🧑‍🚒😤😰🕰️', '👮😤😰🕰️'], ['🧑‍🚒', '👮']],
  ])('shortens correctly: %p -> %p', (titles, expectedShortenedTitles) => {
    const shortenedTitles = getShortenedTitles(titles);
    expect(shortenedTitles).toEqual(expectedShortenedTitles);
  });
});
