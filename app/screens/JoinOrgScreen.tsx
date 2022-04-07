import React from 'react';
import {
  ScrollView, StyleSheet, Text, View,
} from 'react-native';
import {
  ButtonRow, QRButton, ScreenBackground, SecondaryButton,
} from '../components';
import { JoinOrgScreenProps } from '../navigation';
import useTheme from '../Theme';

const useStyles = () => {
  const { colors, font, spacing } = useTheme();

  const styles = StyleSheet.create({
    backButton: {
      flex: 0,
      marginHorizontal: spacing.s,
      paddingEnd: spacing.l,
    },
    prompt: {
      color: colors.label,
      fontFamily: font.weights.regular,
      fontSize: font.sizes.body,
      marginTop: spacing.m,
      textAlign: 'center',
    },
    scrollView: {
      flexGrow: 1,
      marginTop: spacing.m,
    },
    topContainer: {
      padding: spacing.m,
    },
  });

  return { styles };
};

export default function JoinOrgScreen({ navigation }: JoinOrgScreenProps) {
  const { styles } = useStyles();

  return (
    <ScreenBackground>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.scrollView}
      >
        <View style={styles.topContainer}>
          <QRButton onPress={() => console.log('Allow camera access')} />
          <Text style={styles.prompt}>
            To join an Org, scan the secret code of a current member.
          </Text>
        </View>
      </ScrollView>
      <ButtonRow>
        <SecondaryButton
          iconName="navigate-before"
          label="Back"
          onPress={navigation.goBack}
          style={styles.backButton}
        />
        <SecondaryButton
          iconName="navigate-next"
          label="Skip"
          onPress={() => navigation.replace('OrgTabs', {
            screen: 'ConnectStack',
          })}
          style={styles.backButton}
          reversed
        />
      </ButtonRow>
    </ScreenBackground>
  );
}
