import type { PermissionScope } from './types';

export type PermissionItem = {
  iconName: string;
  scope: PermissionScope;
  title: string;
};

const permissionItems: PermissionItem[] = [
  {
    iconName: 'how-to-reg',
    scope: 'createElections',
    title: 'Create elections',
  },
  {
    iconName: 'edit-document',
    scope: 'editOrg',
    title: 'Edit Org info',
  },
  {
    iconName: 'lock-open',
    scope: 'editPermissions',
    title: 'Edit permissions',
  },
];

export default permissionItems;
