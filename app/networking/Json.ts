const ISO_8601_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

// https://stackoverflow.com/a/54246501/2421313
export function camelToSnake(s: string): string {
  return s.replace(/[A-Z]/g, (character) => `_${character.toLowerCase()}`);
}

export function snakeToCamel(s: string): string {
  return s.replace(/([_][a-z])/gi, (c) => c.toUpperCase().replace(/[_]/g, ''));
}

type FromOptions = {
  convertSnakeToCamel?: boolean;
  convertIso8601ToDate?: boolean;
};

export function fromJson(text: string, options: FromOptions = {}): any {
  const { convertIso8601ToDate, convertSnakeToCamel } = options;
  try {
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
  } catch (error) {
    console.error(error);
    return {};
  }
}

// https://stackoverflow.com/a/75927783/2421313
// https://stackoverflow.com/a/72245429/2421313
function transformKeys(
  item: unknown,
  transform: (s: string) => string,
): unknown {
  if (Array.isArray(item)) {
    return item.map((el: unknown) => transformKeys(el, transform));
  }
  if (typeof item === 'function' || item !== Object(item) || item instanceof Date) {
    return item;
  }
  return Object.fromEntries(
    Object.entries(item as Record<string, unknown>).map(
      ([key, value]: [string, unknown]) => [
        transform(key),
        transformKeys(value, transform),
      ],
    ),
  );
}

type ToOptions = {
  convertCamelToSnake?: boolean;
  space?: number;
};

export function toJson(input: any, options: ToOptions = {}) {
  const { convertCamelToSnake, space } = options;

  const object = convertCamelToSnake
    ? transformKeys(input, camelToSnake) : input;

  return JSON.stringify(object, (_: string, value: any) => (
    (value instanceof Date) ? value.toISOString() : value
  ), space);
}
