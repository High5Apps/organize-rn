import React, { useMemo } from 'react';
import { ListEmptyMessage, ScreenBackground, WorkGroupList } from '../../components';
import type { EditWorkGroupsScreenProps } from '../../navigation';

const LIST_EMPTY_MESSAGE = 'No one has created any work groups yet.\n\nOrg members form work groups when they create and sign union cards.\n\nTo create and sign your union card, tap the **Connect tab**, then tap the **badge icon** in the **top right** corner.';

export default function EditWorkGroupsScreen({
  navigation,
}: EditWorkGroupsScreenProps) {
  const ListEmptyComponent = useMemo(() => (
    <ListEmptyMessage asteriskDelimitedMessage={LIST_EMPTY_MESSAGE} />
  ), []);

  return (
    <ScreenBackground>
      <WorkGroupList
        ListEmptyComponent={ListEmptyComponent}
        onWorkGroupPress={({ id }) => navigation.navigate('EditWorkGroup', {
          workGroupId: id,
        })}
        showRowDisclosureIcons
      />
    </ScreenBackground>
  );
}
