import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LeadStackParamList } from './types';
import useDefaultStackNavigatorScreenOptions from './useDefaultStackNavigatorScreenOptions';
import {
  EditOrgScreen, LeadScreen, PermissionScreen, PermissionsScreen,
} from '../screens';
import { permissionItems } from '../model';

const Stack = createNativeStackNavigator<LeadStackParamList>();

export default function LeadStack() {
  const screenOptions = useDefaultStackNavigatorScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="Lead" component={LeadScreen} />
      <Stack.Screen
        name="EditOrg"
        component={EditOrgScreen}
        options={{ title: 'Edit Org' }}
      />
      <Stack.Screen
        name="Permission"
        component={PermissionScreen}
        options={({ route }) => {
          const { scope } = route.params;
          const permissionItem = permissionItems.find(
            (item) => item.scope === scope,
          );
          const title = `Who can ${permissionItem?.title.toLocaleLowerCase()}?`;
          return { title };
        }}
      />
      <Stack.Screen name="Permissions" component={PermissionsScreen} />
    </Stack.Navigator>
  );
}
