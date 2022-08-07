import React, { useState } from 'react';
import {
  ActivityIndicator, StyleSheet, Text, View,
} from 'react-native';
import {
  Agreement, ButtonRow, LockingScrollView, PrimaryButton, ScreenBackground,
  SecondaryButton,
} from '../components';
import { Keys, User, useUserContext } from '../model';
import { UserType } from '../model/User';
import type { OrgReviewScreenProps } from '../navigation';
import { createOrg, ErrorResponse } from '../networking';
import { isErrorResponse } from '../networking/apis/types';
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
  const { setCurrentUser } = useUserContext();

  async function createCurrentUser(): Promise<UserType | null> {
    const { publicKeyId } = await Keys().rsa.create(2048);

    let orgId: string;
    try {
      const response = await createOrg({
        name,
        potentialMemberCount: estimate,
        potentialMemberDefinition: definition,
      });

      if (isErrorResponse(response)) {
        setErrorMessage(ErrorResponse(response).errorMessage);
        return null;
      }

      orgId = response;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
      setErrorMessage('Something unexpected happened. Please try again later.');
      return null;
    }

    const org = {
      id: orgId,
      name,
      potentialMemberCount: estimate,
      potentialMemberDefinition: definition,
    };
    // TODO: UsersController#create
    const user = User({ org, orgId, publicKeyId });
    return user;
  }

  const buttonLabel = 'Create';

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
            onPress={async () => {
              setLoading(true);
              createCurrentUser()
                .then(async (user) => {
                  setLoading(false);
                  if (!user) { return; }
                  setCurrentUser(user);
                }).catch(console.error);
            }}
            style={[styles.button, styles.createButton]}
          />
        </ButtonRow>
      </>
    </ScreenBackground>
  );
}
