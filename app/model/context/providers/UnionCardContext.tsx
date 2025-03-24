import React, {
  PropsWithChildren, createContext, useContext, useMemo, useState,
} from 'react';
import { UnionCard } from '../../../networking';

type CacheableUnionCard = UnionCard
  | Partial<Omit<UnionCard, 'signedAt' | 'signatureBytes'>>;

type UnionCardContextType = {
  cacheUnionCard: (unionCard: CacheableUnionCard) => void;
  clearCachedUnionCard: () => void;
  getCachedUnionCard: () => CacheableUnionCard | undefined;
};

const UnionCardContext = createContext<UnionCardContextType>({
  cacheUnionCard: () => {},
  clearCachedUnionCard: () => {},
  getCachedUnionCard: () => undefined,
});

export function UnionCardContextProvider({
  children,
}: PropsWithChildren<{}>) {
  const [unionCard, setUnionCard] = useState<CacheableUnionCard | undefined>();

  const unionCardContext = useMemo<UnionCardContextType>(() => ({
    cacheUnionCard: setUnionCard,
    clearCachedUnionCard: () => setUnionCard(undefined),
    getCachedUnionCard: () => unionCard,
  }), [unionCard]);

  return (
    <UnionCardContext.Provider value={unionCardContext}>
      {children}
    </UnionCardContext.Provider>
  );
}

export const useUnionCardContext = () => useContext(UnionCardContext);
