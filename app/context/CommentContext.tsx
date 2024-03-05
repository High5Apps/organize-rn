import React, {
  PropsWithChildren, createContext, useContext, useMemo,
} from 'react';
import type { Comment } from '../model';
import useModelCache from '../model/ModelCache';

type CommentContextType = {
  cacheComment: (comment: Comment) => void;
  cacheComments: (comments?: Comment[]) => void;
  getCachedComment: (commentId?: string) => Comment | undefined;
};

const CommentContext = createContext<CommentContextType>({
  cacheComment: () => {},
  cacheComments: () => {},
  getCachedComment: () => undefined,
});

export function CommentContextProvider({ children }: PropsWithChildren<{}>) {
  const {
    cacheModel: cacheComment,
    cacheModels: cacheComments,
    getCachedModel: getCachedComment,
  } = useModelCache<Comment>();

  const commentContext = useMemo<CommentContextType>(() => ({
    cacheComment, cacheComments, getCachedComment,
  }), [cacheComment, cacheComments, getCachedComment]);

  return (
    <CommentContext.Provider value={commentContext}>
      {children}
    </CommentContext.Provider>
  );
}

export const useCommentContext = () => useContext(CommentContext);
