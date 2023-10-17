/* eslint-disable react/jsx-props-no-spreading */
import React, { ForwardedRef, forwardRef } from 'react';
import { StyleSheet, TextInput, TextInputProps } from 'react-native';
import useTheme from '../../Theme';

const useStyles = () => {
  const {
    colors, font, sizes, spacing,
  } = useTheme();

  const styles = StyleSheet.create({
    textInput: {
      backgroundColor: colors.fill,
      borderBottomColor: colors.separator,
      borderBottomWidth: sizes.separator,
      color: colors.label,
      height: sizes.buttonHeight,
      fontFamily: font.weights.regular,
      fontSize: font.sizes.body,
      paddingHorizontal: spacing.m,
      paddingVertical: spacing.s,
    },
  });

  return { colors, styles };
};

function TextInputRow(props: TextInputProps, ref: ForwardedRef<TextInput>) {
  const { style } = props;

  const { colors, styles } = useStyles();

  const defaultProps = {
    autoFocus: true,
    placeholderTextColor: colors.labelSecondary,
    returnKeyType: 'next' as const,
    selectionColor: colors.primary,
  };

  return (
    <TextInput
      {...defaultProps}
      {...props}
      ref={ref}
      style={[styles.textInput, style]}
    />
  );
}

export default forwardRef(TextInputRow);
