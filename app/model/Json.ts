const ISO_8601_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

function replacer(_: string, value: any) {
  return (value instanceof Date) ? value.toISOString() : value;
}

export function toJson(value: any, space?: number) {
  return JSON.stringify(value, replacer, space);
}

function reviver(_: string, value: any) {
  return (typeof value === 'string' && ISO_8601_REGEX.test(value))
    ? new Date(value) : value;
}

export function fromJson(text: string): any {
  return JSON.parse(text, reviver);
}
