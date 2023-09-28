import React, {
  PropsWithChildren, createContext, useContext, useMemo,
} from 'react';
import useCachedValueCache from './CachedValueCache';

type CachedValueContextType = {
  getCachedValue: (key: string) => any;
  setCachedValue: (key: string, value: any) => void;
};

const CachedValueContext = createContext<CachedValueContextType>({
  getCachedValue: () => undefined,
  setCachedValue: () => {},
});

export function CachedValueContextProvider({ children }: PropsWithChildren<{}>) {
  const { getCachedValue, setCachedValue } = useCachedValueCache();

  const cachedValueContext = useMemo<CachedValueContextType>(() => ({
    getCachedValue, setCachedValue,
  }), [getCachedValue, setCachedValue]);

  return (
    <CachedValueContext.Provider value={cachedValueContext}>
      {children}
    </CachedValueContext.Provider>
  );
}

export const useCachedValueContext = () => useContext(CachedValueContext);
