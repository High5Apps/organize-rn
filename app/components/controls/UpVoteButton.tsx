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
    waitingForResponse: {
      opacity: activeButtonOpacity,
    },
  });

  return { primary, styles };
};

type Props = {
  buttonStyle?: StyleProp<ViewStyle>;
  fill?: boolean;
  flip?: boolean;
  onPress?: () => void;
  waitingForResponse?: boolean;
};

export default function UpVoteButton({
  buttonStyle, fill, flip, onPress, waitingForResponse,
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
        style={[
          styles.arrow,
          waitingForResponse && styles.waitingForResponse,
        ]}
      />
    </TouchableOpacity>
  );
}

UpVoteButton.defaultProps = {
  buttonStyle: {},
  fill: false,
  flip: false,
  onPress: () => {},
  waitingForResponse: false,
};
