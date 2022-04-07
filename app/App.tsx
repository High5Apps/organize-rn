import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OrgTabs, RootStackParamList, WelcomeStack } from './navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="WelcomeStack" component={WelcomeStack} />
        <Stack.Screen name="OrgTabs" component={OrgTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
