import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LeadStackParamList } from './types';
import useDefaultStackNavigatorOptions from './DefaultStackNavigatorOptions';
import {
  BlockMemberScreen, BlockedMembersScreen, EditOrgScreen, EditWorkGroupScreen,
  EditWorkGroupsScreen, LeadScreen, ModerationScreen, PermissionScreen,
  PermissionsScreen, UnionCardsScreen,
} from '../screens';
import FlagReportTabs from './FlagReportTabs';
import { useTranslation } from '../i18n';

const Stack = createNativeStackNavigator<LeadStackParamList>();

export default function LeadStack() {
  const screenOptions = useDefaultStackNavigatorOptions();
  const { t } = useTranslation();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Lead"
        component={LeadScreen}
        options={{ title: t('action.lead') }}
      />
      <Stack.Screen
        name="BlockMember"
        component={BlockMemberScreen}
        options={{ title: t('action.blockMember', { count: 1 }) }}
      />
      <Stack.Screen
        name="BlockedMembers"
        component={BlockedMembersScreen}
        options={{ title: t('object.blockedMembers') }}
      />
      <Stack.Screen
        name="EditOrg"
        component={EditOrgScreen}
        options={{ title: t('action.editOrgInfo') }}
      />
      <Stack.Screen
        name="EditWorkGroup"
        component={EditWorkGroupScreen}
        options={{ title: t('action.editWorkGroup', { count: 1 }) }}
      />
      <Stack.Screen
        name="EditWorkGroups"
        component={EditWorkGroupsScreen}
        options={{ title: t('action.editWorkGroup', { count: 100 }) }}
      />
      <Stack.Screen
        name="FlagReportTabs"
        component={FlagReportTabs}
        options={{
          headerShadowVisible: false,
          title: t('object.flaggedContent'),
        }}
      />
      <Stack.Screen
        name="Moderation"
        component={ModerationScreen}
        options={{ title: t('object.moderation') }}
      />
      <Stack.Screen
        name="Permission"
        component={PermissionScreen}
        options={{ title: t('object.permission', { count: 1 }) }}
      />
      <Stack.Screen
        name="Permissions"
        component={PermissionsScreen}
        options={{ title: t('object.permission', { count: 100 }) }}
      />
      <Stack.Screen
        name="UnionCards"
        component={UnionCardsScreen}
        options={{ title: t('object.unionCard', { count: 100 }) }}
      />
    </Stack.Navigator>
  );
}
