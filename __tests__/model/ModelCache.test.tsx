import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { ReactTestRenderer, act, create } from 'react-test-renderer';
import useModelCache from '../../app/model/ModelCache';
import { getFakePost } from '../FakeData';
import { Post } from '../../app/model';

type Props = {
  postToUpdate?: Post;
  posts: Post[];
  postsToUpdate?: Post[];
};

const postToId = (post: Post) => post.id;

function TestComponent({ postToUpdate, posts, postsToUpdate }: Props) {
  const {
    cacheModel: cachePost,
    cacheModels: cachePosts,
    getCachedModel: getCachedPost,
  } = useModelCache<Post>();
  const [postIds, setPostIds] = useState<string[]>(posts.map(postToId));

  useEffect(() => {
    cachePosts(posts);

    if (postToUpdate) {
      cachePost(postToUpdate);
      const updatedPostIds = [...postIds, postToId(postToUpdate)];
      const deduplicatedPostIds = [...new Set(updatedPostIds)];
      setPostIds(deduplicatedPostIds);
    }

    if (postsToUpdate !== undefined) {
      cachePosts(postsToUpdate);
      const updatedPostIds = [...postIds, ...postsToUpdate.map(postToId)];
      const deduplicatedPostIds = [...new Set(updatedPostIds)];
      setPostIds(deduplicatedPostIds);
    }
  }, []);

  return (
    <View>
      { postIds.map((id) => (
        <Text key={id} testID={id}>{getCachedPost(id)?.score}</Text>
      ))}
    </View>
  );
}

TestComponent.defaultProps = {
  postToUpdate: undefined,
  postsToUpdate: undefined,
};

async function renderTestComponent({ postToUpdate, posts, postsToUpdate }: Props) {
  let renderer: ReactTestRenderer | undefined;
  await act(async () => {
    renderer = create((
      <TestComponent
        postToUpdate={postToUpdate}
        posts={posts}
        postsToUpdate={postsToUpdate}
      />
    ));
  });
  const root = renderer?.root;
  return { root };
}

describe('usePostCache', () => {
  const posts = ['0', '1', '2'].map((postId) => getFakePost(postId, 0));
  const postToUpdate = {
    ...posts[1],
    score: 1,
  };
  const postsToUpdate = ['3', '4', '5'].map((postId) => getFakePost(postId, 0));

  it('should contain initially cached posts', async () => {
    const { root } = await renderTestComponent({ posts });
    posts.forEach(({ id }) => {
      const testID = id;
      const text = root?.findByProps({ testID }).props.children;
      expect(text).toBe(0);
    });
  });

  it('caching new posts should not erase old posts', async () => {
    const allPosts = [...posts, ...postsToUpdate];

    const { root } = await renderTestComponent({ posts, postsToUpdate });
    allPosts.forEach(({ id }) => {
      const testID = id;
      const text = root?.findByProps({ testID }).props.children;
      expect(text).toBe(0);
    });
  });

  it('should update previously cached posts', async () => {
    const { root } = await renderTestComponent({ postToUpdate, posts });
    posts.forEach(({ id }) => {
      const testID = id;
      const text = root?.findByProps({ testID }).props.children;
      const expectedScore = (testID === postToUpdate.id) ? 1 : 0;
      expect(text).toBe(expectedScore);
    });
  });
});
