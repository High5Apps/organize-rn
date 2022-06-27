import { Dispatch, SetStateAction } from 'react';
import ConfirmationAlert from './ConfirmationAlert';
import type { SettingsSection } from './types';
import { UserType } from './User';

type Props = {
  setCurrentUser: Dispatch<SetStateAction<UserType | null>>;
};

export default function Settings({ setCurrentUser }: Props): SettingsSection[] {
  return [
    {
      title: 'Org',
      data: [
        {
          iconName: 'delete',
          onPress: ConfirmationAlert({
            destructiveAction: 'Leave Org',
            destructiveActionInTitle: 'leave this Org',
            onConfirm: () => setCurrentUser(null),
          }).show,
          title: 'Leave Org',
        },
      ],
    },
  ];
}
