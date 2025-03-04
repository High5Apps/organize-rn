import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { render, screen } from '@testing-library/react-native';
import useModelCache from '../../../../../app/model/context/providers/caches/ModelCache';
import { getFakePost } from '../../../../FakeData';
import { Post } from '../../../../../app/model';

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

function renderTestComponent({ postToUpdate, posts, postsToUpdate }: Props) {
  render((
    <TestComponent
      postToUpdate={postToUpdate}
      posts={posts}
      postsToUpdate={postsToUpdate}
    />
  ));
}

describe('usePostCache', () => {
  const posts = ['0', '1', '2'].map((postId) => getFakePost(postId, 0));
  const postToUpdate = {
    ...posts[1],
    score: 1,
  };
  const postsToUpdate = ['3', '4', '5'].map((postId) => getFakePost(postId, 0));

  it('should contain initially cached posts', () => {
    renderTestComponent({ posts });
    posts.forEach(({ id }) => {
      const testID = id;
      expect(screen.getByTestId(testID)).toHaveTextContent('0');
    });
  });

  it('caching new posts should not erase old posts', () => {
    const allPosts = [...posts, ...postsToUpdate];

    renderTestComponent({ posts, postsToUpdate });
    allPosts.forEach(({ id }) => {
      const testID = id;
      expect(screen.getByTestId(testID)).toHaveTextContent('0');
    });
  });

  it('should update previously cached posts', () => {
    renderTestComponent({ postToUpdate, posts });
    posts.forEach(({ id }) => {
      const testID = id;
      const expectedScore = (testID === postToUpdate.id) ? '1' : '0';
      expect(screen.getByTestId(testID)).toHaveTextContent(expectedScore);
    });
  });
});
