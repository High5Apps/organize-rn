import React, { useCallback } from 'react';
import { PermissionItemList, ScreenBackground } from '../../components';
import type { PermissionsScreenProps } from '../../navigation';
import type { PermissionItem } from '../../model';

export default function PermissionsScreen({
  navigation,
}: PermissionsScreenProps) {
  const onPermissionItemPress = useCallback(({ scope }: PermissionItem) => {
    navigation.navigate('Permission', { scope });
  }, [navigation]);

  return (
    <ScreenBackground>
      <PermissionItemList onPermissionItemPress={onPermissionItemPress} />
    </ScreenBackground>
  );
}
