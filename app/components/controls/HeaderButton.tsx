import React, { useCallback, useLayoutEffect } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import IconButton from './IconButton';

type Props = {
  iconName: string;
  navigation: NativeStackNavigationProp<any>;
  onPress: () => void;
};

export default function useHeaderButton({
  iconName, navigation, onPress,
}: Props) {
  const headerRight = useCallback(() => (
    <IconButton iconName={iconName} onPress={onPress} />
  ), [iconName, onPress]);

  useLayoutEffect(() => {
    navigation.setOptions({ headerRight });
  }, [navigation.setOptions]);
}
