import React, {
  PropsWithChildren, createContext, useContext, useMemo,
} from 'react';
import type { Post } from '../../types';
import { useModelCache } from './caches';

type PostContextType = {
  cachePost: (post: Post) => void;
  cachePosts: (posts?: Post[]) => void;
  clearCachedPosts: () => void;
  getCachedPost: (postId?: string) => Post | undefined;
};

const PostContext = createContext<PostContextType>({
  cachePost: () => {},
  cachePosts: () => {},
  clearCachedPosts: () => {},
  getCachedPost: () => undefined,
});

export function PostContextProvider({ children }: PropsWithChildren<{}>) {
  const {
    cacheModel: cachePost,
    cacheModels: cachePosts,
    clearCachedModels: clearCachedPosts,
    getCachedModel: getCachedPost,
  } = useModelCache<Post>();

  const postContext = useMemo<PostContextType>(() => ({
    cachePost, cachePosts, clearCachedPosts, getCachedPost,
  }), [cachePost, cachePosts, clearCachedPosts, getCachedPost]);

  return (
    <PostContext.Provider value={postContext}>
      {children}
    </PostContext.Provider>
  );
}

export const usePostContext = () => useContext(PostContext);
