import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  ConnectScreen, NewConnectionScreen, NewWorkGroupScreen, SelectWorkGroupScreen,
  UnionCardScreen,
} from '../screens';
import { ConnectStackParamList } from './types';
import useDefaultStackNavigatorOptions from './DefaultStackNavigatorOptions';
import { useTranslation } from '../i18n';

const Stack = createNativeStackNavigator<ConnectStackParamList>();

export default function ConnectStack() {
  const screenOptions = useDefaultStackNavigatorOptions();
  const { t } = useTranslation();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        component={ConnectScreen}
        name="Connect"
        options={{ title: t('action.connect') }}
      />
      <Stack.Screen
        component={NewConnectionScreen}
        name="NewConnection"
        options={{ title: t('action.createConnection') }}
      />
      <Stack.Screen
        component={NewWorkGroupScreen}
        name="NewWorkGroup"
        options={{ title: t('action.addWorkGroup', { context: 'title' }) }}
      />
      <Stack.Screen
        component={SelectWorkGroupScreen}
        name="SelectWorkGroup"
        options={{ title: t('action.selectWorkGroup', { context: 'title' }) }}
      />
      <Stack.Screen
        component={UnionCardScreen}
        name="UnionCard"
        options={{ title: t('object.unionCard') }}
      />
    </Stack.Navigator>
  );
}
