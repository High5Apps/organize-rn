import React, { PropsWithChildren } from 'react';
import {
  ColorValue,
  StyleProp, StyleSheet, View, ViewStyle,
} from 'react-native';
import useTheme from '../../Theme';

const useStyles = (color: ColorValue, width: number) => {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.fill,
      flexDirection: 'row',
      paddingEnd: width,
    },
    highlightOff: {
      paddingStart: width,
    },
    highlightOn: {
      borderColor: color,
      borderStartWidth: width,
    },
  });

  return { styles };
};

type Props = {
  color: ColorValue;
  highlighted: boolean;
  style?: StyleProp<ViewStyle>;
  width: number;
};

export default function HighlightedRowContainer({
  children, color, highlighted, style = {}, width,
}: PropsWithChildren<Props>) {
  const { styles } = useStyles(color, width);

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
