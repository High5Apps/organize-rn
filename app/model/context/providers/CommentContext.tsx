import React, {
  PropsWithChildren, createContext, useContext, useMemo,
} from 'react';
import type { Comment } from '../../types';
import { useModelCache } from './caches';

type CommentContextType = {
  cacheComment: (comment: Comment) => void;
  cacheComments: (comments?: Comment[]) => void;
  clearCachedComments: () => void;
  getCachedComment: (commentId?: string) => Comment | undefined;
};

const CommentContext = createContext<CommentContextType>({
  cacheComment: () => {},
  cacheComments: () => {},
  clearCachedComments: () => {},
  getCachedComment: () => undefined,
});

export function CommentContextProvider({ children }: PropsWithChildren<{}>) {
  const {
    cacheModel: cacheComment,
    cacheModels: cacheComments,
    clearCachedModels: clearCachedComments,
    getCachedModel: getCachedComment,
  } = useModelCache<Comment>();

  const commentContext = useMemo<CommentContextType>(() => ({
    cacheComment, cacheComments, clearCachedComments, getCachedComment,
  }), [cacheComment, cacheComments, clearCachedComments, getCachedComment]);

  return (
    <CommentContext.Provider value={commentContext}>
      {children}
    </CommentContext.Provider>
  );
}

export const useCommentContext = () => useContext(CommentContext);
