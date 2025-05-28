import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  ConfirmationAlert, LockingScrollView, ScreenBackground, SecondaryButton,
  useRequestProgress,
  WarningView,
} from '../../components';
import useTheme from '../../Theme';
import { useCurrentUser } from '../../model';
import { useTranslation } from '../../i18n';

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
  const { t } = useTranslation();

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
            warning={t('explanation.warning.leaveOrg.condition')}
            warningBullets={[
              {
                iconName: 'block',
                message: t('explanation.warning.leaveOrg.noInteraction'),
              },
              {
                iconName: 'delete-forever',
                message: t('explanation.warning.leaveOrg.contentDeletion'),
              },
              {
                iconName: 'logout',
                message: t('explanation.warning.leaveOrg.logout'),
              },
            ]}
          />
          <SecondaryButton
            iconName="close"
            iconStyle={styles.button}
            label={t('action.leaveOrg')}
            onPress={ConfirmationAlert({
              destructiveAction: t('action.leaveOrg'),
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
