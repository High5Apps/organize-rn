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
    } else {
      console.log({ item });
    }
  }, [navigation]);

  return (
    <ScreenBackground>
      <TransparencyLogList onItemPress={onItemPress} />
    </ScreenBackground>
  );
}
