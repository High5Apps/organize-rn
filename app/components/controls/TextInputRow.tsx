/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useRef } from 'react';
import {
  StyleProp, StyleSheet, TextInput, TextInputProps, View, ViewStyle,
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
    containerStyle, focused, iconEndDisabled, iconEndName, iconEndOnPress,
    style,
  } = props;

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
    selectionColor: colors.primary,
  };

  return (
    <View style={[styles.container, containerStyle]}>
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
}

TextInputRow.defaultProps = {
  containerStyle: undefined,
  focused: undefined,
  iconEndDisabled: false,
  iconEndName: undefined,
  iconEndOnPress: () => undefined,
};
