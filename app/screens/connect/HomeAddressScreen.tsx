import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  KeyboardAvoidingScreenBackground, PrimaryButton, SearchBar, TextButton,
} from '../../components';
import useTheme from '../../Theme';
import { useUnionCard } from '../../model';
import type { HomeAddressScreenProps } from '../../navigation';

export const MAX_HOME_ADDRESS_LENGTH = 100;

const useStyles = () => {
  const {
    colors, font, sizes, spacing,
  } = useTheme();

  const styles = StyleSheet.create({
    button: {
      bottom: spacing.m,
      end: spacing.m,
      height: sizes.buttonHeight,
      paddingHorizontal: spacing.m,
      position: 'absolute',
    },
    container: {
      flex: 1,
      rowGap: spacing.m,
    },
    text: {
      color: colors.label,
      fontSize: font.sizes.body,
      fontFamily: font.weights.regular,
    },
    textButton: {
      alignSelf: 'flex-start',
      marginStart: spacing.m,
    },
    textSection: {
      alignItems: 'center',
      rowGap: spacing.s,
    },
  });

  return { styles };
};

export default function HomeAddressScreen({
  navigation,
}: HomeAddressScreenProps) {
  const { cacheUnionCard, unionCard } = useUnionCard();
  const setAddress = (address: string) => cacheUnionCard({
    ...unionCard, homeAddress: address,
  });

  const { styles } = useStyles();
  return (
    <KeyboardAvoidingScreenBackground contentContainerStyle={styles.container}>
      <SearchBar
        autoCapitalize="words"
        autoComplete="address-line1"
        enterKeyHint="done"
        initialValue={unionCard?.homeAddress}
        maxLength={MAX_HOME_ADDRESS_LENGTH}
        onChangeText={setAddress}
        placeholder="555 Main Street, Unit 55, Seattle, WA"
      />
      <View style={styles.textSection}>
        <Text style={styles.text}>Want autocomplete?</Text>
        <TextButton
          onPress={() => console.log('Enable location permission')}
          style={styles.textButton}
        >
          Enable location permission
        </TextButton>
      </View>
      <PrimaryButton
        iconName="done"
        label="Done"
        onPress={() => navigation.goBack()}
        style={styles.button}
      />
    </KeyboardAvoidingScreenBackground>
  );
}
