import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { ReactTestRenderer, act, create } from 'react-test-renderer';
import useCommentCache from '../../app/model/CommentCache';
import { getFakeComment } from '../FakeData';
import type { Comment } from '../../app/model';

type Props = {
  commentToUpdate?: Comment;
  comments: Comment[];
  commentsToUpdate?: Comment[];
};

const commentToId = (comment: Comment) => comment.id;

function TestComponent({ commentToUpdate, comments, commentsToUpdate }: Props) {
  const { cacheComment, cacheComments, getCachedComment } = useCommentCache();
  const [
    commentIds, setCommentIds,
  ] = useState<string[]>(comments.map(commentToId));

  useEffect(() => {
    cacheComments(comments);

    if (commentToUpdate) {
      cacheComment(commentToUpdate);
      const updatedCommentIds = [...commentIds, commentToId(commentToUpdate)];
      const deduplicatedCommentIds = [...new Set(updatedCommentIds)];
      setCommentIds(deduplicatedCommentIds);
    }

    if (commentsToUpdate !== undefined) {
      cacheComments(commentsToUpdate);
      const updatedCommentIds = [
        ...commentIds, ...commentsToUpdate.map(commentToId),
      ];
      const deduplicatedCommentIds = [...new Set(updatedCommentIds)];
      setCommentIds(deduplicatedCommentIds);
    }
  }, []);

  return (
    <View>
      { commentIds.map((id) => (
        <Text key={id} testID={id}>{getCachedComment(id)?.score}</Text>
      ))}
    </View>
  );
}

TestComponent.defaultProps = {
  commentToUpdate: undefined,
  commentsToUpdate: undefined,
};

async function renderTestComponent({
  commentToUpdate, comments, commentsToUpdate,
}: Props) {
  let renderer: ReactTestRenderer | undefined;
  await act(async () => {
    renderer = create((
      <TestComponent
        commentToUpdate={commentToUpdate}
        comments={comments}
        commentsToUpdate={commentsToUpdate}
      />
    ));
  });
  const root = renderer?.root;
  return { root };
}

describe('useCommentCache', () => {
  const comments = ['0', '1', '2'].map((commentId) => getFakeComment(commentId, 0));
  const commentToUpdate = {
    ...comments[1],
    score: 1,
  };
  const commentsToUpdate = ['3', '4', '5'].map(
    (commentId) => getFakeComment(commentId, 0),
  );

  it('should contain initially cached comments', async () => {
    const { root } = await renderTestComponent({ comments });
    comments.forEach(({ id }) => {
      const testID = id;
      const text = root?.findByProps({ testID }).props.children;
      expect(text).toBe(0);
    });
  });

  it('caching new comments should not erase old comments', async () => {
    const allComments = [...comments, ...commentsToUpdate];

    const { root } = await renderTestComponent({ comments, commentsToUpdate });
    allComments.forEach(({ id }) => {
      const testID = id;
      const text = root?.findByProps({ testID }).props.children;
      expect(text).toBe(0);
    });
  });

  it('should update previously cached comments', async () => {
    const { root } = await renderTestComponent({ commentToUpdate, comments });
    comments.forEach(({ id }) => {
      const testID = id;
      const text = root?.findByProps({ testID }).props.children;
      const expectedScore = (testID === commentToUpdate.id) ? 1 : 0;
      expect(text).toBe(expectedScore);
    });
  });
});
