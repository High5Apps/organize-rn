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
      navigation.navigate('BlockedMembers', {
        prependedModerationEventId: moderationEvent.id,
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setResult('error', {
        message: `${errorMessage}\nTap here to try again`,
        onPress: () => onBlock(user),
      });
    }
  }, [createModerationEvent, navigation]);

  const onItemPress = useCallback(async (user: User) => {
    const { pseudonym } = user;
    ConfirmationAlert({
      destructiveAction: 'Block',
      destructiveActionInTitle: `block ${pseudonym}`,
      onConfirm: () => onBlock(user),
      subtitle: 'This will prevent them from accessing your Org',
    }).show();
  }, []);

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
