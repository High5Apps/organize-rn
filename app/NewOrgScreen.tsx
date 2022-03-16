import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
} from 'react-native';
import ScreenBackground from './ScreenBackground';
import SecondaryButton from './SecondaryButton';
import useTheme from './Theme';

const useStyles = () => {
  const {
    colors, font, sizes, spacing,
  } = useTheme();

  const styles = StyleSheet.create({
    message: {
      fontFamily: font.weights.regular,
      fontSize: font.sizes.paragraph,
      margin: spacing.m,
      textAlign: 'center',
    },
    textInput: {
      backgroundColor: colors.fill,
      borderBottomColor: colors.separator,
      borderBottomWidth: sizes.separator,
      color: colors.label,
      height: sizes.buttonHeight,
      fontFamily: font.weights.regular,
      fontSize: font.sizes.paragraph,
      paddingHorizontal: spacing.m,
      paddingVertical: spacing.s,
    },
    title: {
      color: colors.label,
      fontFamily: font.weights.regular,
      fontSize: font.sizes.largeTitle,
      margin: spacing.m,
    },
  });

  return { styles, colors };
};

type Props = {
  maxLength: number,
  message: string,
  placeholder: string,
  title: string;
};

export default function NewOrgScreen({
  maxLength, message, placeholder, title,
}: Props) {
  const { styles, colors } = useStyles();
  return (
    <ScreenBackground>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <Text style={styles.title}>
          {title}
        </Text>
        <TextInput
          autoFocus
          maxLength={maxLength}
          placeholder={placeholder}
          placeholderTextColor={colors.labelSecondary}
          selectionColor={colors.primary}
          style={styles.textInput}
        />
        <Text style={styles.message}>
          {message}
        </Text>
        <SecondaryButton
          iconName="help-outline"
          label="Learn More"
          onPress={() => console.log('Learn more pressed!')}
        />
      </ScrollView>
    </ScreenBackground>
  );
}
