import { useState } from 'react';
import { Post } from './types';

const postToEntry = (post: Post) => [post.id, post] as const;
const postsToMap = (posts: Post[]) => new Map(posts.map(postToEntry));

export default function usePostCache() {
  const [postCache, setPostCache] = useState<Map<string, Post>>(new Map());

  function getCachedPost(postId: string) {
    return postCache.get(postId);
  }

  function cachePosts(posts?: Post[]) {
    if (posts === undefined) { return; }

    setPostCache((pc) => {
      const cachedPosts = [...pc.values()];
      return postsToMap([...cachedPosts, ...posts]);
    });
  }

  function cachePost(post: Post) {
    cachePosts([post]);
  }

  return { cachePost, cachePosts, getCachedPost };
}
