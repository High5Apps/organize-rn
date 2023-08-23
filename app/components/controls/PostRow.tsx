import React from 'react';
import {
  StyleSheet, Text, TouchableHighlight, View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import useTheme from '../../Theme';
import { Post, getMessageAge } from '../../model';
import UpVoteControl from './UpVoteControl';

const useStyles = () => {
  const {
    colors, font, sizes, spacing,
  } = useTheme();

  const styles = StyleSheet.create({
    icon: {
      alignSelf: 'center',
      color: colors.separator,
      fontSize: sizes.mediumIcon,
    },
    container: {
      backgroundColor: colors.fill,
      flexDirection: 'row',

      // paddingStart and paddingEnd are different because the chevron icon has
      // its own internal padding, which makes the row's padding seem unbalanced
      // when paddingStart and paddingEnd are the same.
      paddingEnd: spacing.s,
      paddingStart: spacing.m,
    },
    innerContainer: {
      flex: 1,
      flexDirection: 'column',
      paddingVertical: spacing.s,
    },
    subtitle: {
      color: colors.labelSecondary,
      fontSize: font.sizes.subhead,
      fontFamily: font.weights.regular,
    },
    title: {
      color: colors.label,
      flexShrink: 1,
      fontSize: font.sizes.body,
      fontFamily: font.weights.semiBold,
    },
  });

  return { colors, styles };
};

type Props = {
  disabled?: boolean;
  item: Post;
  onPress?: (item: Post) => void;
};

export default function PostRow({
  disabled, item, onPress,
}: Props) {
  const { createdAt, pseudonym, title } = item;

  const { colors, styles } = useStyles();

  const timeAgo = getMessageAge(createdAt);
  const subtitle = `By ${pseudonym} ${timeAgo}`;

  return (
    <TouchableHighlight
      disabled={disabled}
      onPress={() => onPress?.(item)}
      underlayColor={colors.label}
    >
      <View style={styles.container}>
        <UpVoteControl />
        <View style={styles.innerContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        {!disabled && <Icon name="chevron-right" style={styles.icon} />}
      </View>
    </TouchableHighlight>
  );
}

PostRow.defaultProps = {
  disabled: false,
  onPress: () => {},
};
