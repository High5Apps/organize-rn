import React, { useCallback } from 'react';
import { ScreenBackground, TransparencyLogList } from '../../components';
import { ModerationEvent } from '../../model';
import type { TransparencyLogScreenProps } from '../../navigation';

export default function TransparencyLogScreen({
  navigation,
}: TransparencyLogScreenProps) {
  const onItemPress = useCallback((item: ModerationEvent) => {
    const { moderatable: { category, id } } = item;
    if (category === 'Ballot') {
      navigation.navigate('VoteStack', {
        screen: 'Ballot', initial: false, params: { ballotId: id },
      });
    } else if (category === 'Post') {
      navigation.navigate('DiscussStack', {
        screen: 'Post', initial: false, params: { postId: id },
      });
    } else if (category === 'User') {
      navigation.popTo('Org', { selectedUserId: id });
    } else if (category === 'Comment') {
      navigation.navigate('DiscussStack', {
        screen: 'CommentThread', initial: false, params: { commentId: id },
      });
    } else {
      console.warn('WARNING: Unexpected ModerationEvent category');
    }
  }, [navigation]);

  return (
    <ScreenBackground>
      <TransparencyLogList onItemPress={onItemPress} />
    </ScreenBackground>
  );
}
