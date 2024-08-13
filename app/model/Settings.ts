import { useMemo } from 'react';
import { Share } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ENABLE_DEVELOPER_SETTINGS } from './Config';
import { useCurrentUser } from './context';
import { SettingsSection } from './types';
import type { SettingsScreenNavigationProp } from '../navigation';

export default function useSettings(): SettingsSection[] {
  const { currentUser } = useCurrentUser();
  const navigation = useNavigation<SettingsScreenNavigationProp>();

  if (!currentUser) {
    console.warn('Expected current user to be set');
    return [];
  }

  return useMemo(() => {
    const settings = [
      {
        title: 'Org',
        data: [
          {
            iconName: 'delete',
            onPress: () => navigation.navigate('LeaveOrg'),
            title: 'Leave Org',
          },
          {
            iconName: 'visibility',
            onPress: () => navigation.navigate('TransparencyLog'),
            title: 'Transparency Log',
          },
        ],
      },
    ];

    if (ENABLE_DEVELOPER_SETTINGS) {
      settings.push({
        title: 'Developer',
        data: [
          {
            iconName: 'vpn-key',
            onPress: async () => {
              const groupKey = await currentUser.decryptGroupKey();
              Share.share({ message: groupKey });
            },
            title: 'Share Group Key',
          },
        ],
      });
    }

    return settings;
  }, [currentUser, ENABLE_DEVELOPER_SETTINGS]);
}
