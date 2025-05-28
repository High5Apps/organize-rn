import React, { useCallback } from 'react';
import TextButton from './TextButton';
import type {
  VoteStackParamList, VoteStackScreenProps,
} from '../../../navigation';
import { useTranslation } from '../../../i18n';

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

  const { t } = useTranslation();
  const DiscussButton = useCallback(({ postId }: Props) => {
    if (!postId) { return null; }
    return (
      <TextButton onPress={() => onDiscussPressed(postId)}>
        {t('action.discuss')}
      </TextButton>
    );
  }, [navigation]);

  return DiscussButton;
}

export type DiscussButtonType = ReturnType<typeof useDiscussButton>;
