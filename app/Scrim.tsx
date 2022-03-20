import React, { PropsWithChildren } from 'react';
import {
  Pressable, StyleProp, StyleSheet, ViewStyle,
} from 'react-native';

const useStyles = () => {
  const styles = StyleSheet.create({
    scrim: {
      backgroundColor: 'rgba(0,0,0,0.4)',
      flex: 1,
    },
  });

  return { styles };
};

type Props = {
  onPress?: () => void;
  style?: StyleProp<ViewStyle>
};

export default function Scrim({
  children, onPress, style,
}: PropsWithChildren<Props>) {
  const { styles } = useStyles();
  return (
    <Pressable
      onPress={onPress}
      style={[styles.scrim, style]}
    >
      {/* This masks out the parent's onPress */}
      <Pressable>
        {children}
      </Pressable>
    </Pressable>
  );
}

Scrim.defaultProps = {
  onPress: () => {},
  style: {},
};
