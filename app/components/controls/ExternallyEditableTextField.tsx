import React from 'react';
import {
  StyleProp, StyleSheet, View, ViewStyle,
} from 'react-native';
import useTheme from '../../Theme';
import { TextButton } from './buttons';

const useStyles = () => {
  const { colors, font } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    text: {
      color: colors.label,
      fontSize: font.sizes.body,
      fontFamily: font.weights.regular,
    },
    textButtonEdit: {
      textAlign: 'right',
    },
    textButtonPromptContainer: {
      flex: 1,
    },
  });

  return { styles };
};

type Props = {
  disabled?: boolean;
  onPress: () => void;
  prompt: string;
  style?: StyleProp<ViewStyle>;
  value?: string;
};

export default function ExternallyEditableTextField({
  disabled, onPress, prompt, style, value,
}: Props) {
  const { styles } = useStyles();
  return (
    <View style={[styles.container, style]}>
      <TextButton
        containerStyle={styles.textButtonPromptContainer}
        disabled={!!value}
        onPress={onPress}
        style={!!value && styles.text}
      >
        {value || prompt}
      </TextButton>
      {!!value && (
        <TextButton
          disabled={disabled}
          onPress={onPress}
          style={styles.textButtonEdit}
        >
          Edit
        </TextButton>
      )}
    </View>
  );
}
