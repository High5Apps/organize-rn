import React from 'react';
import { Office } from '../../model';
import IconRow from './IconRow';

type Props = {
  item: Office;
  onPress?: () => void;
  textButtonLabel?: string;
};

export default function OfficeRow({
  item: { iconName, title }, onPress, textButtonLabel,
}: Props) {
  return (
    <IconRow
      iconName={iconName}
      onPress={onPress}
      textButtonLabel={textButtonLabel}
      title={title}
    />
  );
}

OfficeRow.defaultProps = {
  onPress: undefined,
  textButtonLabel: undefined,
};
