import React, { useCallback, useEffect, useMemo } from 'react';
import {
  Alert, ListRenderItemInfo, SectionList, StyleSheet,
} from 'react-native';
import {
  GENERIC_ERROR_MESSAGE, OFFICE_CATEGORIES, Office, PermissionScope, getOffice,
  usePermission, usePermissionUpdater,
} from '../../model';
import { ItemSeparator, renderSectionHeader } from '../views';
import OfficeRow from './OfficeRow';
import { useRequestProgress } from '../hooks';
import useTheme from '../../Theme';

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
    } catch (e) {
      console.error(e);
      setResult('error', {
        message: GENERIC_ERROR_MESSAGE,
        onPress: fetchPermission,
      });
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchPermission();
  }, []);

  const { getSelectionInfo, onRowPressed } = usePermissionUpdater({
    onSyncSelectionError, permission, updatePermission,
  });

  const renderItem = useCallback(
    ({ item: office }: ListRenderItemInfo<Office>) => {
      const {
        disabled, selected, showDisabled,
      } = getSelectionInfo(office.type);
      return (
        <OfficeRow
          disabled={disabled}
          item={office}
          onPress={() => onRowPressed(office.type)}
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
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      sections={sections}
    />
  );
}
