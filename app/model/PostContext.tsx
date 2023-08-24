import React, {
  PropsWithChildren, createContext, useContext, useMemo,
} from 'react';
import { Post } from './types';
import usePosts from './Posts';

type PostContextType = {
  fetchNewestPosts: () => Promise<void>;
  fetchNextNewerPosts: () => Promise<void>;
  fetchNextOlderPosts: () => Promise<void>;
  getCachedPost: (postId: string) => Post | undefined;
  posts: Post[];
  reachedOldest: boolean;
  ready: boolean;
};

const PostContext = createContext<PostContextType>({
  fetchNewestPosts: async () => {},
  fetchNextNewerPosts: async () => {},
  fetchNextOlderPosts: async () => {},
  getCachedPost: () => undefined,
  posts: [],
  reachedOldest: false,
  ready: false,
});

export function PostContextProvider({ children }: PropsWithChildren<{}>) {
  const {
    fetchNewestPosts, fetchNextNewerPosts, fetchNextOlderPosts, getCachedPost,
    posts, reachedOldest, ready,
  } = usePosts();

  const postContext = useMemo<PostContextType>(() => ({
    fetchNewestPosts,
    fetchNextNewerPosts,
    fetchNextOlderPosts,
    getCachedPost,
    posts,
    reachedOldest,
    ready,
  }), [
    fetchNewestPosts, fetchNextNewerPosts, fetchNextOlderPosts, getCachedPost,
    posts, reachedOldest, ready,
  ]);

  return (
    <PostContext.Provider value={postContext}>
      {children}
    </PostContext.Provider>
  );
}

export const usePostContext = () => useContext(PostContext);
