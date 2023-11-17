import React from 'react';
import { StyleSheet, Text } from 'react-native';
import useTheme from '../../Theme';

const useStyles = () => {
  const { colors, font, spacing } = useTheme();

  const styles = StyleSheet.create({
    link: {
      color: colors.primary,
    },
    text: {
      color: colors.labelSecondary,
      fontFamily: font.weights.regular,
      fontSize: font.sizes.body,
      padding: spacing.s,
      textAlign: 'center',
    },
  });

  return { styles };
};

type Props = {
  buttonLabel: string;
};

export default function Agreement({ buttonLabel }: Props) {
  const { styles } = useStyles();

  return (
    <Text style={styles.text}>
      {`By tapping ${buttonLabel}, I agree to the Organize `}
      <Text
        onPress={() => console.log('Terms pressed')}
        style={styles.link}
      >
        Terms
      </Text>
      {' and '}
      <Text
        onPress={() => console.log('Privacy policy pressed')}
        style={styles.link}
      >
        Privacy Policy
      </Text>
    </Text>
  );
}
