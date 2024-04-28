import { Alert } from 'react-native';

type Props = {
  destructiveAction: string;
  destructiveActionInTitle?: string;
  destructiveButtonStyle?: 'default' | 'destructive';
  onConfirm: () => void;
  subtitle?: string | null;
  title?: string;
};

export default function ConfirmationAlert({
  destructiveAction, destructiveActionInTitle, destructiveButtonStyle,
  onConfirm, subtitle: maybeSubtitle, title: maybeTitle,
}: Props) {
  const actionInTitle = destructiveActionInTitle || destructiveAction;
  const title = maybeTitle ?? `Are you sure you want to ${actionInTitle}?`;

  let subtitle: string | undefined;
  if (maybeSubtitle === undefined) {
    subtitle = "You can't undo this.";
  } else if (maybeSubtitle === null) {
    subtitle = undefined;
  } else {
    subtitle = maybeSubtitle;
  }

  return {
    show: () => {
      Alert.alert(
        title,
        subtitle,
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
