import React from 'react';
import {
  StyleSheet, Text, TouchableHighlight, View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import useTheme from '../../Theme';
import { RankedResult } from '../hooks';

const useStyles = () => {
  const {
    colors, font, sizes, spacing,
  } = useTheme();

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      backgroundColor: colors.fill,
      columnGap: spacing.m,
      flexDirection: 'row',
      padding: spacing.m,
    },
    icon: {
      color: colors.primary,
      fontSize: sizes.mediumIcon,
    },
    text: {
      color: colors.label,
      fontSize: font.sizes.body,
      fontFamily: font.weights.regular,
    },
  });

  return { colors, styles };
};

type Props = {
  item: RankedResult;
};

export default function ResultRow({
  item,
}: Props) {
  const { candidate: { title }, rank } = item;

  const iconName = rank === 0 ? 'check-circle' : 'radio-button-unchecked';

  const { colors, styles } = useStyles();

  return (
    <TouchableHighlight underlayColor={colors.label}>
      <View style={styles.container}>
        <Icon name={iconName} style={styles.icon} />
        <Text style={styles.text}>{title}</Text>
      </View>
    </TouchableHighlight>
  );
}
