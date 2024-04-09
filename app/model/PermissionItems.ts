export type PermissionScope = 'editPermissions';

export type PermissionItem = {
  iconName: string;
  scope: PermissionScope;
  title: string;
};

const permissionItems: PermissionItem[] = [{
  iconName: 'lock-open',
  scope: 'editPermissions',
  title: 'Edit permissions',
}];

export default permissionItems;
