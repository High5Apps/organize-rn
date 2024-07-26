import React, { PropsWithChildren } from 'react';
import {
  StyleProp, StyleSheet, View, ViewStyle,
} from 'react-native';
import useTheme from '../../Theme';
import { useCurrentUser } from '../../model';

const useStyles = () => {
  const { colors, spacing } = useTheme();

  const containerPaddingHorizontal = spacing.s;

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.fill,
      flexDirection: 'row',
      paddingEnd: containerPaddingHorizontal,
    },
    highlightOff: {
      paddingStart: containerPaddingHorizontal,
    },
    highlightOn: {
      borderColor: colors.primary,
      borderStartWidth: containerPaddingHorizontal,
    },
  });

  return { styles };
};

type Props = {
  userIds: string[];
  style?: StyleProp<ViewStyle>;
};

export default function HighlightedCurrentUserRowContainer({
  children, userIds, style,
}: PropsWithChildren<Props>) {
  const { styles } = useStyles();

  const { currentUser } = useCurrentUser();
  const highlighted = currentUser && userIds.includes(currentUser?.id);

  return (
    <View
      style={[
        styles.container,
        style,
        highlighted ? styles.highlightOn : styles.highlightOff,
      ]}
    >
      {children}
    </View>
  );
}

HighlightedCurrentUserRowContainer.defaultProps = {
  style: {},
};
