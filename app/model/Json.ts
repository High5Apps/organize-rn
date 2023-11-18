const ISO_8601_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

function replacer(_: string, value: any) {
  return (value instanceof Date) ? value.toISOString() : value;
}

export function toJson(value: any, space?: number) {
  return JSON.stringify(value, replacer, space);
}

export function snakeToCamel(s: string): string {
  return s.replace(/([_][a-z])/gi, (c) => c.toUpperCase().replace(/[_]/g, ''));
}

type Options = {
  convertIso8601ToDate?: boolean;
  convertSnakeToCamel?: boolean;
};

export function fromJson(text: string, options: Options = {}): any {
  const { convertIso8601ToDate, convertSnakeToCamel } = options;
  return JSON.parse(text, function reviver(key: string, value: any) {
    let newValue = value;
    const shouldConvertIso8601ToDate = (
      convertIso8601ToDate
        && typeof value === 'string'
        && ISO_8601_REGEX.test(value)
    );

    if (shouldConvertIso8601ToDate) {
      newValue = new Date(value);
    }

    if (convertSnakeToCamel && /_/.test(key)) {
      const camelCaseKey = snakeToCamel(key);
      this[camelCaseKey] = newValue;

      // Returning undefined removes the key
      newValue = undefined;
    }

    return newValue;
  });
}
