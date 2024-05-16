import React, { useCallback } from 'react';
import { FlaggedItemList, ScreenBackground } from '../../components';
import type { FlaggedPendingScreenProps } from '../../navigation';
import { FlaggedItem } from '../../model';

export default function FlaggedPendingScreen({
  navigation,
}: FlaggedPendingScreenProps) {
  const onItemPress = useCallback((flaggedItem: FlaggedItem) => {
    const { category, id } = flaggedItem;

    if (category === 'Ballot') {
      navigation.navigate('VoteStack', {
        screen: 'Ballot', initial: false, params: { ballotId: id },
      });
    } else if (category === 'Post') {
      navigation.navigate('DiscussStack', {
        screen: 'Post', initial: false, params: { postId: id },
      });
    } else {
      console.log({ flaggedItem });
    }
  }, [navigation]);

  return (
    <ScreenBackground>
      <FlaggedItemList onItemPress={onItemPress} />
    </ScreenBackground>
  );
}
