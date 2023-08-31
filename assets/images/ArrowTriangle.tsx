import React from 'react';
import {
  ColorValue, StyleProp, StyleSheet, ViewStyle,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

const useStyles = () => {
  const styles = StyleSheet.create({
    flip: {
      transform: [{ scaleY: -1 }],
    },
  });

  return { styles };
};

type Props = {
  color: ColorValue;
  fill?: boolean;
  flip?: boolean;
  style?: StyleProp<ViewStyle>;
};

function ArrowTriangle({
  color, fill, flip, style,
}: Props) {
  const { styles } = useStyles();

  return (
    <Svg
      style={[
        flip && styles.flip,
        StyleSheet.flatten(style),
      ]}
      viewBox="0 0 42.15234375 38.349609375"
    >
      { fill ? (
        <Path
          fill={color}
          d="M37.77 35.063c0-.43-.15-.731-.43-1.29L22.58 3.03c-.365-.752-.816-1.181-1.504-1.181-.687 0-1.139.43-1.504 1.181L4.812 33.773c-.279.559-.43.86-.43 1.29 0 .859.624 1.439 1.698 1.439h29.992c1.074 0 1.698-.58 1.698-1.44Z"
        />
      ) : (
        <Path
          stroke={color}
          d="M37.77 35.063c0-.43-.15-.731-.43-1.29L22.58 3.03c-.365-.752-.816-1.181-1.504-1.181-.687 0-1.139.43-1.504 1.181L4.812 33.773c-.279.559-.43.86-.43 1.29 0 .859.624 1.439 1.698 1.439h29.992c1.074 0 1.698-.58 1.698-1.44Zm-1.096-.086c0 .279-.215.472-.666.472H6.145c-.473 0-.666-.193-.666-.472 0-.237.107-.43.214-.645l14.653-30.68c.15-.279.386-.623.73-.623.322 0 .58.344.73.623l14.653 30.68c.107.215.215.408.215.645Z"
        />
      )}
    </Svg>
  );
}

ArrowTriangle.defaultProps = {
  fill: false,
  flip: false,
  style: {},
};

export default ArrowTriangle;
