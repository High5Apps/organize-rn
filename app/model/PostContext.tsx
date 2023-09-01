import React, {
  PropsWithChildren, createContext, useContext, useMemo,
} from 'react';
import { Post } from './types';
import usePostCache from './PostCache';

type PostContextType = {
  cachePosts: (posts?: Post[]) => void;
  getCachedPost: (postId: string) => Post | undefined;
};

const PostContext = createContext<PostContextType>({
  cachePosts: () => {},
  getCachedPost: () => undefined,
});

export function PostContextProvider({ children }: PropsWithChildren<{}>) {
  const { cachePosts, getCachedPost } = usePostCache();

  const postContext = useMemo<PostContextType>(() => ({
    cachePosts, getCachedPost,
  }), [cachePosts, getCachedPost]);

  return (
    <PostContext.Provider value={postContext}>
      {children}
    </PostContext.Provider>
  );
}

export const usePostContext = () => useContext(PostContext);
