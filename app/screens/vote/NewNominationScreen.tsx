import React, { useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';
import { ScreenBackground, UserList, useRequestProgress } from '../../components';
import type { NewNominationScreenProps } from '../../navigation';
import { createNomination } from '../../networking';
import {
  ConfirmationAlert, GENERIC_ERROR_MESSAGE, User, useCurrentUser,
} from '../../model';
import useTheme from '../../Theme';

const useStyles = () => {
  const { spacing } = useTheme();

  const styles = StyleSheet.create({
    requestProgress: {
      margin: spacing.m,
    },
  });

  return { styles };
};

export default function NewNominationScreen({
  route,
}: NewNominationScreenProps) {
  const { ballotId } = route.params;

  const [filteredUserId, setFilteredUserId] = useState<string>();

  const { currentUser } = useCurrentUser();

  const { styles } = useStyles();

  const {
    RequestProgress, setLoading, setResult,
  } = useRequestProgress({ removeWhenInactive: true });

  const onNominate = useCallback(async (nomineeId: string) => {
    if (!currentUser) { return; }

    setFilteredUserId(nomineeId);
    setResult('none');
    setLoading(true);

    const jwt = await currentUser.createAuthToken({ scope: '*' });
    let errorMessage: string | undefined;
    let nominationId: string | undefined;
    try {
      ({
        id: nominationId, errorMessage,
      } = await createNomination({ ballotId, jwt, nomineeId }));
    } catch (error) {
      errorMessage = GENERIC_ERROR_MESSAGE;
    }

    if (errorMessage !== undefined) {
      setResult('error', {
        message: `${errorMessage}\nTap here to try again`,
        onPress: () => onNominate(nomineeId),
      });
    }

    if (nominationId) {
      console.log(`TODO: Cache local nomination and go back: ${nominationId}`);
      setResult('success', { message: 'Successfully created nomination' });
    }

    setLoading(false);
  }, [ballotId, currentUser]);

  const onItemPress = useCallback(async ({ id, pseudonym }: User) => {
    ConfirmationAlert({
      destructiveAction: 'Nominate',
      destructiveActionInTitle: `nominate ${pseudonym}`,
      destructiveButtonStyle: 'default',
      onConfirm: () => onNominate(id),
    }).show();
  }, [onNominate]);

  return (
    <ScreenBackground>
      <UserList
        ListFooterComponent={<RequestProgress style={styles.requestProgress} />}
        onItemPress={onItemPress}
        onlyShowUserId={filteredUserId}
      />
    </ScreenBackground>
  );
}
