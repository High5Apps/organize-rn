import ConfirmationAlert from './ConfirmationAlert';
import type { SettingsSection } from './types';

type Props = {
  logOut: () => Promise<void>;
};

export default function Settings({ logOut }: Props): SettingsSection[] {
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
