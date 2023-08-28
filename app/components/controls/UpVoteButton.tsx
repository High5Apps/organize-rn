import React from 'react';
import {
  StyleProp, StyleSheet, TouchableOpacity, ViewStyle,
} from 'react-native';
import { ArrowTriangle } from '../../../assets';
import useTheme from '../../Theme';

const activeButtonOpacity = 0.5;

const useStyles = () => {
  const { colors: { primary }, sizes } = useTheme();

  const styles = StyleSheet.create({
    arrow: {
      height: sizes.mediumIcon,
      width: sizes.mediumIcon,
    },
    button: {
      alignItems: 'center',
    },
  });

  return { primary, styles };
};

type Props = {
  buttonStyle?: StyleProp<ViewStyle>;
  fill?: boolean;
  flip?: boolean;
  onPress?: () => void;
};

export default function UpVoteButton({
  buttonStyle, fill, flip, onPress,
}: Props) {
  const { primary, styles } = useStyles();

  return (
    <TouchableOpacity
      activeOpacity={activeButtonOpacity}
      onPress={onPress}
      style={[styles.button, buttonStyle]}
    >
      <ArrowTriangle
        color={primary}
        fill={fill}
        flip={flip}
        style={styles.arrow}
      />
    </TouchableOpacity>
  );
}

UpVoteButton.defaultProps = {
  buttonStyle: {},
  fill: false,
  flip: false,
  onPress: () => {},
};
