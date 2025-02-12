import React from 'react';
import { ListRenderItemInfo, SectionList } from 'react-native';
import { SettingsItem, useSettings } from '../../../model';
import { ItemSeparator } from '../../views';
import { SettingsRow } from './rows';
import { renderSectionHeader } from '../SectionHeader';

function renderItem({ item }: ListRenderItemInfo<SettingsItem>) {
  return <SettingsRow item={item} />;
}

export default function SettingsList() {
  const settings = useSettings();

  return (
    <SectionList
      ItemSeparatorComponent={ItemSeparator}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      sections={settings}
    />
  );
}
