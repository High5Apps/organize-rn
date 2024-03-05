import { useMemo } from 'react';
import { Share } from 'react-native';
import { ENABLE_DEVELOPER_SETTINGS } from './Config';
import ConfirmationAlert from './ConfirmationAlert';
import useCurrentUser from './CurrentUser';
import { SettingsSection } from './types';

export default function useSettings(): SettingsSection[] {
  const { currentUser } = useCurrentUser();

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
            onPress: ConfirmationAlert({
              destructiveAction: 'Leave Org',
              destructiveActionInTitle: 'leave this Org',
              onConfirm: currentUser.logOut,
            }).show,
            title: 'Leave Org',
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
