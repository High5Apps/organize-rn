import React, { useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';
import {
  ConfirmationAlert, ScreenBackground, SearchBar, UserList, useRequestProgress,
} from '../../components';
import type { NewNominationScreenProps } from '../../navigation';
import { User, getErrorMessage, useBallot } from '../../model';
import useTheme from '../../Theme';
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

export default function NewNominationScreen({
  navigation, route,
}: NewNominationScreenProps) {
  const { ballotId } = route.params;

  const [filteredUserId, setFilteredUserId] = useState<string>();
  const [debouncedQuery, setDebouncedQuery] = useState<string | undefined>();

  const { ballot, createNomination } = useBallot(ballotId);

  const { styles } = useStyles();
  const { t } = useTranslation();

  const {
    RequestProgress, setLoading, setResult,
  } = useRequestProgress({ removeWhenInactive: true });

  const onNominate = useCallback(async (nominee: User) => {
    setFilteredUserId(nominee.id);
    setResult('none');
    setLoading(true);

    try {
      await createNomination({
        nomineeId: nominee.id, nomineePseudonym: nominee.pseudonym,
      });
      setResult('success');
      navigation.goBack();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setResult('error', {
        message: `${errorMessage}\nTap here to try again`,
        onPress: () => onNominate(nominee),
      });
    }
  }, [ballot]);

  const onItemPress = useCallback(async (nominee: User) => {
    const { pseudonym } = nominee;
    ConfirmationAlert({
      destructiveAction: t('action.nominate'),
      destructiveButtonStyle: 'default',
      onConfirm: () => onNominate(nominee),
      title: t('question.confirmation.nominateUser', { pseudonym }),
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
