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

const Tab = createMaterialTopTabNavigator<DiscussTabsParamList>();

export default function DiscussTabs() {
  const screenOptions = useDefaultTopTabOptions();

  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen name="General" component={DiscussGeneralScreen} />
      <Tab.Screen name="Grievances" component={DiscussGrievancesScreen} />
      <Tab.Screen name="Demands" component={DiscussDemandsScreen} />
      <Tab.Screen name="Recent" component={DiscussRecentScreen} />
    </Tab.Navigator>
  );
}
