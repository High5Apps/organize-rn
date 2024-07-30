import React from 'react';
import { StyleSheet, TouchableHighlight } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import useTheme from '../../../Theme';

const useStyles = () => {
  const { colors, sizes } = useTheme();

  const styles = StyleSheet.create({
    button: {
      alignItems: 'center',
      justifyContent: 'center',
      aspectRatio: 1,
      backgroundColor: colors.fill,
      borderColor: colors.primary,
      borderRadius: sizes.buttonHeight / 2,
      borderWidth: sizes.border,
      height: sizes.buttonHeight,
    },
    disabledButton: {
      borderColor: colors.labelSecondary,
    },
    disabledIcon: {
      color: colors.labelSecondary,
    },
    icon: {
      color: colors.label,
      fontSize: sizes.icon,
    },
  });

  return { colors, styles };
};

type Props = {
  disabled?: boolean;
  iconName: string;
  onPress?: () => void;
};

export default function CircleButton({ disabled, iconName, onPress }: Props) {
  const { colors, styles } = useStyles();
  return (
    <TouchableHighlight
      disabled={disabled}
      onPress={onPress}
      style={[styles.button, disabled && styles.disabledButton]}
      underlayColor={colors.fillSecondary}
    >
      <Icon
        name={iconName}
        style={[styles.icon, disabled && styles.disabledIcon]}
      />
    </TouchableHighlight>
  );
}

CircleButton.defaultProps = {
  disabled: false,
  onPress: () => undefined,
};
