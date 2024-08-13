import React, {
  PropsWithChildren, createContext, useContext, useMemo,
} from 'react';
import type { Post } from '../../types';
import useModelCache from '../../ModelCache';

type PostContextType = {
  cachePost: (post: Post) => void;
  cachePosts: (posts?: Post[]) => void;
  getCachedPost: (postId?: string) => Post | undefined;
};

const PostContext = createContext<PostContextType>({
  cachePost: () => {},
  cachePosts: () => {},
  getCachedPost: () => undefined,
});

export function PostContextProvider({ children }: PropsWithChildren<{}>) {
  const {
    cacheModel: cachePost,
    cacheModels: cachePosts,
    getCachedModel: getCachedPost,
  } = useModelCache<Post>();

  const postContext = useMemo<PostContextType>(() => ({
    cachePost, cachePosts, getCachedPost,
  }), [cachePost, cachePosts, getCachedPost]);

  return (
    <PostContext.Provider value={postContext}>
      {children}
    </PostContext.Provider>
  );
}

export const usePostContext = () => useContext(PostContext);
