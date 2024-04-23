import { useCallback, useState } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFlaggedItem } from '../../model';
import { useHeaderButton } from '../controls';

type Props = {
  navigation: NativeStackNavigationProp<any>;
  postId?: string;
};

export default function useFlagHeaderButton({ navigation, postId }: Props) {
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

  const { confirmThenCreateFlaggedItem } = useFlaggedItem({
    onSuccess, postId,
  });

  useHeaderButton({
    disabled,
    iconName: flagIconName,
    navigation,
    onPress: confirmThenCreateFlaggedItem,
  });
}
