import React, { useCallback, useMemo } from 'react';
import { Alert, ListRenderItemInfo, SectionList } from 'react-native';
import {
  OFFICE_CATEGORIES, Office, OfficeCategory, PermissionScope, getOffice,
  useCurrentUser, usePermission, usePermissionUpdater,
} from '../../../model';
import { ItemSeparator } from '../../views';
import { OfficeRow } from './rows';
import usePullToRefresh from './PullToRefresh';
import { ConfirmationAlert } from '../modals';
import { renderSectionHeader } from '../SectionHeader';
import { useTranslation } from '../../../i18n';

const onSyncSelectionError = (errorMessage: string) => {
  console.error(errorMessage);
  Alert.alert('Failed to update the permission', errorMessage);
};

type OfficeSection = {
  title: string;
  data: Office[];
};

type Props = {
  scope: PermissionScope;
};

export default function OfficePermissionList({ scope }: Props) {
  const {
    permission, refreshPermission, updatePermission,
  } = usePermission({ scope });
  const { currentUser } = useCurrentUser();

  const { t } = useTranslation();

  const sections: OfficeSection[] = useMemo(() => {
    if (!permission) { return []; }

    const offices = OFFICE_CATEGORIES.map((c) => getOffice(c));
    return [{ title: t('object.officers'), data: offices }];
  }, [permission]);

  const { ListHeaderComponent, refreshControl, refreshing } = usePullToRefresh({
    onRefresh: refreshPermission,
    refreshOnMount: true,
  });

  const { getSelectionInfo, onRowPressed } = usePermissionUpdater({
    onSyncSelectionError, permission, updatePermission,
  });

  const wrappedOnRowPress = useCallback((officeCategory: OfficeCategory) => {
    if (!currentUser) { return; }

    const { selected } = getSelectionInfo(officeCategory);

    const { offices: officeCategories } = currentUser;

    if (selected && officeCategories.includes(officeCategory)) {
      ConfirmationAlert({
        destructiveAction: t('action.remove'),
        destructiveActionInTitle: 'remove this permission',
        onConfirm: () => onRowPressed(officeCategory),
        subtitle: t('explanation.warning.removeSelfPermission'),
      }).show();
    } else {
      onRowPressed(officeCategory);
    }
  }, [currentUser, getSelectionInfo, onRowPressed, t]);

  const renderItem = useCallback(
    ({ item: office }: ListRenderItemInfo<Office>) => {
      const {
        disabled, selected, showDisabled,
      } = getSelectionInfo(office.type);
      return (
        <OfficeRow
          disabled={disabled}
          item={office}
          onPress={() => wrappedOnRowPress(office.type)}
          selected={selected}
          showCheckBoxDisabled={showDisabled}
        />
      );
    },
    [getSelectionInfo, onRowPressed],
  );

  return (
    <SectionList
      ItemSeparatorComponent={ItemSeparator}
      ListHeaderComponent={ListHeaderComponent}
      refreshControl={refreshControl}
      refreshing={refreshing}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      sections={sections}
    />
  );
}
