import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NewCommentScreen, NewPostScreen, PostScreen } from '../screens';
import { DiscussStackParamList } from './types';
import useDefaultStackNavigatorScreenOptions from './useDefaultStackNavigatorScreenOptions';
import DiscussTabs from './DiscussTabs';

const Stack = createNativeStackNavigator<DiscussStackParamList>();

export default function DiscussStack() {
  const defaultScreenOptions = useDefaultStackNavigatorScreenOptions();
  const screenOptions = {
    ...defaultScreenOptions,
    headerShadowVisible: false,
  };

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="DiscussTabs"
        component={DiscussTabs}
        options={{ title: 'Discuss' }}
      />
      <Stack.Screen
        name="NewPost"
        component={NewPostScreen}
        options={{ title: 'New Post' }}
      />
      <Stack.Screen
        name="Post"
        component={PostScreen}
        options={{ title: '' }}
      />
      <Stack.Screen
        name="NewComment"
        component={NewCommentScreen}
        options={{ title: 'New Comment' }}
      />
    </Stack.Navigator>
  );
}
