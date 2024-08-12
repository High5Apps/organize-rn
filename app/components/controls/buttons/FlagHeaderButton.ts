import { useCallback, useState } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import useHeaderButton from './HeaderButton';
import { FlagConfirmationAlert } from '../modals';

type Props = {
  ballotId?: string;
  hidden?: boolean;
  navigation: NativeStackNavigationProp<any>;
  postId?: string;
};

export default function useFlagHeaderButton({
  ballotId, hidden, navigation, postId,
}: Props) {
  const [flagIconName, setFlagIconName] = useState<'flag' | 'check'>('flag');
  const [disabled, setDisabled] = useState(false);

  const onSuccess = useCallback(() => {
    setFlagIconName('check');
    setDisabled(true);

    setTimeout(() => {
      setFlagIconName('flag');
      setDisabled(false);
    }, 4000);
  }, []);

  useHeaderButton({
    disabled,
    hidden,
    iconName: flagIconName,
    navigation,
    onPress: FlagConfirmationAlert({ ballotId, onSuccess, postId }).show,
  });
}
