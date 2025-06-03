import React, { useCallback, useLayoutEffect } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import IconButton from './IconButton';

type Props = {
  disabled?: boolean;
  hidden?: boolean;
  iconName: string;
  left?: boolean;
  navigation: NativeStackNavigationProp<any>;
  onPress: () => void;
};

export default function useHeaderButton({
  disabled, hidden, iconName, left, navigation, onPress,
}: Props) {
  const button = useCallback(() => (hidden ? undefined : (
    <IconButton disabled={disabled} iconName={iconName} onPress={onPress} />
  )), [disabled, hidden, iconName, onPress]);

  useLayoutEffect(() => {
    const options = left ? { headerLeft: button } : { headerRight: button };
    navigation.setOptions(options);
  }, [button, left, navigation.setOptions]);
}
