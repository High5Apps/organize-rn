import React, {
  PropsWithChildren, createContext, useContext, useMemo,
} from 'react';
import type { Ballot } from '../../types';
import { useModelCache } from './caches';

type BallotContextType = {
  cacheBallot: (ballot: Ballot) => void;
  cacheBallots: (ballots?: Ballot[]) => void;
  clearCachedBallots: () => void;
  getCachedBallot: (id?: string) => Ballot | undefined;
};

const BallotContext = createContext<BallotContextType>({
  cacheBallot: () => {},
  cacheBallots: () => {},
  clearCachedBallots: () => {},
  getCachedBallot: () => undefined,
});

export function BallotContextProvider({
  children,
}: PropsWithChildren<{}>) {
  const {
    cacheModel: cacheBallot,
    cacheModels: cacheBallots,
    clearCachedModels: clearCachedBallots,
    getCachedModel: getCachedBallot,
  } = useModelCache<Ballot>();

  const ballotContext = useMemo<BallotContextType>(() => ({
    cacheBallot, cacheBallots, clearCachedBallots, getCachedBallot,
  }), [cacheBallot, cacheBallots, clearCachedBallots, getCachedBallot]);

  return (
    <BallotContext.Provider value={ballotContext}>
      {children}
    </BallotContext.Provider>
  );
}

export const useBallotContext = () => useContext(BallotContext);
