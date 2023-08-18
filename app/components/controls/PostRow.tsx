import React from 'react';
import {
  StyleSheet, Text, TouchableHighlight, View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import useTheme from '../../Theme';
import { Post, getMessageAge } from '../../model';

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

      paddingVertical: spacing.s,
    },
    innerContainer: {
      flex: 1,
      flexDirection: 'column',
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

  return { styles };
};

type Props = {
  hideDisclosureIndicator?: boolean;
  item: Post;
  onPress?: (item: Post) => void;
};

export default function PostRow({
  hideDisclosureIndicator, item, onPress,
}: Props) {
  const { createdAt, pseudonym, title } = item;

  const { styles } = useStyles();

  const timeAgo = getMessageAge(createdAt);
  const subtitle = `By ${pseudonym} ${timeAgo}`;

  return (
    <TouchableHighlight onPress={() => onPress?.(item)}>
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        {!hideDisclosureIndicator && (
          <Icon name="chevron-right" style={styles.icon} />
        )}
      </View>
    </TouchableHighlight>
  );
}

PostRow.defaultProps = {
  hideDisclosureIndicator: false,
  onPress: () => {},
};
