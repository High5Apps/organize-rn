import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LeadStackParamList } from './types';
import useDefaultStackNavigatorOptions from './DefaultStackNavigatorOptions';
import {
  EditOrgScreen, LeadScreen, ModerationScreen, PermissionScreen,
  PermissionsScreen,
} from '../screens';
import { toAction } from '../model';
import FlagTabs from './FlagTabs';

const Stack = createNativeStackNavigator<LeadStackParamList>();

export default function LeadStack() {
  const screenOptions = useDefaultStackNavigatorOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="Lead" component={LeadScreen} />
      <Stack.Screen
        name="EditOrg"
        component={EditOrgScreen}
        options={{ title: 'Edit Org' }}
      />
      <Stack.Screen
        name="FlagTabs"
        component={FlagTabs}
        options={{ headerShadowVisible: false, title: 'Flagged Content' }}
      />
      <Stack.Screen name="Moderation" component={ModerationScreen} />
      <Stack.Screen
        name="Permission"
        component={PermissionScreen}
        options={({ route }) => {
          const { scope } = route.params;
          const scopeAction = toAction(scope);
          const title = `Who can ${scopeAction}?`;
          return { title };
        }}
      />
      <Stack.Screen name="Permissions" component={PermissionsScreen} />
    </Stack.Navigator>
  );
}
