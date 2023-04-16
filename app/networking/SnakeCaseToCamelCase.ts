// https://stackoverflow.com/a/65642944/2421313
type SnakeToCamelCase<S extends string> = (
  S extends `${infer T}_${infer U}` ?
  `${T}${Capitalize<SnakeToCamelCase<U>>}` : S
);

export type SnakeToCamelCaseNested<T> = T extends object ? {
  [K in keyof T as SnakeToCamelCase<K & string>]: SnakeToCamelCaseNested<T[K]>
} : T;

export function snakeToCamel(s: string): string {
  return s.replace(/([_][a-z])/gi, (c) => c.toUpperCase().replace(/[_]/g, ''));
}

// https://stackoverflow.com/a/75927783/2421313
export function recursiveSnakeToCamel(item: unknown): unknown {
  if (Array.isArray(item)) {
    return item.map((el: unknown) => recursiveSnakeToCamel(el));
  }

  if (typeof item === 'function' || item !== Object(item)) {
    return item;
  }

  return Object.fromEntries(
    Object.entries(item as Record<string, unknown>).map(
      ([key, value]: [string, unknown]) => [
        snakeToCamel(key),
        recursiveSnakeToCamel(value),
      ],
    ),
  );
}
