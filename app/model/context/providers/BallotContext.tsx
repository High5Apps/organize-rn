import React, {
  PropsWithChildren, createContext, useContext, useMemo,
} from 'react';
import type { Ballot } from '../../types';
import useModelCache from '../../ModelCache';

type BallotContextType = {
  cacheBallot: (ballot: Ballot) => void;
  cacheBallots: (ballots?: Ballot[]) => void;
  getCachedBallot: (id?: string) => Ballot | undefined;
};

const BallotContext = createContext<BallotContextType>({
  cacheBallot: () => {},
  cacheBallots: () => {},
  getCachedBallot: () => undefined,
});

export function BallotContextProvider({
  children,
}: PropsWithChildren<{}>) {
  const {
    cacheModel: cacheBallot,
    cacheModels: cacheBallots,
    getCachedModel: getCachedBallot,
  } = useModelCache<Ballot>();

  const ballotContext = useMemo<BallotContextType>(() => ({
    cacheBallot, cacheBallots, getCachedBallot,
  }), [cacheBallot, cacheBallots, getCachedBallot]);

  return (
    <BallotContext.Provider value={ballotContext}>
      {children}
    </BallotContext.Provider>
  );
}

export const useBallotContext = () => useContext(BallotContext);
