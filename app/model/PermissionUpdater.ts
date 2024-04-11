import { useCallback, useMemo } from 'react';
import useCurrentUser from './CurrentUser';
import useSelectionUpdater from './SelectionUpdater';
import { OFFICE_CATEGORIES, OfficeCategory, Permission } from './types';

// This is needed because OFFICE_CATEGORIES is readonly
const options = [...OFFICE_CATEGORIES];

type Props = {
  onSyncSelectionError: (errorMessage: string) => void;
  permission?: Permission;
  updatePermission: ({ offices }: { offices: OfficeCategory[] }) => Promise<void>;
};

export default function usePermissionUpdater({
  onSyncSelectionError, permission, updatePermission,
}: Props) {
  const initialSelection = useMemo(
    () => permission?.data.offices.map((o) => o.type),
    [permission],
  );

  const { currentUser } = useCurrentUser();

  const onSyncSelection = useCallback(async (officeCategories: string[]) => (
    updatePermission({ offices: officeCategories as OfficeCategory[] })
  ), [currentUser, updatePermission]);

  const {
    getSelectionInfo, onRowPressed,
  } = useSelectionUpdater({
    initialSelection,
    maxSelections: OFFICE_CATEGORIES.length,
    onSyncSelection,
    onSyncSelectionError,
    options,
  });

  return { getSelectionInfo, onRowPressed };
}
