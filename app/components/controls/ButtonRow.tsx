import React, { PropsWithChildren } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import useTheme from '../../Theme';

const useStyles = () => {
  const { colors, sizes, spacing } = useTheme();

  const styles = StyleSheet.create({
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.s,
      paddingBottom: spacing.m,
      paddingTop: spacing.s,
    },
    elevated: {
      backgroundColor: colors.background,
      borderTopColor: colors.separator,
      borderTopWidth: sizes.separator,
    },
  });

  return { styles };
};

type Props = {
  elevated?: boolean;
  style?: ViewStyle;
};

export default function ButtonRow({
  children, elevated, style,
}: PropsWithChildren<Props>) {
  const { styles } = useStyles();

  return (
    <View
      style={[
        styles.buttonRow,
        style,
        elevated && styles.elevated,
      ]}
    >
      {children}
    </View>
  );
}

ButtonRow.defaultProps = {
  elevated: false,
  style: {},
};
