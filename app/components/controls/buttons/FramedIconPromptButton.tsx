import React from 'react';
import { StyleSheet } from 'react-native';
import useTheme from '../../../Theme';
import { IconPrompt } from '../../views';
import FrameButton from './FrameButton';

const useStyles = () => {
  const { spacing } = useTheme();

  const styles = StyleSheet.create({
    frameButton: {
      padding: spacing.s,
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
  iconName, onPress = () => {}, prompt,
}: Props) {
  const { styles } = useStyles();

  return (
    <FrameButton onPress={onPress} style={styles.frameButton}>
      <IconPrompt iconName={iconName} prompt={prompt} />
    </FrameButton>
  );
}
