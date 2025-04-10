import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LeadStackParamList } from './types';
import useDefaultStackNavigatorOptions from './DefaultStackNavigatorOptions';
import {
  BlockMemberScreen, BlockedMembersScreen, EditOrgScreen, EditWorkGroupScreen,
  EditWorkGroupsScreen, LeadScreen, ModerationScreen, PermissionScreen,
  PermissionsScreen, UnionCardsScreen,
} from '../screens';
import { toAction } from '../model';
import FlagReportTabs from './FlagReportTabs';

const Stack = createNativeStackNavigator<LeadStackParamList>();

export default function LeadStack() {
  const screenOptions = useDefaultStackNavigatorOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="Lead" component={LeadScreen} />
      <Stack.Screen
        name="BlockMember"
        component={BlockMemberScreen}
        options={{ title: 'Block Member' }}
      />
      <Stack.Screen
        name="BlockedMembers"
        component={BlockedMembersScreen}
        options={{ title: 'Blocked Members' }}
      />
      <Stack.Screen
        name="EditOrg"
        component={EditOrgScreen}
        options={{ title: 'Edit Org' }}
      />
      <Stack.Screen
        name="EditWorkGroup"
        component={EditWorkGroupScreen}
        options={{ title: 'Edit Work Group' }}
      />
      <Stack.Screen
        name="EditWorkGroups"
        component={EditWorkGroupsScreen}
        options={{ title: 'Edit Work Groups' }}
      />
      <Stack.Screen
        name="FlagReportTabs"
        component={FlagReportTabs}
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
      <Stack.Screen
        name="UnionCards"
        component={UnionCardsScreen}
        options={{ title: 'Union Cards' }}
      />
    </Stack.Navigator>
  );
}
