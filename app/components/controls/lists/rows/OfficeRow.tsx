import React from 'react';
import {
  StyleProp, StyleSheet, TouchableHighlight, View, ViewStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Office } from '../../../../model';
import IconRow from './IconRow';
import useTheme from '../../../../Theme';

const useStyles = () => {
  const {
    colors, opacity, spacing, sizes,
  } = useTheme();

  const styles = StyleSheet.create({
    checkBoxHighlightFix: {
      // This fixes an Android issue where the OfficeRow tap highlight only
      // showed up on the checkbox part of the row
      backgroundColor: 'transparent',
    },
    container: {
      alignItems: 'center',
      backgroundColor: colors.fill,
      flex: 1,
      flexDirection: 'row',
    },
    disabled: {
      opacity: opacity.disabled,
    },
    icon: {
      color: colors.primary,
      fontSize: sizes.mediumIcon,
      paddingStart: spacing.m,
    },
  });

  return { colors, styles };
};

type Props = {
  disabled?: boolean;
  item: Office;
  onPress?: () => void;
  selected?: boolean;
  showCheckBoxDisabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textButtonLabel?: string;
};

export default function OfficeRow({
  disabled, item: { iconName, title }, onPress, selected, showCheckBoxDisabled,
  style = {}, textButtonLabel,
}: Props) {
  const { colors, styles } = useStyles();
  const hasCheckBox = selected !== undefined;
  return (
    <TouchableHighlight
      disabled={disabled}
      onPress={hasCheckBox ? onPress : undefined}
      underlayColor={colors.label}
    >
      <View style={styles.container}>
        {hasCheckBox && (
          <Icon
            name={selected ? 'check-box' : 'check-box-outline-blank'}
            style={[styles.icon, showCheckBoxDisabled && styles.disabled]}
          />
        )}
        <IconRow
          hideDisclosureIcon={hasCheckBox}
          iconName={iconName}
          onPress={hasCheckBox ? undefined : onPress}
          style={[hasCheckBox && styles.checkBoxHighlightFix, style]}
          textButtonLabel={textButtonLabel}
          title={title}
        />
      </View>
    </TouchableHighlight>
  );
}
