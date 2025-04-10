import React from 'react';
import { ScreenBackground, WorkGroupList } from '../../components';

export default function EditWorkGroupsScreen() {
  return (
    <ScreenBackground>
      <WorkGroupList onWorkGroupPress={console.log} showRowDisclosureIcons />
    </ScreenBackground>
  );
}
