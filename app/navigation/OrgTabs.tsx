import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ConnectStack from './ConnectStack';
import { OrgTabsParamList } from './types';
import { TabBarIcon } from '../components';
import DiscussStack from './DiscussStack';
import VoteStack from './VoteStack';
import OrgStack from './OrgStack';
import LeadStack from './LeadStack';
import { useCurrentUser } from '../model';
import { useTranslation } from '../i18n';

const Tab = createBottomTabNavigator<OrgTabsParamList>();

export default function OrgTabs() {
  const { currentUser } = useCurrentUser();
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarAllowFontScaling: false,
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen
        name="ConnectStack"
        component={ConnectStack}
        options={{
          tabBarIcon: TabBarIcon('person-add'),
          tabBarLabel: t('action.connect'),
        }}
      />
      <Tab.Screen
        name="DiscussStack"
        component={DiscussStack}
        options={{
          tabBarIcon: TabBarIcon('chat-bubble'),
          tabBarLabel: t('action.discuss'),
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
      {(currentUser?.offices?.length ?? 0) > 0 && (
        <Tab.Screen
          name="LeadStack"
          component={LeadStack}
          options={{
            tabBarIcon: TabBarIcon('emoji-people'),
            tabBarLabel: 'Lead',
          }}
        />
      )}
    </Tab.Navigator>
  );
}
