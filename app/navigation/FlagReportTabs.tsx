import React from 'react';
import {
  createMaterialTopTabNavigator,
} from '@react-navigation/material-top-tabs';
import { FlagReportsHandledScreen, FlagReportsPendingScreen } from '../screens';
import { FlagReportTabsParamList } from './types';
import useDefaultTopTabOptions from './DefaultTopTabOptions';

const Tab = createMaterialTopTabNavigator<FlagReportTabsParamList>();

export default function FlagReportTabs() {
  const screenOptions = useDefaultTopTabOptions();

  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen
        component={FlagReportsPendingScreen}
        name="FlagReportsPending"
        options={{ title: 'Pending' }}
      />
      <Tab.Screen
        component={FlagReportsHandledScreen}
        name="FlagReportsHandled"
        options={{ title: 'Handled' }}
      />
    </Tab.Navigator>
  );
}
