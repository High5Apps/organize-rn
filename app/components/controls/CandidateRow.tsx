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
    disabled: {
      opacity: 0.5,
    },
    icon: {
      color: colors.primary,
      fontSize: sizes.mediumIcon,
    },
    text: {
      color: colors.label,
      fontSize: font.sizes.body,
      fontFamily: font.weights.regular,
      flex: 1,
    },
  });

  return { colors, styles };
};

type IconNameProps = {
  indicatesMultipleSelectionsAllowed?: boolean;
  selected?: boolean;
};

function getIcon({
  indicatesMultipleSelectionsAllowed, selected,
}: IconNameProps) {
  if (indicatesMultipleSelectionsAllowed) {
    return selected ? 'check-box' : 'check-box-outline-blank';
  }

  return selected ? 'radio-button-checked' : 'radio-button-unchecked';
}

type Props = IconNameProps & {
  disabled?: boolean;
  item: Candidate;
  onPress?: (item: Candidate) => void;
  showDisabled?: boolean;
};

export default function CandidateRow({
  disabled, indicatesMultipleSelectionsAllowed, item, onPress, selected,
  showDisabled,
}: Props) {
  const { title } = item;

  const iconName = getIcon({ indicatesMultipleSelectionsAllowed, selected });

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
          style={[styles.icon, showDisabled && styles.disabled]}
        />
        <Text style={styles.text}>{title}</Text>
      </View>
    </TouchableHighlight>
  );
}

CandidateRow.defaultProps = {
  disabled: false,
  indicatesMultipleSelectionsAllowed: false,
  onPress: () => {},
  selected: false,
  showDisabled: false,
};
