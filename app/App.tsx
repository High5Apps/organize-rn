import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  LinkingConfig as linking, OrgTabs, RootStackParamList, WelcomeStack,
} from './navigation';
import { UserContextProvider } from './model';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <UserContextProvider>
      <NavigationContainer linking={linking}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="WelcomeStack" component={WelcomeStack} />
          <Stack.Screen name="OrgTabs" component={OrgTabs} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserContextProvider>
  );
}
