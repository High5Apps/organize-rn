import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  NewCommentScreen, NewPostScreen, NewReplyScreen, PostScreen,
} from '../screens';
import { DiscussStackParamList } from './types';
import useDefaultStackNavigatorScreenOptions from './useDefaultStackNavigatorScreenOptions';
import DiscussTabs from './DiscussTabs';

const Stack = createNativeStackNavigator<DiscussStackParamList>();

export default function DiscussStack() {
  const screenOptions = useDefaultStackNavigatorScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="DiscussTabs"
        component={DiscussTabs}
        options={{ headerShadowVisible: false, title: 'Discuss' }}
      />
      <Stack.Screen
        name="NewPost"
        component={NewPostScreen}
        options={{ title: 'New Discussion' }}
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
      <Stack.Screen
        name="NewReply"
        component={NewReplyScreen}
        options={{ title: 'New Reply' }}
      />
    </Stack.Navigator>
  );
}
