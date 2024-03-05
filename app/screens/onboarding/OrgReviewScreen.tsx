import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  Agreement, ButtonRow, LockingScrollView, PrimaryButton, ScreenBackground,
  SecondaryButton, useRequestProgress,
} from '../../components';
import { NewOrgSteps, createCurrentUser, useCurrentUser } from '../../model';
import type { OrgReviewScreenProps } from '../../navigation';
import useTheme from '../../Theme';

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
  const { definition: untrimmedDefinition, name: untrimmedName } = route.params;
  const definition = untrimmedDefinition.trim();
  const name = untrimmedName.trim();

  const { styles } = useStyles();
  const { setCurrentUser } = useCurrentUser();
  const { RequestProgress, setLoading, setResult } = useRequestProgress();

  const buttonLabel = 'Create';

  const onCreatePressed = async () => {
    setLoading(true);
    setResult('none');

    const unpublishedOrg = {
      name,
      memberDefinition: definition,
    };

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
      }).catch(console.error);
  };

  return (
    <ScreenBackground>
      <Text style={styles.title}>Review Your Org</Text>
      <LockingScrollView style={styles.scrollView}>
        <View style={styles.paramContainer}>
          <Text style={styles.label}>{`${NewOrgSteps[0].header}:`}</Text>
          <Text style={styles.value}>{name}</Text>
        </View>
        <View style={styles.paramContainer}>
          <Text style={styles.label}>{`${NewOrgSteps[1].header}:`}</Text>
          <Text style={styles.value}>{definition}</Text>
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
