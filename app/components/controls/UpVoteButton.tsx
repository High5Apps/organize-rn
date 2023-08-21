import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import useTheme from '../../Theme';
import { ArrowTriangle } from '../../../assets';

const activeButtonOpacity = 0.5;

const useStyles = (buttonSize: number) => {
  const { spacing } = useTheme();

  const arrowSize = buttonSize - spacing.m;

  const styles = StyleSheet.create({
    arrow: {
      height: arrowSize,
      width: arrowSize,
    },
    button: {
      alignItems: 'center',
      justifyContent: 'center',
      height: buttonSize,
    },
  });

  return { styles };
};

type Props = {
  buttonSize: number;
  fill?: boolean;
  flip?: boolean;
  onPress?: () => void;
};

export default function UpVoteButton({
  buttonSize, fill, flip, onPress,
}: Props) {
  const { styles } = useStyles(buttonSize);

  return (
    <TouchableOpacity
      activeOpacity={activeButtonOpacity}
      onPress={onPress}
      style={styles.button}
    >
      <ArrowTriangle fill={fill} flip={flip} style={styles.arrow} />
    </TouchableOpacity>
  );
}

UpVoteButton.defaultProps = {
  fill: false,
  flip: false,
  onPress: () => {},
};
