import React, {
  PropsWithChildren, createContext, useContext, useMemo,
} from 'react';
import type { BallotPreview } from '../../types';
import { useModelCache } from './caches';

type BallotPreviewContextType = {
  cacheBallotPreview: (ballotPreview: BallotPreview) => void;
  cacheBallotPreviews: (ballotPreviews?: BallotPreview[]) => void;
  clearCachedBallotPreviews: () => void;
  getCachedBallotPreview: (id?: string) => BallotPreview | undefined;
};

const BallotPreviewContext = createContext<BallotPreviewContextType>({
  cacheBallotPreview: () => {},
  cacheBallotPreviews: () => {},
  clearCachedBallotPreviews: () => {},
  getCachedBallotPreview: () => undefined,
});

export function BallotPreviewContextProvider({
  children,
}: PropsWithChildren<{}>) {
  const {
    cacheModel: cacheBallotPreview,
    cacheModels: cacheBallotPreviews,
    clearCachedModels: clearCachedBallotPreviews,
    getCachedModel: getCachedBallotPreview,
  } = useModelCache<BallotPreview>();

  const ballotPreviewContext = useMemo<BallotPreviewContextType>(() => ({
    cacheBallotPreview,
    cacheBallotPreviews,
    clearCachedBallotPreviews,
    getCachedBallotPreview,
  }), [
    cacheBallotPreview, cacheBallotPreviews, clearCachedBallotPreviews,
    getCachedBallotPreview,
  ]);

  return (
    <BallotPreviewContext.Provider value={ballotPreviewContext}>
      {children}
    </BallotPreviewContext.Provider>
  );
}

export const useBallotPreviewContext = () => useContext(BallotPreviewContext);
