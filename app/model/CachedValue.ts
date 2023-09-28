import { useCachedValueContext } from './CachedValueContext';

export default function useCachedValue<T>(key: string) {
  const {
    getCachedValue: getUntypedCachedValue,
    setCachedValue: setUntypedCachedValue,
  } = useCachedValueContext();

  const maybeCachedValue = getUntypedCachedValue(key);
  const cachedValue: T | undefined = (maybeCachedValue !== undefined)
    ? maybeCachedValue : undefined;

  function setCachedValue(value: T) {
    setUntypedCachedValue(key, value);
  }

  return [cachedValue, setCachedValue] as const;
}
