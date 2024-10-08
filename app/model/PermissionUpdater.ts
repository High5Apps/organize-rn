import { useCallback, useMemo } from 'react';
import { useCurrentUser } from './context';
import useSelectionUpdater from './SelectionUpdater';
import { OFFICE_CATEGORIES, OfficeCategory, Permission } from './types';

// This is needed because OFFICE_CATEGORIES is readonly
const choices = [...OFFICE_CATEGORIES];

type Props = {
  onSyncSelectionError: (errorMessage: string) => void;
  permission?: Permission;
  updatePermission: ({ offices }: { offices: OfficeCategory[] }) => Promise<void>;
};

export default function usePermissionUpdater({
  onSyncSelectionError, permission, updatePermission,
}: Props) {
  const initialSelection = useMemo(
    () => permission?.data.offices,
    [permission],
  );

  const { currentUser } = useCurrentUser();

  const onSyncSelection = useCallback(async (officeCategories: string[]) => (
    updatePermission({ offices: officeCategories as OfficeCategory[] })
  ), [currentUser, updatePermission]);

  const {
    getSelectionInfo, onRowPressed,
  } = useSelectionUpdater({
    choices,
    initialSelection,
    maxSelections: OFFICE_CATEGORIES.length,
    onSyncSelection,
    onSyncSelectionError,
  });

  return { getSelectionInfo, onRowPressed };
}
