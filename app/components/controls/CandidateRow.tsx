import React from 'react';
import {
  StyleSheet, Text, TouchableHighlight, View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Candidate } from '../../model';
import useTheme from '../../Theme';

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
    waitingForChange: {
      opacity: 0.5,
    },
  });

  return { colors, styles };
};

type Props = {
  disabled?: boolean;
  item: Candidate;
  onPress?: (item: Candidate) => void;
  selected?: boolean;
  waitingForChange?: boolean;
};

export default function CandidateRow({
  disabled, item, onPress, selected, waitingForChange,
}: Props) {
  const { title } = item;

  const iconName = selected ? 'radio-button-checked' : 'radio-button-unchecked';

  const { colors, styles } = useStyles();

  return (
    <TouchableHighlight
      disabled={disabled}
      onPress={() => onPress?.(item)}
      underlayColor={colors.label}
    >
      <View style={styles.container}>
        <Icon
          name={iconName}
          style={[styles.icon, waitingForChange && styles.waitingForChange]}
        />
        <Text style={styles.text}>{title}</Text>
      </View>
    </TouchableHighlight>
  );
}

CandidateRow.defaultProps = {
  disabled: false,
  onPress: () => {},
  selected: false,
  waitingForChange: false,
};
