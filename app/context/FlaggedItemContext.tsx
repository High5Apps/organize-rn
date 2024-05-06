import React, {
  PropsWithChildren, createContext, useContext, useMemo,
} from 'react';
import type { FlaggedItem } from '../model';
import useModelCache from '../model/ModelCache';

type FlaggedItemContextType = {
  cacheFlaggedItem: (flaggedItem: FlaggedItem) => void;
  cacheFlaggedItems: (flaggedItems?: FlaggedItem[]) => void;
  getCachedFlaggedItem: (id?: string) => FlaggedItem | undefined;
};

const FlaggedItemContext = createContext<FlaggedItemContextType>({
  cacheFlaggedItem: () => {},
  cacheFlaggedItems: () => {},
  getCachedFlaggedItem: () => undefined,
});

export function FlaggedItemContextProvider({
  children,
}: PropsWithChildren<{}>) {
  const {
    cacheModel: cacheFlaggedItem,
    cacheModels: cacheFlaggedItems,
    getCachedModel: getCachedFlaggedItem,
  } = useModelCache<FlaggedItem>();

  const flaggedItemContext = useMemo<FlaggedItemContextType>(() => ({
    cacheFlaggedItem, cacheFlaggedItems, getCachedFlaggedItem,
  }), [cacheFlaggedItem, cacheFlaggedItems, getCachedFlaggedItem]);

  return (
    <FlaggedItemContext.Provider value={flaggedItemContext}>
      {children}
    </FlaggedItemContext.Provider>
  );
}

export const useFlaggedItemContext = () => useContext(FlaggedItemContext);
