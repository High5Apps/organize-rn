import React from 'react';
import { Office } from '../../model';
import IconRow from './IconRow';

type Props = {
  item: Office;
  onPress?: () => void;
};

export default function OfficeRow({
  item: { iconName, title }, onPress,
}: Props) {
  return <IconRow iconName={iconName} title={title} onPress={onPress} />;
}

OfficeRow.defaultProps = {
  onPress: undefined,
};
