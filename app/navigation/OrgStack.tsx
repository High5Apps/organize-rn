import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  LeaveOrgScreen, OrgScreen, SettingsScreen, TransparencyLogScreen,
} from '../screens';
import { OrgStackParamList } from './types';
import useDefaultStackNavigatorOptions from './DefaultStackNavigatorOptions';
import { useCurrentUser } from '../model';
import { useTranslation } from '../i18n';

const Stack = createNativeStackNavigator<OrgStackParamList>();

export default function OrgStack() {
  const screenOptions = useDefaultStackNavigatorOptions();
  const { t } = useTranslation();

  const { currentUser } = useCurrentUser();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        component={OrgScreen}
        name="Org"
        options={{ title: currentUser?.org?.name }}
      />
      <Stack.Screen
        component={LeaveOrgScreen}
        name="LeaveOrg"
        options={{ title: t('action.leaveOrg') }}
      />
      <Stack.Screen
        component={SettingsScreen}
        name="Settings"
        options={{ title: t('object.settings') }}
      />
      <Stack.Screen
        component={TransparencyLogScreen}
        name="TransparencyLog"
        options={{ title: t('object.transparencyLog') }}
      />
    </Stack.Navigator>
  );
}
