import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  Agreement, ButtonRow, LockingScrollView, PrimaryButton, ScreenBackground,
  SecondaryButton, useRequestProgress,
} from '../components';
import { useUserContext } from '../model';
import type { OrgReviewScreenProps } from '../navigation';
import useTheme from '../Theme';

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
  const { definition, estimate, name } = route.params;

  const { styles } = useStyles();
  const { createCurrentUser, setCurrentUser } = useUserContext();
  const { RequestProgress, setLoading, setResult } = useRequestProgress();

  const buttonLabel = 'Create';

  const onCreatePressed = async () => {
    setLoading(true);
    setResult('none');

    const unpublishedOrg = {
      name,
      potentialMemberEstimate: estimate,
      potentialMemberDefinition: definition,
    };

    createCurrentUser({ unpublishedOrg })
      .then(async (userOrErrorMessage) => {
        setLoading(false);
        if (typeof userOrErrorMessage === 'string') {
          setResult('error', userOrErrorMessage);
          return;
        }
        const user = userOrErrorMessage;

        // To spoof the newly created user as being in the seeded Org, set the
        // spoofedOrgId below, then update the user's org_id via the backend
        // console.
        // const spoofedOrgId = '';
        // user.orgId = spoofedOrgId;
        // console.log({ userId: user.id });

        setCurrentUser(user);
      }).catch(console.error);
  };

  return (
    <ScreenBackground>
      <Text style={styles.title}>Review Your Org</Text>
      <LockingScrollView style={styles.scrollView}>
        <View style={styles.paramContainer}>
          <Text style={styles.label}>Name of Org:</Text>
          <Text style={styles.value}>{name}</Text>
        </View>
        <View style={styles.paramContainer}>
          <Text style={styles.label}>Definition of a potential member:</Text>
          <Text style={styles.value}>{definition}</Text>
        </View>
        <View style={styles.paramContainer}>
          <Text style={styles.label}>Estimate of potential member count:</Text>
          <Text style={styles.value}>{estimate}</Text>
        </View>
      </LockingScrollView>
      <>
        <RequestProgress />
        <Agreement buttonLabel={buttonLabel} />
        <ButtonRow>
          <SecondaryButton
            iconName="navigate-before"
            label="Back"
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
