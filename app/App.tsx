import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './navigation';
import {
  JoinOrgScreen, NewOrgScreen, OrgReview, WelcomeScreen,
} from './screens';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="NewOrg" component={NewOrgScreen} />
        <Stack.Screen name="OrgReview" component={OrgReview} />
        <Stack.Screen name="JoinOrg" component={JoinOrgScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
