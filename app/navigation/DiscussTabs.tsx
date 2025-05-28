import React from 'react';
import {
  createMaterialTopTabNavigator,
} from '@react-navigation/material-top-tabs';
import {
  DiscussDemandsScreen, DiscussGeneralScreen, DiscussGrievancesScreen,
  DiscussRecentScreen,
} from '../screens';
import { DiscussTabsParamList } from './types';
import useDefaultTopTabOptions from './DefaultTopTabOptions';
import { useTranslation } from '../i18n';

const Tab = createMaterialTopTabNavigator<DiscussTabsParamList>();

export default function DiscussTabs() {
  const screenOptions = useDefaultTopTabOptions();
  const { t } = useTranslation();

  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen
        component={DiscussGeneralScreen}
        name="General"
        options={{ title: t('modifier.general') }}
      />
      <Tab.Screen
        component={DiscussGrievancesScreen}
        name="Grievances"
        options={{ title: t('object.grievance', { count: 100 }) }}
      />
      <Tab.Screen
        component={DiscussDemandsScreen}
        name="Demands"
        options={{ title: t('object.demand', { count: 100 }) }}
      />
      <Tab.Screen
        component={DiscussRecentScreen}
        name="Recent"
        options={{ title: t('modifier.recent') }}
      />
    </Tab.Navigator>
  );
}
