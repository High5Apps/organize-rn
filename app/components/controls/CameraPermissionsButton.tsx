import React from 'react';
import { StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import useTheme from '../../Theme';
import FrameButton from './FrameButton';

const useStyles = () => {
  const {
    colors, font, sizes, spacing,
  } = useTheme();

  const styles = StyleSheet.create({
    icon: {
      color: colors.primary,
      fontSize: sizes.extraLargeIcon,
      marginBottom: spacing.s,
    },
    prompt: {
      color: colors.labelSecondary,
      fontFamily: font.weights.regular,
      fontSize: font.sizes.body,
      textAlign: 'center',
    },
  });
  return { styles };
};

type Props = {
  onPress?: () => void;
};

export default function CameraPermissionsButton({ onPress }: Props) {
  const { styles } = useStyles();

  return (
    <FrameButton onPress={onPress}>
      <Icon name="qr-code-scanner" style={styles.icon} />
      <Text style={styles.prompt}>
        {'Tap to allow\ncamera access'}
      </Text>
    </FrameButton>
  );
}

CameraPermissionsButton.defaultProps = {
  onPress: () => {},
};
