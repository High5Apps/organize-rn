import ConfirmationAlert from './ConfirmationAlert';
import { useUserContext } from './UserContext';
import { isCurrentUserData, type SettingsSection } from './types';

export default function useSettings(): SettingsSection[] {
  const { currentUser, logOut } = useUserContext();

  if (!isCurrentUserData(currentUser)) {
    console.warn('Expected current user to be set');
    return [];
  }

  return [
    {
      title: 'Org',
      data: [
        {
          iconName: 'delete',
          onPress: ConfirmationAlert({
            destructiveAction: 'Leave Org',
            destructiveActionInTitle: 'leave this Org',
            onConfirm: logOut,
          }).show,
          title: 'Leave Org',
        },
      ],
    },
  ];
}
