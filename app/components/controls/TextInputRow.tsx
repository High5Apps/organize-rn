/* eslint-disable react/jsx-props-no-spreading */
import React, { ForwardedRef, forwardRef } from 'react';
import {
  StyleSheet, TextInput, TextInputProps, View,
} from 'react-native';
import useTheme from '../../Theme';

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
    textInput: {
      backgroundColor: colors.fill,
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
    <View>
      <TextInput
        {...defaultProps}
        {...props}
        ref={ref}
        style={[styles.textInput, style]}
      />
      <View style={styles.bottomBorder} />
    </View>
  );
}

export default forwardRef(TextInputRow);
