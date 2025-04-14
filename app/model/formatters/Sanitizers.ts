// eslint-disable-next-line import/prefer-default-export
export function sanitizeSingleLineField(s: string | undefined) {
  // Replace any whitespace with a single space, then strip whitespace from ends
  return s?.replace(/\s/g, ' ').trim();
}
