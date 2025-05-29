import React from 'react';
import {
  createMaterialTopTabNavigator,
} from '@react-navigation/material-top-tabs';
import { FlagReportsHandledScreen, FlagReportsPendingScreen } from '../screens';
import { FlagReportTabsParamList } from './types';
import useDefaultTopTabOptions from './DefaultTopTabOptions';
import { useTranslation } from '../i18n';

const Tab = createMaterialTopTabNavigator<FlagReportTabsParamList>();

export default function FlagReportTabs() {
  const screenOptions = useDefaultTopTabOptions();
  const { t } = useTranslation();

  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen
        component={FlagReportsPendingScreen}
        name="FlagReportsPending"
        options={{ title: t('modifier.pending') }}
      />
      <Tab.Screen
        component={FlagReportsHandledScreen}
        name="FlagReportsHandled"
        options={{ title: t('modifier.handled') }}
      />
    </Tab.Navigator>
  );
}
