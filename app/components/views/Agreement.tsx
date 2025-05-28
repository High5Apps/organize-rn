import React from 'react';
import { Linking, StyleSheet, Text } from 'react-native';
import useTheme from '../../Theme';
import { privacyPolicyURI, termsOfServiceURI } from '../../model';
import { Trans } from '../../i18n';

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
      <Trans
        components={{
          PrivacyLink: (
            <Text
              onPress={() => Linking.openURL(privacyPolicyURI)}
              style={styles.link}
            />
          ),
          TermsLink: (
            <Text
              onPress={() => Linking.openURL(termsOfServiceURI)}
              style={styles.link}
            />
          ),
        }}
        i18nKey="legal.agreement.user"
        values={{ buttonLabel }}
      />
    </Text>
  );
}
