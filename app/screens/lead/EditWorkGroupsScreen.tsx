import React from 'react';
import { ScreenBackground, WorkGroupList } from '../../components';
import type { EditWorkGroupsScreenProps } from '../../navigation';

export default function EditWorkGroupsScreen({
  navigation,
}: EditWorkGroupsScreenProps) {
  return (
    <ScreenBackground>
      <WorkGroupList
        onWorkGroupPress={({ id }) => navigation.navigate('EditWorkGroup', {
          workGroupId: id,
        })}
        showRowDisclosureIcons
      />
    </ScreenBackground>
  );
}
