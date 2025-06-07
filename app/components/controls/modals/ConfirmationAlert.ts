import { Alert } from 'react-native';
import i18n from '../../../i18n';

type Props = {
  destructiveAction: string;
  destructiveButtonStyle?: 'default' | 'destructive';
  message: string;
  onConfirm: () => void;
};

export default function ConfirmationAlert({
  destructiveAction, destructiveButtonStyle, message, onConfirm,
}: Props) {
  const title = i18n.t('question.confirmation');
  return {
    show: () => {
      Alert.alert(
        title,
        message,
        [
          { text: i18n.t('action.cancel'), style: 'cancel' },
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
