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
  });

  return { colors, styles };
};

type Props = {
  item: Candidate;
  onPress?: (item: Candidate) => void;
  selected?: boolean;
};

export default function CandidateRow({ item, onPress, selected }: Props) {
  const { title } = item;

  const iconName = selected ? 'radio-button-checked' : 'radio-button-unchecked';

  const { colors, styles } = useStyles();

  return (
    <TouchableHighlight
      onPress={() => onPress?.(item)}
      underlayColor={colors.label}
    >
      <View style={styles.container}>
        <Icon name={iconName} style={styles.icon} />
        <Text style={styles.text}>{title}</Text>
      </View>
    </TouchableHighlight>
  );
}

CandidateRow.defaultProps = {
  onPress: () => {},
  selected: false,
};
