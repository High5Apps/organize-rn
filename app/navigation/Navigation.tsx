import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LinkingConfig from './LinkingConfig';
import OrgTabs from './OrgTabs';
import type { RootStackParamList } from './types';
import WelcomeStack from './WelcomeStack';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Navigation() {
  return (
    <NavigationContainer linking={LinkingConfig}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="WelcomeStack" component={WelcomeStack} />
        <Stack.Screen name="OrgTabs" component={OrgTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
