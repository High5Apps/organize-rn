import React, { useMemo } from 'react';
import {
  ListEmptyMessage, ScreenBackground, WorkGroupList,
} from '../../components';
import type { EditWorkGroupsScreenProps } from '../../navigation';
import { useTranslation } from '../../i18n';

export default function EditWorkGroupsScreen({
  navigation,
}: EditWorkGroupsScreenProps) {
  const { t } = useTranslation();

  const ListEmptyComponent = useMemo(() => (
    <ListEmptyMessage asteriskDelimitedMessage={t('hint.emptyWorkGroups')} />
  ), [t]);

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
