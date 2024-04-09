import React from 'react';
import { PermissionItemList, ScreenBackground } from '../../components';

export default function PermissionsScreen() {
  return (
    <ScreenBackground>
      <PermissionItemList onPermissionItemPress={console.log} />
    </ScreenBackground>
  );
}
