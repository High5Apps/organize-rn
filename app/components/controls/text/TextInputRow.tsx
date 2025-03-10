/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useRef } from 'react';
import {
  StyleProp, StyleSheet, TextInput, TextInputProps, View, ViewStyle,
} from 'react-native';
import useTheme from '../../../Theme';
import { IconButton } from '../buttons';

const useStyles = () => {
  const {
    colors, font, sizes, spacing,
  } = useTheme();

  const styles = StyleSheet.create({
    bottomBorder: {
      backgroundColor: colors.primary,
      bottom: 0,
      end: 0,
      height: sizes.border,
      position: 'absolute',
      start: spacing.m,
    },
    bottomBorderDisabled: {
      backgroundColor: colors.labelSecondary,
    },
    container: {
      backgroundColor: colors.fill,
      flexDirection: 'row',
      minHeight: sizes.buttonHeight,
      paddingStart: spacing.m,
    },
    icon: {
      justifyContent: 'center',
      paddingStart: spacing.s,
    },
    textInput: {
      color: colors.label,
      flex: 1,
      fontFamily: font.weights.regular,
      fontSize: font.sizes.body,
    },
    textInputDisabled: {
      color: colors.labelSecondary,
    },
  });

  return { colors, styles };
};

type Props = TextInputProps & {
  containerStyle?: StyleProp<ViewStyle>;
  focused?: boolean;
  iconEndDisabled?: boolean;
  iconEndName?: string;
  iconEndOnPress?: () => void;
};

export default function TextInputRow(props: Props) {
  const {
    containerStyle, editable, focused, iconEndDisabled = false, iconEndName,
    iconEndOnPress = () => undefined, style,
  } = props;

  // Can't use !editable because editable defaults to true when undefined
  const disabled = (editable === false);

  const ref = useRef<TextInput>(null);

  const { colors, styles } = useStyles();

  useEffect(() => {
    if (focused) {
      ref.current?.focus();
    }
  }, [focused]);

  const defaultProps = {
    autoFocus: true,
    placeholderTextColor: colors.labelSecondary,
    returnKeyType: 'next' as const,
    rows: 1,
    selectionColor: colors.primary,
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <TextInput
        {...defaultProps}
        {...props}
        ref={ref}
        style={[styles.textInput, disabled && styles.textInputDisabled, style]}
      />
      {iconEndName && (
        <IconButton
          disabled={iconEndDisabled}
          iconName={iconEndName}
          onPress={iconEndOnPress}
          style={styles.icon}
        />
      )}
      <View
        style={[styles.bottomBorder, disabled && styles.bottomBorderDisabled]}
      />
    </View>
  );
}
