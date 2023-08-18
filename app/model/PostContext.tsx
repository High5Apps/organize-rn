import React, {
  PropsWithChildren, createContext, useContext, useMemo,
} from 'react';
import { Post } from './types';
import usePostData from './PostData';

type PostContextType = {
  fetchNextNewerPosts: () => Promise<void>;
  fetchNextOlderPosts: () => Promise<void>;
  getCachedPost: (postId: string) => Post | undefined;
  posts: Post[];
  reachedOldest: boolean;
  ready: boolean;
};

const PostContext = createContext<PostContextType>({
  fetchNextNewerPosts: async () => {},
  fetchNextOlderPosts: async () => {},
  getCachedPost: () => undefined,
  posts: [],
  reachedOldest: false,
  ready: false,
});

export function PostContextProvider({ children }: PropsWithChildren<{}>) {
  const {
    fetchNextNewerPosts, fetchNextOlderPosts, getCachedPost, posts,
    reachedOldest, ready,
  } = usePostData();

  const postContext = useMemo<PostContextType>(() => ({
    fetchNextNewerPosts,
    fetchNextOlderPosts,
    getCachedPost,
    posts,
    reachedOldest,
    ready,
  }), [
    fetchNextNewerPosts, fetchNextOlderPosts, getCachedPost, posts,
    reachedOldest, ready,
  ]);

  return (
    <PostContext.Provider value={postContext}>
      {children}
    </PostContext.Provider>
  );
}

export const usePostContext = () => useContext(PostContext);
