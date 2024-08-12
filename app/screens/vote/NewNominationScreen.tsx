import React, { useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';
import {
  ConfirmationAlert, ScreenBackground, SearchBar, UserList, useRequestProgress,
} from '../../components';
import type { NewNominationScreenProps } from '../../navigation';
import { createNomination } from '../../networking';
import {
  Nomination, User, getErrorMessage, useBallot, useCurrentUser,
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
  navigation, route,
}: NewNominationScreenProps) {
  const { ballotId } = route.params;

  const [filteredUserId, setFilteredUserId] = useState<string>();
  const [debouncedQuery, setDebouncedQuery] = useState<string | undefined>();

  const { currentUser } = useCurrentUser();
  const { cacheBallot, ballot } = useBallot(ballotId);

  const { styles } = useStyles();

  const {
    RequestProgress, setLoading, setResult,
  } = useRequestProgress({ removeWhenInactive: true });

  const onNominate = useCallback(async (nominee: User) => {
    if (!currentUser || !ballot) { return; }

    setFilteredUserId(nominee.id);
    setResult('none');
    setLoading(true);

    const jwt = await currentUser.createAuthToken({ scope: '*' });
    let errorMessage: string | undefined;
    let nominationId: string | undefined;
    try {
      ({ id: nominationId, errorMessage } = await createNomination({
        ballotId: ballot.id, jwt, nomineeId: nominee.id,
      }));
    } catch (error) {
      errorMessage = getErrorMessage(error);
    }

    if (errorMessage !== undefined) {
      setResult('error', {
        message: `${errorMessage}\nTap here to try again`,
        onPress: () => onNominate(nominee),
      });
    }

    if (nominationId) {
      setResult('success');

      const nomination: Nomination = {
        accepted: null,
        id: nominationId,
        nominator: {
          id: currentUser.id,
          pseudonym: currentUser.pseudonym,
        },
        nominee: {
          id: nominee.id,
          pseudonym: nominee.pseudonym,
        },
      };
      const updatedBallot = { ...ballot };
      updatedBallot.nominations = [nomination, ...(ballot.nominations ?? [])];
      cacheBallot(updatedBallot);

      navigation.goBack();
    }

    setLoading(false);
  }, [ballot, currentUser]);

  const onItemPress = useCallback(async (nominee: User) => {
    const { pseudonym } = nominee;
    ConfirmationAlert({
      destructiveAction: 'Nominate',
      destructiveActionInTitle: `nominate ${pseudonym}`,
      destructiveButtonStyle: 'default',
      onConfirm: () => onNominate(nominee),
    }).show();
  }, [onNominate]);

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
        sort="service"
      />
    </ScreenBackground>
  );
}
