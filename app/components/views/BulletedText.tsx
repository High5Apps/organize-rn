import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import useTheme from '../../Theme';

const useStyles = () => {
  const {
    colors, font, spacing,
  } = useTheme();

  const styles = StyleSheet.create({
    container: {
      padding: spacing.s,
    },
    innerContainer: {
      flexDirection: 'row',
      marginHorizontal: spacing.s,
      marginVertical: spacing.xxs,
    },
    text: {
      color: colors.label,
      fontSize: font.sizes.body,
      fontFamily: font.weights.regular,
    },
  });

  return { styles };
};

type Props = {
  bullets: string[];
};

export default function BulletedText({ bullets }: Props) {
  const { styles } = useStyles();

  return (
    <View style={styles.container}>
      {bullets.map((bullet, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <View key={i} style={styles.innerContainer}>
          <Text style={styles.text}>• </Text>
          <Text style={styles.text}>{bullet}</Text>
        </View>
      ))}
    </View>
  );
}
