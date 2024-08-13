import React, {
  PropsWithChildren, createContext, useContext, useMemo,
} from 'react';
import type { BallotPreview } from '../types';
import useModelCache from '../ModelCache';

type BallotPreviewContextType = {
  cacheBallotPreview: (ballotPreview: BallotPreview) => void;
  cacheBallotPreviews: (ballotPreviews?: BallotPreview[]) => void;
  getCachedBallotPreview: (id?: string) => BallotPreview | undefined;
};

const BallotPreviewContext = createContext<BallotPreviewContextType>({
  cacheBallotPreview: () => {},
  cacheBallotPreviews: () => {},
  getCachedBallotPreview: () => undefined,
});

export function BallotPreviewContextProvider({
  children,
}: PropsWithChildren<{}>) {
  const {
    cacheModel: cacheBallotPreview,
    cacheModels: cacheBallotPreviews,
    getCachedModel: getCachedBallotPreview,
  } = useModelCache<BallotPreview>();

  const ballotPreviewContext = useMemo<BallotPreviewContextType>(() => ({
    cacheBallotPreview, cacheBallotPreviews, getCachedBallotPreview,
  }), [cacheBallotPreview, cacheBallotPreviews, getCachedBallotPreview]);

  return (
    <BallotPreviewContext.Provider value={ballotPreviewContext}>
      {children}
    </BallotPreviewContext.Provider>
  );
}

export const useBallotPreviewContext = () => useContext(BallotPreviewContext);
