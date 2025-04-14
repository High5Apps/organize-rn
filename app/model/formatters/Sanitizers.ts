export function sanitizeMultilineField(s: string | undefined) {
  // Convert empty string to undefined
  if (!s?.length) { return undefined; }

  // Strip whitespace from ends
  return s.trim();
}

export function sanitizeSingleLineField(s: string | undefined) {
  // Convert empty string to undefined
  if (!s?.length) { return undefined; }

  // Replace any whitespace with a single space, then strip whitespace from ends
  return s.replace(/\s/g, ' ').trim();
}
