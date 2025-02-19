import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  ConfirmationAlert, LockingScrollView, ScreenBackground, SecondaryButton,
  useRequestProgress,
} from '../../components';
import useTheme from '../../Theme';
import { useCurrentUser } from '../../model';

const useStyles = () => {
  const {
    colors, font, sizes, spacing,
  } = useTheme();

  const styles = StyleSheet.create({
    bulletRow: {
      alignItems: 'center',
      columnGap: spacing.m,
      flexDirection: 'row',
    },
    button: {
      color: colors.danger,
    },
    container: {
      backgroundColor: colors.fill,
      padding: spacing.m,
      rowGap: spacing.m,
    },
    iconBullet: {
      color: colors.primary,
      fontSize: sizes.mediumIcon,
    },
    iconWarning: {
      alignSelf: 'center',
      color: colors.primary,
      fontSize: sizes.extraLargeIcon,
    },
    scrollView: {
      flex: 1,
    },
    text: {
      color: colors.label,
      flex: 1,
      fontSize: font.sizes.body,
      fontFamily: font.weights.regular,
    },
    textHeadline: {
      color: colors.label,
      flexShrink: 1,
      fontSize: font.sizes.body,
      fontFamily: font.weights.semiBold,
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
          <Icon name="warning-amber" style={styles.iconWarning} />
          <Text style={styles.textHeadline}>
            Warning! If you choose to leave this Org:
          </Text>
          <View style={styles.bulletRow}>
            <Icon name="block" style={styles.iconBullet} />
            <Text style={styles.text}>
              You won&apos;t be able to use the app to interact with this Org anymore.
            </Text>
          </View>
          <View style={styles.bulletRow}>
            <Icon name="delete-forever" style={styles.iconBullet} />
            <Text style={styles.text}>
              All of the text you wrote in your comments and discussions will be
              permanently deleted.
            </Text>
          </View>
          <View style={styles.bulletRow}>
            <Icon name="logout" style={styles.iconBullet} />
            <Text style={styles.text}>
              You will be logged out of the app.
            </Text>
          </View>
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
