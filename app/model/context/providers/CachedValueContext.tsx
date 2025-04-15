import React, {
  PropsWithChildren, createContext, useContext, useMemo,
} from 'react';
import { useCachedValueCache } from './caches';

type CachedValueContextType = {
  clearCachedValues: () => void;
  getCachedValue: (key: string) => any;
  setCachedValue: (key: string, value: any) => void;
};

const CachedValueContext = createContext<CachedValueContextType>({
  clearCachedValues: () => {},
  getCachedValue: () => undefined,
  setCachedValue: () => {},
});

export function CachedValueContextProvider({ children }: PropsWithChildren<{}>) {
  const {
    clearCachedValues, getCachedValue, setCachedValue,
  } = useCachedValueCache();

  const cachedValueContext = useMemo<CachedValueContextType>(() => ({
    clearCachedValues, getCachedValue, setCachedValue,
  }), [clearCachedValues, getCachedValue, setCachedValue]);

  return (
    <CachedValueContext.Provider value={cachedValueContext}>
      {children}
    </CachedValueContext.Provider>
  );
}

export const useCachedValueContext = () => useContext(CachedValueContext);
