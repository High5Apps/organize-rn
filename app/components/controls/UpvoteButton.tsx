import React from 'react';
import {
  StyleProp, StyleSheet, TouchableOpacity, ViewStyle,
} from 'react-native';
import { ArrowTriangle } from '../../../assets';
import useTheme from '../../Theme';

const useStyles = () => {
  const { colors: { primary }, opacity, sizes } = useTheme();

  const styles = StyleSheet.create({
    arrow: {
      height: sizes.mediumIcon,
      width: sizes.mediumIcon,
    },
    button: {
      alignItems: 'center',
    },
    waitingForResponse: {
      opacity: opacity.disabled,
    },
  });

  return { opacity, primary, styles };
};

type Props = {
  buttonStyle?: StyleProp<ViewStyle>;
  fill?: boolean;
  flip?: boolean;
  onPress?: () => void;
  softDisabled?: boolean;
  waitingForResponse?: boolean;
};

export default function UpvoteButton({
  buttonStyle, fill, flip, onPress, softDisabled, waitingForResponse,
}: Props) {
  const { opacity, primary, styles } = useStyles();

  // It's not possible to use TouchableOpacity's disabled prop, because then
  // arrow clicks would bubble up to the next responder. This "soft disable"
  // requires the activeOpacity modification below, so that there's no change in
  // opacity when pressing while disabled.
  const activeOpacity = softDisabled ? opacity.visible : opacity.disabled;

  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      onPress={softDisabled ? undefined : onPress}
      style={[styles.button, buttonStyle]}
      touchSoundDisabled={softDisabled}
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

UpvoteButton.defaultProps = {
  buttonStyle: {},
  fill: false,
  flip: false,
  onPress: () => {},
  softDisabled: false,
  waitingForResponse: false,
};
