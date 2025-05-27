import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  Agreement, ButtonRow, LockingScrollView, PrimaryButton, ScreenBackground,
  SecondaryButton, useRequestProgress,
} from '../../components';
import {
  NewOrgSteps, createCurrentUser, sanitizeSingleLineField, useCurrentUser,
} from '../../model';
import type { OrgReviewParams, OrgReviewScreenProps } from '../../navigation';
import useTheme from '../../Theme';
import { useTranslation } from '../../i18n';

const useStyles = () => {
  const { colors, font, spacing } = useTheme();

  const styles = StyleSheet.create({
    agreement: {
      color: colors.labelSecondary,
      fontFamily: font.weights.regular,
      fontSize: font.sizes.body,
      padding: spacing.s,
      textAlign: 'center',
    },
    agreementLink: {
      textDecorationLine: 'underline',
    },
    backButton: {
      justifyContent: 'flex-start',
    },
    button: {
      marginHorizontal: spacing.s,
    },
    createButton: {
      flex: 0,
      paddingHorizontal: spacing.m,
    },
    label: {
      color: colors.labelSecondary,
      fontFamily: font.weights.regular,
      fontSize: font.sizes.body,
      textAlign: 'center',
    },
    paramContainer: {
      marginBottom: spacing.l,
    },
    scrollView: {
      paddingHorizontal: spacing.m,
    },
    title: {
      color: colors.label,
      fontFamily: font.weights.regular,
      fontSize: font.sizes.largeTitle,
      margin: spacing.m,
    },
    value: {
      color: colors.label,
      fontFamily: font.weights.regular,
      fontSize: font.sizes.title1,
      textAlign: 'center',
      textDecorationLine: 'underline',
    },
  });

  return { styles };
};

export default function OrgReviewScreen({
  navigation, route,
}: OrgReviewScreenProps) {
  const untrimmedParams: OrgReviewParams = route.params;
  const unpublishedOrg = Object.fromEntries(
    Object.entries(untrimmedParams)
      .map(([k, v]) => ([k, sanitizeSingleLineField(v)])),
  ) as OrgReviewParams;

  const { styles } = useStyles();
  const { t } = useTranslation();
  const { setCurrentUser } = useCurrentUser();
  const { RequestProgress, setLoading, setResult } = useRequestProgress();

  const buttonLabel = t('action.create');

  const onCreatePressed = async () => {
    setLoading(true);
    setResult('none');

    createCurrentUser({ unpublishedOrg })
      .then(async (userOrErrorMessage) => {
        setLoading(false);
        if (typeof userOrErrorMessage === 'string') {
          const message = userOrErrorMessage;
          setResult('error', { message });
          return;
        }
        const user = userOrErrorMessage;
        setCurrentUser(user);
        navigation.navigate('Verification');
      }).catch(console.error);
  };

  return (
    <ScreenBackground>
      <Text style={styles.title}>{t('action.reviewOrg')}</Text>
      <LockingScrollView style={styles.scrollView}>
        {NewOrgSteps.map(({ header, param }) => (
          <View key={param} style={styles.paramContainer}>
            <Text style={styles.label}>{`${header}:`}</Text>
            <Text style={styles.value}>{unpublishedOrg[param]}</Text>
          </View>
        ))}
      </LockingScrollView>
      <>
        <RequestProgress />
        <Agreement buttonLabel={buttonLabel} />
        <ButtonRow>
          <SecondaryButton
            iconName="navigate-before"
            label={t('action.navigateBack')}
            onPress={navigation.goBack}
            style={[styles.button, styles.backButton]}
          />
          <PrimaryButton
            iconName="add"
            label={buttonLabel}
            onPress={onCreatePressed}
            style={[styles.button, styles.createButton]}
          />
        </ButtonRow>
      </>
    </ScreenBackground>
  );
}
