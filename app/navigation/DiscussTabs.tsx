import React from 'react';
import {
  MaterialTopTabNavigationOptions, createMaterialTopTabNavigator,
} from '@react-navigation/material-top-tabs';
import {
  DiscussDemandsScreen, DiscussGeneralScreen, DiscussGrievancesScreen,
  DiscussNewScreen,
} from '../screens';
import useTheme from '../Theme';
import { DiscussTabsParamList } from './types';

const useScreenOptions = () => {
  const {
    colors, font, sizes, spacing,
  } = useTheme();

  const screenPaddingStart = spacing.m;
  const screenOptions: MaterialTopTabNavigationOptions = {
    lazy: true,
    tabBarActiveTintColor: colors.primary,
    tabBarGap: spacing.s,
    tabBarInactiveTintColor: colors.labelSecondary,
    tabBarIndicatorContainerStyle: {
      marginLeft: screenPaddingStart,
    },
    tabBarIndicatorStyle: {
      backgroundColor: colors.primary,
    },
    tabBarItemStyle: {
      paddingHorizontal: 0,
      width: 'auto',
    },
    tabBarLabelStyle: {
      fontFamily: font.weights.semiBold,
    },
    tabBarScrollEnabled: true,
    tabBarStyle: {
      backgroundColor: colors.fill,
      paddingLeft: screenPaddingStart,
      borderBottomWidth: sizes.separator,
      borderBottomColor: colors.separator,
    },
  };

  return screenOptions;
};

const Tab = createMaterialTopTabNavigator<DiscussTabsParamList>();

export default function DiscussTabs() {
  const screenOptions = useScreenOptions();

  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen name="General" component={DiscussGeneralScreen} />
      <Tab.Screen name="Grievances" component={DiscussGrievancesScreen} />
      <Tab.Screen name="Demands" component={DiscussDemandsScreen} />
      <Tab.Screen name="New" component={DiscussNewScreen} />
    </Tab.Navigator>
  );
}
