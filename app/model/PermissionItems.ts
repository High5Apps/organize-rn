import type { PermissionScope } from './types';

export type PermissionItem = {
  iconName: string;
  scope: PermissionScope;
  title: string;
};

const permissionItems: PermissionItem[] = [
  {
    iconName: 'no-accounts',
    scope: 'blockMembers',
    title: 'Block members',
  },
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
  {
    iconName: 'gavel',
    scope: 'moderate',
    title: 'Moderate',
  },
  {
    iconName: 'badge',
    scope: 'viewUnionCards',
    title: 'View union cards',
  },
];

export default permissionItems;

export function toAction(scope?: PermissionScope): string {
  const permissionItem = permissionItems.find(
    (item) => item.scope === scope,
  );
  const itemTitle = permissionItem?.title ?? 'do this';
  return `${itemTitle[0].toLocaleLowerCase()}${itemTitle.slice(1)}`;
}
