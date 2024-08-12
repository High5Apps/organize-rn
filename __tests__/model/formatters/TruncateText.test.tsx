import truncateText, {
  SINGLE_CHARACTER_ELIPSIS,
} from '../../../app/model/formatters/TruncateText';

const text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
const textLength = text.length;

describe('truncateText', () => {
  describe.each([
    { maxLength: textLength + 1 },
    { maxLength: textLength + 50 },
    { maxLength: textLength + 100 },
  ])(
    'when text is shorter than maxLength, with maxLength $maxLength',
    ({ maxLength }) => {
      it('should return the input', () => {
        const result = truncateText({ maxLength, text });
        expect(result).toBe(text);
      });
    },
  );

  it('should return the input when length equals maxLength', () => {
    const maxLength = textLength;
    const result = truncateText({ maxLength, text });
    expect(result).toBe(text);
  });

  describe.each([
    { maxLength: textLength - 1 },
    { maxLength: textLength - 50 },
    { maxLength: textLength - 100 },
  ])(
    'when text is longer than maxLength, with maxLength $maxLength',
    ({ maxLength }) => {
      const result = truncateText({ maxLength, text });

      it('should return a string with a length of maxLength', () => {
        expect(result).toHaveLength(maxLength);
      });

      it('should return a string whose prefix is the same as the input', () => {
        const resultWithoutElipsis = result.slice(0, maxLength - 1);
        const hasPrefix = text.startsWith(resultWithoutElipsis);
        expect(hasPrefix).toBe(true);
      });

      it('should return a string that ends with an elipsis', () => {
        const hasSuffix = result.endsWith(SINGLE_CHARACTER_ELIPSIS);
        expect(hasSuffix).toBe(true);
      });
    },
  );
});
