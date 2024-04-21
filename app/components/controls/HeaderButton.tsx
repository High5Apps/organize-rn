import React, { useCallback, useLayoutEffect } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import IconButton from './IconButton';

type Props = {
  hidden?: boolean;
  iconName: string;
  navigation: NativeStackNavigationProp<any>;
  onPress: () => void;
};

export default function useHeaderButton({
  hidden, iconName, navigation, onPress,
}: Props) {
  const headerRight = useCallback(() => (hidden ? undefined : (
    <IconButton iconName={iconName} onPress={onPress} />
  )), [hidden, iconName, onPress]);

  useLayoutEffect(() => {
    navigation.setOptions({ headerRight });
  }, [headerRight, navigation.setOptions]);
}
