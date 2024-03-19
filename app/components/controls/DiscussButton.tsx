import React, { useCallback } from 'react';
import { NavigationProp } from '@react-navigation/native';
import TextButton from './TextButton';

type Props = {
  postId?: string | null;
};

export default function useDiscussButton(navigation: NavigationProp<any>) {
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
