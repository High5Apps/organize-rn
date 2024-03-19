import React from 'react';
import {
  StyleSheet, Text, TouchableHighlight, View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Candidate } from '../../model';
import useTheme from '../../Theme';
import TextButton from './TextButton';

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
  item: Candidate;
  onDiscussPressed: (postId: string) => void;
  onPress?: (item: Candidate) => void;
  showDisabled?: boolean;
};

export default function CandidateRow({
  disabled, indicatesSelectionToggling, item, onDiscussPressed, onPress,
  selected, showDisabled,
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
        {postId && (
          <TextButton onPress={() => onDiscussPressed(postId)}>
            Discuss
          </TextButton>
        )}
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
