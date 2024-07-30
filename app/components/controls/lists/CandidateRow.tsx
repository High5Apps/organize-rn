import React from 'react';
import {
  StyleSheet, Text, TouchableHighlight, View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Candidate } from '../../../model';
import useTheme from '../../../Theme';
import type { DiscussButtonType } from '../DiscussButton';

const useStyles = () => {
  const {
    colors, font, opacity, sizes, spacing,
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
      opacity: opacity.disabled,
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
  indicatesSelectionToggling?: boolean;
  selected?: boolean;
};

function getIcon({
  indicatesSelectionToggling, selected,
}: IconNameProps) {
  if (indicatesSelectionToggling) {
    return selected ? 'check-box' : 'check-box-outline-blank';
  }

  return selected ? 'radio-button-checked' : 'radio-button-unchecked';
}

type Props = IconNameProps & {
  disabled?: boolean;
  DiscussButton: DiscussButtonType;
  item: Candidate;
  onPress?: (item: Candidate) => void;
  showDisabled?: boolean;
};

export default function CandidateRow({
  disabled, DiscussButton, indicatesSelectionToggling, item, onPress, selected,
  showDisabled,
}: Props) {
  const { postId, title } = item;

  const iconName = getIcon({ indicatesSelectionToggling, selected });

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
        <DiscussButton postId={postId} />
      </View>
    </TouchableHighlight>
  );
}

CandidateRow.defaultProps = {
  disabled: false,
  indicatesSelectionToggling: false,
  onPress: () => {},
  selected: false,
  showDisabled: false,
};
