import React, { useCallback } from 'react';
import { FlagList, ScreenBackground } from '../../components';
import type { FlaggedPendingScreenProps } from '../../navigation';
import { Flag } from '../../model';

export default function FlaggedPendingScreen({
  navigation,
}: FlaggedPendingScreenProps) {
  const onItemPress = useCallback((flag: Flag) => {
    const { category, id } = flag;

    if (category === 'Ballot') {
      navigation.navigate('VoteStack', {
        screen: 'Ballot', initial: false, params: { ballotId: id },
      });
    } else if (category === 'Post') {
      navigation.navigate('DiscussStack', {
        screen: 'Post', initial: false, params: { postId: id },
      });
    } else {
      console.log({ flag });
    }
  }, [navigation]);

  return (
    <ScreenBackground>
      <FlagList onItemPress={onItemPress} />
    </ScreenBackground>
  );
}
