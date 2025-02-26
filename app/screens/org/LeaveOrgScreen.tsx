import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  ConfirmationAlert, LockingScrollView, ScreenBackground, SecondaryButton,
  useRequestProgress,
  WarningView,
} from '../../components';
import useTheme from '../../Theme';
import { useCurrentUser } from '../../model';

const useStyles = () => {
  const { colors, spacing } = useTheme();

  const styles = StyleSheet.create({
    button: {
      color: colors.danger,
    },
    container: {
      backgroundColor: colors.fill,
      padding: spacing.m,
      rowGap: spacing.m,
    },
    scrollView: {
      flex: 1,
    },
  });

  return { styles };
};

export default function LeaveOrgScreen() {
  const { styles } = useStyles();

  const { currentUser } = useCurrentUser();
  if (!currentUser) { throw new Error('Expected currentUser'); }

  const {
    RequestProgress, setLoading, setResult,
  } = useRequestProgress({ removeWhenInactive: true });

  return (
    <ScreenBackground>
      <LockingScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <WarningView
            warning="Warning! If you choose to leave this Org:"
            warningBullets={[
              {
                iconName: 'block',
                message: "You won't be able to use the app to interact with this Org anymore.",
              },
              {
                iconName: 'delete-forever',
                message: 'All of the text you wrote in your comments and discussions will be permanently deleted.',
              },
              {
                iconName: 'logout',
                message: 'You will be logged out of the app.',
              },
            ]}
          />
          <SecondaryButton
            iconName="close"
            iconStyle={styles.button}
            label="Leave Org"
            onPress={ConfirmationAlert({
              destructiveAction: 'Leave Org',
              destructiveActionInTitle: 'leave this Org',
              onConfirm: async () => {
                setResult('none');
                setLoading(true);

                try {
                  await currentUser.logOut();
                } catch (error) {
                  setResult('error', { error });
                }
              },
            }).show}
            textStyle={styles.button}
          />
          <RequestProgress />
        </View>
      </LockingScrollView>
    </ScreenBackground>
  );
}
