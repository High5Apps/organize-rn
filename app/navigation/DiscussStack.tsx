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
        options={({ route }) => {
          const maybeCategory = route.params.category;

          let title: string;
          if (maybeCategory === 'demands') {
            title = 'New Demand';
          } else if (maybeCategory === 'general') {
            title = 'New General Discussion';
          } else if (maybeCategory === 'grievances') {
            title = 'New Grievance';
          } else {
            title = 'New Discussion';
          }

          return { title };
        }}
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
