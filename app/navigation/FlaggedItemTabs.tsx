import React from 'react';
import {
  createMaterialTopTabNavigator,
} from '@react-navigation/material-top-tabs';
import { FlaggedHandledScreen, FlaggedPendingScreen } from '../screens';
import { FlaggedItemTabsParamList } from './types';
import useDefaultTopTabOptions from './DefaultTopTabOptions';

const Tab = createMaterialTopTabNavigator<FlaggedItemTabsParamList>();

export default function FlaggedItemTabs() {
  const screenOptions = useDefaultTopTabOptions();

  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen
        component={FlaggedPendingScreen}
        name="FlaggedPending"
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
