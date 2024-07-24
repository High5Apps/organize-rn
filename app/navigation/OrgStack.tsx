import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OrgScreen, SettingsScreen, TransparencyLogScreen } from '../screens';
import { OrgStackParamList } from './types';
import useDefaultStackNavigatorOptions from './DefaultStackNavigatorOptions';
import { useCurrentUser } from '../model';

const Stack = createNativeStackNavigator<OrgStackParamList>();

export default function OrgStack() {
  const screenOptions = useDefaultStackNavigatorOptions();

  const { currentUser } = useCurrentUser();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        component={OrgScreen}
        name="Org"
        options={{ title: currentUser?.org?.name }}
      />
      <Stack.Screen component={SettingsScreen} name="Settings" />
      <Stack.Screen
        component={TransparencyLogScreen}
        name="TransparencyLog"
        options={{ title: 'Transparency Log' }}
      />
    </Stack.Navigator>
  );
}
