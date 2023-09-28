import { useState } from 'react';

export default function useCachedValueCache() {
  const [cache, setCache] = useState<Map<string, any>>(new Map());

  function getCachedValue(key: string): any {
    return cache.get(key);
  }

  function setCachedValue(key: string, value: any) {
    setCache((c) => {
      const entry = [key, value] as const;
      const cachedEntries = [...c.entries()];
      return new Map<string, any>([...cachedEntries, entry]);
    });
  }

  return { getCachedValue, setCachedValue };
}
