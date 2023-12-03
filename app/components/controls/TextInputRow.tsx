/* eslint-disable react/jsx-props-no-spreading */
import React, { ForwardedRef, forwardRef } from 'react';
import {
  StyleSheet, TextInput, TextInputProps, View,
} from 'react-native';
import useTheme from '../../Theme';
import IconButton from './IconButton';

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
    container: {
      alignItems: 'center',
      backgroundColor: colors.fill,
      flexDirection: 'row',
      minHeight: sizes.buttonHeight,
      paddingStart: spacing.m,
    },
    icon: {
      alignSelf: 'stretch',
      justifyContent: 'center',
      paddingStart: spacing.s,
    },
    textInput: {
      color: colors.label,
      flex: 1,
      fontFamily: font.weights.regular,
      fontSize: font.sizes.body,
    },
  });

  return { colors, styles };
};

type Props = TextInputProps & {
  iconEndDisabled?: boolean;
  iconEndName?: string;
  iconEndOnPress?: () => void;
};

const TextInputRow = forwardRef((
  props: Props,
  ref: ForwardedRef<TextInput>,
) => {
  const {
    iconEndDisabled, iconEndName, iconEndOnPress, style,
  } = props;

  const { colors, styles } = useStyles();

  const defaultProps = {
    autoFocus: true,
    placeholderTextColor: colors.labelSecondary,
    returnKeyType: 'next' as const,
    selectionColor: colors.primary,
  };

  return (
    <View style={styles.container}>
      <TextInput
        {...defaultProps}
        {...props}
        ref={ref}
        style={[styles.textInput, style]}
      />
      {iconEndName && (
        <IconButton
          disabled={iconEndDisabled}
          iconName={iconEndName}
          onPress={iconEndOnPress}
          style={styles.icon}
        />
      )}
      <View style={styles.bottomBorder} />
    </View>
  );
});

TextInputRow.defaultProps = {
  iconEndDisabled: false,
  iconEndName: undefined,
  iconEndOnPress: () => undefined,
};

export default TextInputRow;
