import React, {
  PropsWithChildren, createContext, useContext, useMemo,
} from 'react';
import type { Post } from '../model';
import useModelCache from '../model/ModelCache';
// BUG: Export the simpler types so you don't need to use Omit/Required below
import type { IndexProps, IndexReturn } from '../networking/PostAPI';

type PostContextType = {
  cachePost: (post: Post) => void;
  cachePosts: (posts?: Post[]) => void;
  getCachedPost: (postId?: string) => Post | undefined;
  getCachedPosts: (
    props: Omit<IndexProps, 'createdAtOrBefore' | 'e2eDecryptMany'>
  ) => Required<Omit<IndexReturn, 'errorMessage'>>;
};

const PostContext = createContext<PostContextType>({
  cachePost: () => {},
  cachePosts: () => {},
  getCachedPost: () => undefined,
  getCachedPosts: ({ page }) => ({
    paginationData: { currentPage: page ?? 1, nextPage: null }, posts: [],
  }),
});

// BUG: Note that in prod this should be the same as backend size. Probably
// would pass the pageSize as a param in the backend fetch
const pageSize = 20;

export function PostContextProvider({ children }: PropsWithChildren<{}>) {
  const {
    cacheModel: cachePost,
    cacheModels: cachePosts,
    getCachedModel: getCachedPost,
    getCachedModels,
  } = useModelCache<Post>();

  function getCachedPosts({
    category, page: maybeNextPageNumber, sort,
  }: Omit<IndexProps, 'createdAtOrBefore' | 'e2eDecryptMany'>): Required<Omit<IndexReturn, 'errorMessage'>> {
    const nextPageNumber = maybeNextPageNumber ?? 1;
    const cachedPosts = getCachedModels()
      .filter((post) => (category ? (post.category === category) : true))
      .sort((a, b) => {
        if (sort === 'new') {
          return b.createdAt.getTime() - a.createdAt.getTime();
        }

        if (sort === 'old') {
          return a.createdAt.getTime() - b.createdAt.getTime();
        }

        // BUG: Comparison for top is also used for hot here for simplicity
        return b.score - a.score;
      });
    const cachedPostsPage = cachedPosts
      .slice((nextPageNumber - 1) * pageSize, nextPageNumber * pageSize);
    const nextCachePage = cachedPosts.length >= nextPageNumber * pageSize
      ? nextPageNumber : null;
    return {
      posts: cachedPostsPage,
      paginationData: {
        currentPage: nextPageNumber,
        nextPage: nextCachePage,
      },
    };
  }

  const postContext = useMemo<PostContextType>(() => ({
    cachePost, cachePosts, getCachedPost, getCachedPosts,
  }), [cachePost, cachePosts, getCachedPost, getCachedPosts]);

  return (
    <PostContext.Provider value={postContext}>
      {children}
    </PostContext.Provider>
  );
}

export const usePostContext = () => useContext(PostContext);
