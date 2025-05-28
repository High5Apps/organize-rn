import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  CommentThreadScreen, NewCommentScreen, NewPostScreen, NewReplyScreen,
  PostScreen,
} from '../screens';
import { DiscussStackParamList } from './types';
import useDefaultStackNavigatorOptions from './DefaultStackNavigatorOptions';
import DiscussTabs from './DiscussTabs';
import { useTranslation } from '../i18n';

const Stack = createNativeStackNavigator<DiscussStackParamList>();

export default function DiscussStack() {
  const screenOptions = useDefaultStackNavigatorOptions();
  const { t } = useTranslation();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="DiscussTabs"
        component={DiscussTabs}
        options={{ headerShadowVisible: false, title: t('action.discuss') }}
      />
      <Stack.Screen
        name="CommentThread"
        component={CommentThreadScreen}
        getId={({ params }) => params.commentId}
        options={{ title: t('object.commentThread') }}
      />
      <Stack.Screen
        name="NewPost"
        component={NewPostScreen}
        options={({ route }) => {
          const maybeCategory = route.params.category;

          let title: string;
          if (maybeCategory === 'demands') {
            title = t('object.new.demand');
          } else if (maybeCategory === 'general') {
            title = t('object.new.generalDiscussion');
          } else if (maybeCategory === 'grievances') {
            title = t('object.new.grievance');
          } else {
            title = t('object.new.discussion');
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
        options={{ title: t('object.new.comment') }}
      />
      <Stack.Screen
        name="NewReply"
        component={NewReplyScreen}
        options={{ title: t('object.new.reply') }}
      />
    </Stack.Navigator>
  );
}
