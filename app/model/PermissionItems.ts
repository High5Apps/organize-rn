import { useTranslation } from '../i18n';
import type { PermissionScope } from './types';

export type PermissionItem = {
  iconName: string;
  scope: PermissionScope;
  title: string;
};

export default function usePermissionItems() {
  const { t } = useTranslation();
  const permissionItems: PermissionItem[] = [
    {
      iconName: 'no-accounts',
      scope: 'blockMembers',
      title: t('action.blockMember', { count: 100 }),
    },
    {
      iconName: 'how-to-reg',
      scope: 'createElections',
      title: t('action.createElections'),
    },
    {
      iconName: 'edit-document',
      scope: 'editOrg',
      title: t('action.editOrgInfo'),
    },
    {
      iconName: 'lock-open',
      scope: 'editPermissions',
      title: t('action.editPermissions'),
    },
    {
      iconName: 'groups',
      scope: 'editWorkGroups',
      title: t('action.editWorkGroup', { count: 100 }),
    },
    {
      iconName: 'gavel',
      scope: 'moderate',
      title: t('action.moderate'),
    },
    {
      iconName: 'badge',
      scope: 'viewUnionCards',
      title: t('action.viewUnionCards'),
    },
  ];

  function findByScope(scope: string) {
    return permissionItems.find((item) => item.scope === scope);
  }

  return { findByScope, permissionItems };
}
