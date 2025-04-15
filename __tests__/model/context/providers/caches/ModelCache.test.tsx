import { act, renderHook } from '@testing-library/react-native';
import useModelCache
  from '../../../../../app/model/context/providers/caches/ModelCache';
import { getFakePost } from '../../../../FakeData';
import { Post } from '../../../../../app/model';

describe('usePostCache', () => {
  const posts = ['0', '1', '2'].map((postId) => getFakePost(postId, 0));
  const postToUpdate = {
    ...posts[1],
    score: 1,
  };
  const postsToUpdate = ['3', '4', '5'].map((postId) => getFakePost(postId, 0));

  it('should contain initially cached posts', () => {
    const { result } = renderHook(useModelCache<Post>);
    act(() => result.current.cacheModels(posts));
    posts.forEach(({ id }) => {
      expect(result.current.getCachedModel(id)?.score).toBe(0);
    });
  });

  it('should clear the cache', () => {
    const { result } = renderHook(useModelCache<Post>);
    act(() => result.current.cacheModels(posts));
    act(() => result.current.clearCachedModels());
    posts.forEach(({ id }) => {
      expect(result.current.getCachedModel(id)).toBeUndefined();
    });
  });

  it('caching new posts should not erase old posts', () => {
    const allPosts = [...posts, ...postsToUpdate];
    const { result } = renderHook(useModelCache<Post>);
    act(() => result.current.cacheModels(posts));
    act(() => result.current.cacheModels(postsToUpdate));
    allPosts.forEach(({ id }) => {
      expect(result.current.getCachedModel(id)?.score).toBe(0);
    });
  });

  it('should update previously cached posts', () => {
    const { result } = renderHook(useModelCache<Post>);
    act(() => result.current.cacheModels(posts));
    act(() => result.current.cacheModel(postToUpdate));
    posts.forEach(({ id }) => {
      const expectedScore = (id === postToUpdate.id) ? 1 : 0;
      expect(result.current.getCachedModel(id)?.score).toBe(expectedScore);
    });
  });
});
