import React, { useCallback } from 'react';
import TextButton from './TextButton';
import { Nomination } from '../../../model';
import type {
  VoteStackParamList, VoteStackScreenProps,
} from '../../../navigation';

type Props = {
  currentUserId: string;
  nomination: Nomination;
};

export default function useAnnounceButton<T extends keyof VoteStackParamList>(
  navigation: VoteStackScreenProps<T>['navigation'],
  ballotId: string,
) {
  const onAnnouncePressed = useCallback((nomination: Nomination) => {
    const { candidate } = nomination;
    if (!candidate) { return; }

    const candidateId = candidate.id;
    navigation.navigate('NewCandidacyAnnouncement', { ballotId, candidateId });
  }, [navigation, ballotId]);

  const AnnounceButton = useCallback(({ currentUserId, nomination }: Props) => {
    const { candidate, nominee } = nomination;
    if (!candidate || candidate.postId || currentUserId !== nominee.id) {
      return null;
    }
    return (
      <TextButton onPress={() => onAnnouncePressed(nomination)}>
        Announce
      </TextButton>
    );
  }, [onAnnouncePressed]);

  return AnnounceButton;
}

export type AnnounceButtonType = ReturnType<typeof useAnnounceButton>;