import React from 'react';
import { ListRenderItemInfo, SectionList } from 'react-native';
import { SettingsItem, useSettings } from '../../../model';
import { ItemSeparator, renderSectionHeader } from '../../views';
import { SettingsRow } from './rows';

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
