import React, { useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';
import {
  ScreenBackground, SearchBar, UserList, useRequestProgress,
} from '../../components';
import {
  ConfirmationAlert, GENERIC_ERROR_MESSAGE, User, useCurrentUser,
  useModerationEvents,
} from '../../model';
import useTheme from '../../Theme';
import { createModerationEvent } from '../../networking';
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

  const { cacheModerationEvent } = useModerationEvents();

  const {
    RequestProgress, setLoading, setResult,
  } = useRequestProgress({ removeWhenInactive: true });

  const { currentUser } = useCurrentUser();

  const onBlock = useCallback(async (user: User) => {
    if (!currentUser) { return; }

    setFilteredUserId(user.id);
    setResult('none');
    setLoading(true);

    const jwt = await currentUser.createAuthToken({ scope: '*' });

    let errorMessage: string | undefined;
    let id: string | undefined;
    try {
      ({ errorMessage, id } = await createModerationEvent({
        action: 'block',
        jwt,
        moderatableId: user.id,
        moderatableType: 'User',
      }));
    } catch (error) {
      errorMessage = GENERIC_ERROR_MESSAGE;
    }

    if (errorMessage !== undefined) {
      setResult('error', {
        message: `${errorMessage}\nTap here to try again`,
        onPress: () => onBlock(user),
      });
    } else if (id) {
      setResult('success');

      cacheModerationEvent({
        action: 'block',
        createdAt: new Date(),
        id,
        moderatable: {
          category: 'User',
          creator: {
            id: user.id,
            pseudonym: user.pseudonym,
          },
          id: user.id,
        },
        moderator: {
          id: currentUser.id,
          pseudonym: currentUser.pseudonym,
        },
      });

      navigation.navigate('BlockedMembers', { prependedModerationEventId: id });
    } else {
      console.warn('WARNING: Expected errorMessage or moderationEventId');
    }
  }, [cacheModerationEvent, currentUser, navigation]);

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
