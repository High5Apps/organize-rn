import React from 'react';
import type { PermissionScreenProps } from '../../navigation';
import { OfficePermissionList, ScreenBackground } from '../../components';

export default function PermissionScreen({ route }: PermissionScreenProps) {
  const { scope } = route.params;

  return (
    <ScreenBackground>
      <OfficePermissionList scope={scope} />
    </ScreenBackground>
  );
}
