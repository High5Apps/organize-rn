import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { OfficeDuty, addMetadata } from '../../model';
import useTheme from '../../Theme';

const useStyles = () => {
  const {
    colors, font, sizes, spacing,
  } = useTheme();

  const styles = StyleSheet.create({
    container: {
      padding: spacing.s,
    },
    heading: {
      fontFamily: font.weights.semiBold,
    },
    highlight: {
      backgroundColor: colors.fill,
      borderColor: colors.separator,
      borderWidth: sizes.border,
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
  highlight?: boolean;
  item: OfficeDuty;
};

export default function OfficeDutyRow({ highlight, item }: Props) {
  const { category, duties } = item;
  const { title } = addMetadata({ type: category, open: true });

  const { styles } = useStyles();

  return (
    <View style={[styles.container, highlight && styles.highlight]}>
      <Text style={[styles.text, styles.heading]}>{title}</Text>
      {duties.map((duty, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <View key={i} style={styles.innerContainer}>
          <Text style={styles.text}>• </Text>
          <Text style={styles.text}>{duty}</Text>
        </View>
      ))}
    </View>
  );
}

OfficeDutyRow.defaultProps = {
  highlight: false,
};
