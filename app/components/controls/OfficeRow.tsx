import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { Office } from '../../model';
import IconRow from './IconRow';

type Props = {
  item: Office;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  textButtonLabel?: string;
};

export default function OfficeRow({
  item: { iconName, title }, onPress, style, textButtonLabel,
}: Props) {
  return (
    <IconRow
      iconName={iconName}
      onPress={onPress}
      style={style}
      textButtonLabel={textButtonLabel}
      title={title}
    />
  );
}

OfficeRow.defaultProps = {
  onPress: undefined,
  style: {},
  textButtonLabel: undefined,
};
