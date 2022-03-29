import React from 'react';
import {
  ScrollView, StyleSheet, Text, View,
} from 'react-native';
import {
  ButtonRow, PrimaryButton, ScreenBackground, SecondaryButton,
} from '../components';
import { OrgReviewScreenProps } from '../navigation';
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
      flexGrow: 1,
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

  return (
    <ScreenBackground>
      <Text style={styles.title}>Review Your Org</Text>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.scrollView}
      >
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
      </ScrollView>
      <>
        <Text style={styles.agreement}>
          {'By tapping Create, I agree to the Organize '}
          <Text
            onPress={() => console.log('Terms pressed')}
            style={styles.agreementLink}
          >
            Terms
          </Text>
          {' and '}
          <Text
            onPress={() => console.log('Privacy policy pressed')}
            style={styles.agreementLink}
          >
            Privacy Policy
          </Text>
        </Text>
        <ButtonRow>
          <SecondaryButton
            iconName="navigate-before"
            label="Back"
            onPress={navigation.goBack}
            style={[styles.button, styles.backButton]}
          />
          <PrimaryButton
            iconName="add"
            label="Create"
            onPress={() => console.log('Create pressed')}
            style={[styles.button, styles.createButton]}
          />
        </ButtonRow>
      </>
    </ScreenBackground>
  );
}
