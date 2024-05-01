import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OrgScreen, SettingsScreen } from '../screens';
import { OrgStackParamList } from './types';
import useDefaultStackNavigatorOptions from './DefaultStackNavigatorOptions';
import { useCurrentUser } from '../model';

const Stack = createNativeStackNavigator<OrgStackParamList>();

export default function OrgStack() {
  const screenOptions = useDefaultStackNavigatorOptions();

  const { currentUser } = useCurrentUser();
  const title = currentUser?.org?.name;

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="Org" component={OrgScreen} options={{ title }} />
      <Stack.Screen component={SettingsScreen} name="Settings" />
    </Stack.Navigator>
  );
}
