import React, { useCallback, useLayoutEffect } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import IconButton from './IconButton';

type Props = {
  disabled?: boolean;
  hidden?: boolean;
  iconName: string;
  navigation: NativeStackNavigationProp<any>;
  onPress: () => void;
};

export default function useHeaderButton({
  disabled, hidden, iconName, navigation, onPress,
}: Props) {
  const headerRight = useCallback(() => (hidden ? undefined : (
    <IconButton disabled={disabled} iconName={iconName} onPress={onPress} />
  )), [disabled, hidden, iconName, onPress]);

  useLayoutEffect(() => {
    navigation.setOptions({ headerRight });
  }, [headerRight, navigation.setOptions]);
}
