import React from 'react';
import {
  createMaterialTopTabNavigator,
} from '@react-navigation/material-top-tabs';
import { FlaggedHandledScreen, FlagReportsPendingScreen } from '../screens';
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
        component={FlaggedHandledScreen}
        name="FlaggedHandled"
        options={{ title: 'Handled' }}
      />
    </Tab.Navigator>
  );
}
