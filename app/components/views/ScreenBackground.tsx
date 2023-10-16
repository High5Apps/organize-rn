import React, { PropsWithChildren } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useTheme from '../../Theme';

const useStyles = () => {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    background: {
      backgroundColor: colors.background,
      flex: 1,
    },
    pressable: {
      flex: 1,
    },
  });

  return { styles };
};

type Props = {
  onPress?: () => void;
};

export default function ScreenBackground({
  children, onPress,
}: PropsWithChildren<Props>) {
  const { styles } = useStyles();
  const insets = useSafeAreaInsets();

  return (
    <Pressable disabled={!onPress} onPress={onPress} style={styles.pressable}>
      <View
        style={[
          styles.background,
          {
            // Paddings to handle safe area
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
            paddingLeft: insets.left,
            paddingRight: insets.right,
          },
        ]}
      >
        {children}
      </View>
    </Pressable>
  );
}

ScreenBackground.defaultProps = {
  onPress: undefined,
};
