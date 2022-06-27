import { Alert } from 'react-native';

type Props = {
  destructiveAction: string;
  destructiveActionInTitle?: string;
  onConfirm: () => void;
};

export default function ConfirmationAlert({
  destructiveAction, destructiveActionInTitle, onConfirm,
}: Props) {
  const actionInTitle = destructiveActionInTitle || destructiveAction;
  return {
    show: () => {
      Alert.alert(
        `Are you sure you want to ${actionInTitle}?`,
        "You can't undo this.",
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: destructiveAction,
            onPress: onConfirm,
            style: 'destructive',
          },
        ],
        { cancelable: true },
      );
    },
  };
}
