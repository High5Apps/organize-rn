import React, { useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';
import {
  ConfirmationAlert, ScreenBackground, SearchBar, UserList, useRequestProgress,
} from '../../components';
import {
  Moderatable, User, getErrorMessage, useModerationEvent,
} from '../../model';
import useTheme from '../../Theme';
import type { BlockMemberScreenProps } from '../../navigation';
import { useTranslation } from '../../i18n';

const useStyles = () => {
  const { spacing } = useTheme();

  const styles = StyleSheet.create({
    requestProgress: {
      margin: spacing.m,
    },
  });

  return { styles };
};

export default function BlockMemberScreen({
  navigation,
}: BlockMemberScreenProps) {
  const [filteredUserId, setFilteredUserId] = useState<string>();
  const [debouncedQuery, setDebouncedQuery] = useState<string | undefined>();

  const {
    RequestProgress, setLoading, setResult,
  } = useRequestProgress({ removeWhenInactive: true });

  const { createModerationEvent } = useModerationEvent();

  const { t } = useTranslation();

  const onBlock = useCallback(async (user: User) => {
    setFilteredUserId(user.id);
    setResult('none');
    setLoading(true);

    const moderatable: Moderatable = {
      category: 'User',
      creator: {
        id: user.id,
        pseudonym: user.pseudonym,
      },
      id: user.id,
    };

    try {
      const moderationEvent = await createModerationEvent({
        action: 'block', moderatable,
      });
      setResult('success');
      navigation.popTo('BlockedMembers', {
        prependedModerationEventId: moderationEvent.id,
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setResult('error', {
        message: t('result.error.tapToRetry', { errorMessage }),
        onPress: () => onBlock(user),
      });
    }
  }, [createModerationEvent, navigation, t]);

  const onItemPress = useCallback(async (user: User) => {
    const { pseudonym } = user;
    ConfirmationAlert({
      destructiveAction: t('action.block'),
      onConfirm: () => onBlock(user),
      subtitle: t('hint.blockingPreventsOrgAccess'),
      title: t('question.confirmation.blockUser', { pseudonym }),
    }).show();
  }, [t]);

  const { styles } = useStyles();

  return (
    <ScreenBackground>
      <SearchBar
        disabled={!!filteredUserId}
        onDebouncedQueryChanged={setDebouncedQuery}
      />
      <UserList
        debouncedQuery={debouncedQuery}
        ListFooterComponent={<RequestProgress style={styles.requestProgress} />}
        onItemPress={onItemPress}
        onlyShowUserId={filteredUserId}
        sort="low_service"
      />
    </ScreenBackground>
  );
}
