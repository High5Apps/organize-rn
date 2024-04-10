import React, { useCallback, useEffect, useMemo } from 'react';
import { ListRenderItemInfo, SectionList, StyleSheet } from 'react-native';
import {
  GENERIC_ERROR_MESSAGE, OFFICE_CATEGORIES, Office, OfficeCategory,
  PermissionScope, getOffice, usePermission,
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

type OfficePermission = {
  hasPermission: boolean;
  office: Office;
};

type OfficeSection = {
  title: string;
  data: OfficePermission[];
};

type Props = {
  scope: PermissionScope;
};

export default function OfficePermissionList({ scope }: Props) {
  const { permission, refreshPermission } = usePermission({ scope });

  const { styles } = useStyles();

  const sections: OfficeSection[] = useMemo(() => {
    if (!permission) { return []; }

    const hasPermission = (category: OfficeCategory) => (
      !!permission.data.offices.find((office) => office.type === category)
    );
    const officePermissions = OFFICE_CATEGORIES.map((category) => ({
      hasPermission: hasPermission(category),
      office: getOffice(category),
    }));
    return [{ title: 'Officers', data: officePermissions }];
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

  const renderItem = useCallback(
    ({ item: { hasPermission, office } }: ListRenderItemInfo<OfficePermission>) => (
      <OfficeRow
        item={office}
        onPress={() => console.log('press')}
        selected={hasPermission}
      />
    ),
    [],
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
