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
      borderColor: colors.primary,
      borderWidth: sizes.border,
      borderRadius: spacing.s,
      color: colors.label,
      height: 150,
      fontFamily: font.weights.regular,
      fontSize: font.sizes.body,
      paddingHorizontal: spacing.m,

      // Must use bottom and top instead of vertical due to a known issue
      // https://github.com/facebook/react-native/issues/21720#issuecomment-532642093
      paddingBottom: spacing.s,
      paddingTop: spacing.s,

      textAlignVertical: 'top',
    },
    textInputDisabled: {
      borderColor: colors.labelSecondary,
      color: colors.labelSecondary,
    },
  });

  return { colors, styles };
};

function MultilineTextInput(props: TextInputProps, ref: ForwardedRef<TextInput>) {
  const { editable, style } = props;

  // Can't use !editable because editable defaults to true when undefined
  const disabled = (editable === false);

  const { colors, styles } = useStyles();

  const defaultProps = {
    placeholderTextColor: colors.labelSecondary,
    returnKeyType: 'next' as const,
    selectionColor: colors.primary,
  };

  return (
    <TextInput
      {...defaultProps}
      {...props}
      multiline
      ref={ref}
      style={[styles.textInput, disabled && styles.textInputDisabled, style]}
    />
  );
}

export default forwardRef(MultilineTextInput);
