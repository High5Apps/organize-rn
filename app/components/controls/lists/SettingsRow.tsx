import React from 'react';
import IconRow from './IconRow';
import { SettingsItem } from '../../../model';

type Props = {
  item: SettingsItem;
};

export default function SettingsRow({
  item: { iconName, onPress, title },
}: Props) {
  return <IconRow iconName={iconName} title={title} onPress={onPress} />;
}
