import React, { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import useTheme from '../../Theme';

const useStyles = () => {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    background: {
      backgroundColor: colors.background,
      flex: 1,
    },
  });

  return { styles };
};

export default function ScreenBackground({ children }: PropsWithChildren<{}>) {
  const { styles } = useStyles();
  return <View style={styles.background}>{children}</View>;
}
