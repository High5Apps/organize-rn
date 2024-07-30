import React, { useCallback, useMemo } from 'react';
import {
  Alert, ListRenderItemInfo, SectionList, StyleSheet,
} from 'react-native';
import {
  ConfirmationAlert, OFFICE_CATEGORIES, Office, OfficeCategory, PermissionScope,
  getOffice, toAction, useCurrentUser, usePermission, usePermissionUpdater,
} from '../../../model';
import { ItemSeparator, renderSectionHeader } from '../../views';
import { OfficeRow } from './rows';
import { usePullToRefresh, useRequestProgress } from '../../hooks';
import useTheme from '../../../Theme';

const useStyles = () => {
  const { spacing } = useTheme();

  const styles = StyleSheet.create({
    requestProgress: {
      margin: spacing.m,
    },
  });

  return { styles };
};

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

  const { styles } = useStyles();

  const sections: OfficeSection[] = useMemo(() => {
    if (!permission) { return []; }

    const offices = OFFICE_CATEGORIES.map((c) => getOffice(c));
    return [{ title: 'Officers', data: offices }];
  }, [permission]);

  const {
    RequestProgress: UnstyledRequestProgress, setLoading, setResult,
  } = useRequestProgress();
  const RequestProgress = useMemo(
    () => <UnstyledRequestProgress style={styles.requestProgress} />,
    [UnstyledRequestProgress],
  );

  const fetchPermission = async () => {
    setLoading(true);
    setResult('none');

    try {
      await refreshPermission();
    } catch (error) {
      setResult('error', { error, onPress: fetchPermission });
    }

    setLoading(false);
  };

  const { ListHeaderComponent, refreshControl, refreshing } = usePullToRefresh({
    onRefresh: fetchPermission,
    refreshOnMount: true,
  });

  const { getSelectionInfo, onRowPressed } = usePermissionUpdater({
    onSyncSelectionError, permission, updatePermission,
  });

  const wrappedOnRowPress = useCallback((officeCategory: OfficeCategory) => {
    if (!currentUser) { return; }

    const { selected } = getSelectionInfo(officeCategory);

    const { offices } = currentUser;
    const officeCategories = offices.map((office) => office.type);

    if (selected && officeCategories.includes(officeCategory)) {
      const scopeAction = toAction(scope);
      ConfirmationAlert({
        destructiveAction: 'Remove',
        destructiveActionInTitle: 'remove this permission',
        onConfirm: () => onRowPressed(officeCategory),
        subtitle: `If you remove this permission from yourself, you won't be able to ${scopeAction} anymore.`,
      }).show();
    } else {
      onRowPressed(officeCategory);
    }
  }, [currentUser, getSelectionInfo, onRowPressed]);

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
      ListEmptyComponent={RequestProgress}
      ListHeaderComponent={ListHeaderComponent}
      refreshControl={refreshControl}
      refreshing={refreshing}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      sections={sections}
    />
  );
}
