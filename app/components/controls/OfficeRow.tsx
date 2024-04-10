import React from 'react';
import {
  StyleProp, StyleSheet, TouchableHighlight, View, ViewStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Office } from '../../model';
import IconRow from './IconRow';
import useTheme from '../../Theme';

const useStyles = () => {
  const { colors, spacing, sizes } = useTheme();

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      backgroundColor: colors.fill,
      flex: 1,
      flexDirection: 'row',
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
  item: Office;
  onPress?: () => void;
  selected?: boolean;
  style?: StyleProp<ViewStyle>;
  textButtonLabel?: string;
};

export default function OfficeRow({
  item: { iconName, title }, onPress, selected, style, textButtonLabel,
}: Props) {
  const { colors, styles } = useStyles();
  const hasCheckBox = selected !== undefined;
  return (
    <TouchableHighlight
      onPress={hasCheckBox ? onPress : undefined}
      underlayColor={colors.label}
    >
      <View style={styles.container}>
        {hasCheckBox && (
          <Icon
            name={selected ? 'check-box' : 'check-box-outline-blank'}
            style={styles.icon}
          />
        )}
        <IconRow
          hideDisclosureIcon={hasCheckBox}
          iconName={iconName}
          onPress={hasCheckBox ? undefined : onPress}
          style={style}
          textButtonLabel={textButtonLabel}
          title={title}
        />
      </View>
    </TouchableHighlight>
  );
}

OfficeRow.defaultProps = {
  onPress: undefined,
  selected: undefined,
  style: {},
  textButtonLabel: undefined,
};
