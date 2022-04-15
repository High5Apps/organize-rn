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
    frameButton: {
      padding: spacing.s,
    },
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
  iconName: string;
  onPress?: () => void;
  prompt: string;
};

export default function FramedIconPromptButton({
  iconName, onPress, prompt,
}: Props) {
  const { styles } = useStyles();

  return (
    <FrameButton onPress={onPress} style={styles.frameButton}>
      <Icon name={iconName} style={styles.icon} />
      <Text style={styles.prompt}>
        {prompt}
      </Text>
    </FrameButton>
  );
}

FramedIconPromptButton.defaultProps = {
  onPress: () => {},
};
