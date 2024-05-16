import React, {
  PropsWithChildren, createContext, useContext, useMemo,
} from 'react';
import type { Flag } from '../model';
import useModelCache from '../model/ModelCache';

type FlagContextType = {
  cacheFlag: (flags: Flag) => void;
  cacheFlags: (flags?: Flag[]) => void;
  getCachedFlag: (id?: string) => Flag | undefined;
};

const FlagContext = createContext<FlagContextType>({
  cacheFlag: () => {},
  cacheFlags: () => {},
  getCachedFlag: () => undefined,
});

export function FlagContextProvider({
  children,
}: PropsWithChildren<{}>) {
  const {
    cacheModel: cacheFlag,
    cacheModels: cacheFlags,
    getCachedModel: getCachedFlag,
  } = useModelCache<Flag>();

  const flagsContext = useMemo<FlagContextType>(() => ({
    cacheFlag, cacheFlags, getCachedFlag,
  }), [cacheFlag, cacheFlags, getCachedFlag]);

  return (
    <FlagContext.Provider value={flagsContext}>
      {children}
    </FlagContext.Provider>
  );
}

export const useFlagContext = () => useContext(FlagContext);
