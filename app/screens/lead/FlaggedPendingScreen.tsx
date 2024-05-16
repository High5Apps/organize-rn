import React, { useCallback } from 'react';
import { FlagReportList, ScreenBackground } from '../../components';
import type { FlaggedPendingScreenProps } from '../../navigation';
import { FlagReport } from '../../model';

export default function FlaggedPendingScreen({
  navigation,
}: FlaggedPendingScreenProps) {
  const onItemPress = useCallback((flag: FlagReport) => {
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
      <FlagReportList onItemPress={onItemPress} />
    </ScreenBackground>
  );
}
