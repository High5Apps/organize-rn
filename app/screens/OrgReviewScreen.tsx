import React, { useState } from 'react';
import {
  ActivityIndicator, StyleSheet, Text, View,
} from 'react-native';
import {
  Agreement, ButtonRow, LockingScrollView, PrimaryButton, ScreenBackground,
  SecondaryButton,
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
    errorMessage: {
      color: colors.error,
      fontFamily: font.weights.regular,
      fontSize: font.sizes.body,
      paddingHorizontal: spacing.m,
      textAlign: 'center',
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

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { styles } = useStyles();
  const { createCurrentUser, setCurrentUser } = useUserContext();

  const buttonLabel = 'Create';

  const onCreatePressed = async () => {
    setLoading(true);
    setErrorMessage(null);

    const unpublishedOrg = {
      name,
      potentialMemberCount: estimate,
      potentialMemberDefinition: definition,
    };

    createCurrentUser({ unpublishedOrg })
      .then(async (userOrErrorMessage) => {
        setLoading(false);
        if (typeof userOrErrorMessage === 'string') {
          setErrorMessage(userOrErrorMessage);
          return;
        }
        setCurrentUser(userOrErrorMessage);
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
        {loading && <ActivityIndicator />}
        {errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}
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
