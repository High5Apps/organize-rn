import React, { useCallback } from 'react';
import TextButton from './TextButton';
import type {
  VoteStackParamList, VoteStackScreenProps,
} from '../../navigation';

type Props = {
  postId?: string | null;
};

export default function useDiscussButton<T extends keyof VoteStackParamList>(
  navigation: VoteStackScreenProps<T>['navigation'],
) {
  const onDiscussPressed = useCallback((postId: string) => (
    navigation.navigate('DiscussStack', {
      screen: 'Post', initial: false, params: { postId },
    })), [navigation]);

  const DiscussButton = useCallback(({ postId }: Props) => {
    if (!postId) { return null; }
    return (
      <TextButton onPress={() => onDiscussPressed(postId)}>Discuss</TextButton>
    );
  }, [navigation]);

  return DiscussButton;
}

export type DiscussButtonType = ReturnType<typeof useDiscussButton>;
