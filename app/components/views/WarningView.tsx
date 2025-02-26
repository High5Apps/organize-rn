import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import useTheme from '../../Theme';

const useStyles = () => {
  const {
    colors, font, sizes, spacing,
  } = useTheme();

  const styles = StyleSheet.create({
    bulletRow: {
      alignItems: 'center',
      columnGap: spacing.m,
      flexDirection: 'row',
    },
    container: {
      rowGap: spacing.m,
    },
    iconBullet: {
      color: colors.primary,
      fontSize: sizes.mediumIcon,
    },
    iconWarning: {
      alignSelf: 'center',
      color: colors.primary,
      fontSize: sizes.extraLargeIcon,
    },
    text: {
      color: colors.label,
      flex: 1,
      fontSize: font.sizes.body,
      fontFamily: font.weights.regular,
    },
    textHeadline: {
      color: colors.label,
      flexShrink: 1,
      fontSize: font.sizes.body,
      fontFamily: font.weights.semiBold,
    },
  });

  return { styles };
};

type WarningBullet = {
  iconName: string;
  message: string;
};

type Props = {
  warning: string;
  warningBullets: WarningBullet[];
};

export default function WarningView({ warning, warningBullets }: Props) {
  const { styles } = useStyles();
  return (
    <View style={styles.container}>
      <Icon name="warning-amber" style={styles.iconWarning} />
      <Text style={styles.textHeadline}>{warning}</Text>
      {warningBullets.map(({ iconName, message }) => (
        <View key={iconName} style={styles.bulletRow}>
          <Icon name={iconName} style={styles.iconBullet} />
          <Text style={styles.text}>{message}</Text>
        </View>
      ))}
    </View>
  );
}
