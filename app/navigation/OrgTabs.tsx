import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ConnectStack from './ConnectStack';
import { OrgTabsParamList } from './types';
import useTheme from '../Theme';
import { TabBarIcon } from '../components';
import DiscussStack from './DiscussStack';
import VoteStack from './VoteStack';
import OrgStack from './OrgStack';
import LeadStack from './LeadStack';

const useStyles = () => {
  const { font, spacing } = useTheme();

  const styles = StyleSheet.create({
    tabBarIconLabel: {
      fontFamily: font.weights.semiBold,
      marginBottom: spacing.xxs,
    },
  });

  return { styles };
};

const Tab = createBottomTabNavigator<OrgTabsParamList>();

export default function OrgTabs() {
  const { styles } = useStyles();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarLabelStyle: styles.tabBarIconLabel,
        tabBarHideOnKeyboard: false,
      }}
    >
      <Tab.Screen
        name="ConnectStack"
        component={ConnectStack}
        options={{
          tabBarIcon: TabBarIcon('person-add'),
          tabBarLabel: 'Connect',
        }}
      />
      <Tab.Screen
        name="DiscussStack"
        component={DiscussStack}
        options={{
          tabBarIcon: TabBarIcon('chat-bubble'),
          tabBarLabel: 'Discuss',
        }}
      />
      <Tab.Screen
        name="VoteStack"
        component={VoteStack}
        options={{
          tabBarIcon: TabBarIcon('how-to-vote'),
          tabBarLabel: 'Vote',
        }}
      />
      <Tab.Screen
        name="OrgStack"
        component={OrgStack}
        options={{
          tabBarIcon: TabBarIcon('circle'),
          tabBarLabel: 'Org',
        }}
      />
      <Tab.Screen
        name="LeadStack"
        component={LeadStack}
        options={{
          tabBarIcon: TabBarIcon('emoji-people'),
          tabBarLabel: 'Lead',
        }}
      />
    </Tab.Navigator>
  );
}
