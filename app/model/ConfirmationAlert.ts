import { Alert } from 'react-native';

type Props = {
  destructiveAction: string;
  destructiveActionInTitle?: string;
  destructiveButtonStyle?: 'default' | 'destructive';
  onConfirm: () => void;
};

export default function ConfirmationAlert({
  destructiveAction, destructiveActionInTitle, destructiveButtonStyle,
  onConfirm,
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
            style: destructiveButtonStyle ?? 'destructive',
          },
        ],
        { cancelable: true },
      );
    },
  };
}
