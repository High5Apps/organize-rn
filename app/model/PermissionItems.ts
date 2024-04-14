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
    iconName: 'lock-open',
    scope: 'editPermissions',
    title: 'Edit permissions',
  },
];

export default permissionItems;
