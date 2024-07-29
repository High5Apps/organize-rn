import React, { useCallback } from 'react';
import type { CommentThreadScreenProps } from '../../navigation';
import { CommentThreadList, ScreenBackground } from '../../components';

export default function CommentThreadScreen({
  navigation, route,
}: CommentThreadScreenProps) {
  const { commentId } = route.params;

  const onViewPostPressed = useCallback((postId: string) => {
    navigation.navigate('Post', { postId });
  }, []);

  return (
    <ScreenBackground>
      <CommentThreadList
        commentId={commentId}
        onViewPostPressed={onViewPostPressed}
      />
    </ScreenBackground>
  );
}
