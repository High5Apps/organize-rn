import React, {
  useLayoutEffect, useMemo, useRef, useState,
} from 'react';
import {
  Keyboard, ScrollView, StyleSheet, TextInput, View,
} from 'react-native';
import { CommonActions } from '@react-navigation/native';
import {
  KeyboardAvoidingScreenBackground, MultilineTextInput, PostCategorySelector,
  PrimaryButton, TextInputRow, useRequestProgress,
} from '../../components';
import {
  GENERIC_ERROR_MESSAGE, isCurrentUserData, isDefined, useCachedValue, usePosts,
  useUserContext,
} from '../../model';
import type { Post, PostCategory } from '../../model';
import useTheme from '../../Theme';
import { createPost } from '../../networking';
import type {
  DiscussTabsParamList, NewPostScreenParams, NewPostScreenProps,
} from '../../navigation';

const MAX_TITLE_LENGTH = 140;
const MAX_BODY_LENGTH = 10000;
const CACHE_KEY_TITLE = 'newPostTitle';
const CACHE_KEY_BODY = 'newPostBody';

const useStyles = () => {
  const { sizes, spacing } = useTheme();

  const styles = StyleSheet.create({
    button: {
      alignSelf: 'flex-end',
      flex: 0,
      height: sizes.buttonHeight,
      marginBottom: spacing.m,
      marginEnd: spacing.m,
      paddingHorizontal: spacing.m,
    },
    container: {
      rowGap: spacing.m,
    },
    multilineTextInput: {
      marginHorizontal: spacing.m,
    },
    requestProgress: {
      marginHorizontal: spacing.m,
    },
    scrollView: {
      flex: 1,
    },
  });

  return { styles };
};

function useTitleUpdater(
  navigation: NewPostScreenProps['navigation'],
  maybeCategory?: PostCategory,
) {
  useLayoutEffect(() => {
    let title: string = 'New Discussion';

    if (maybeCategory === 'demands') {
      title = 'New Demand';
    } else if (maybeCategory === 'general') {
      title = 'New General Discussion';
    } else if (maybeCategory === 'grievances') {
      title = 'New Grievance';
    }

    navigation.setOptions({ title });
  }, [navigation, maybeCategory]);
}

function useDiscussTabScreenKeysToUpdate(
  postCategory: PostCategory,
  discussTabRoutes: NewPostScreenParams['discussTabRoutes'],
) {
  const screenKeysToUpdate = useMemo(() => {
    const screenNamesToUpdate: (keyof DiscussTabsParamList)[] = [
      'Recent',
    ];

    if (postCategory === 'demands') {
      screenNamesToUpdate.push('Demands');
    } else if (postCategory === 'general') {
      screenNamesToUpdate.push('General');
    } else if (postCategory === 'grievances') {
      screenNamesToUpdate.push('Grievances');
    }

    const screenNameToRoute = ((screenName: string) => (
      discussTabRoutes.find(({ name }) => (name === screenName))
    ));
    return screenNamesToUpdate.map(screenNameToRoute)
      .filter(isDefined)
      .map(({ key }) => key);
  }, [postCategory, discussTabRoutes]);

  return screenKeysToUpdate;
}

export default function NewPostScreen({
  navigation, route,
}: NewPostScreenProps) {
  const { category: maybeCategory, discussTabRoutes } = route.params ?? {};
  const initialPostCategory = maybeCategory ?? 'general';

  const { styles } = useStyles();
  useTitleUpdater(navigation, maybeCategory);

  const [
    postCategory, setPostCategory,
  ] = useState<PostCategory>(initialPostCategory);
  const [body, setBody] = useCachedValue<string>(CACHE_KEY_BODY);
  const [title, setTitle] = useCachedValue<string>(CACHE_KEY_TITLE);

  const screenKeysToUpdate = useDiscussTabScreenKeysToUpdate(
    postCategory,
    discussTabRoutes,
  );

  const {
    loading, RequestProgress, result, setLoading, setResult,
  } = useRequestProgress();

  const { cachePost } = usePosts();

  const multilineTextInputRef = useRef<TextInput | null>(null);

  const { currentUser } = useUserContext();
  if (!isCurrentUserData(currentUser)) {
    throw new Error('Expected currentUser');
  }

  const resetForm = () => {
    setTitle('');
    setBody('');
    setResult('none');
  };

  const onPublishPressed = async () => {
    Keyboard.dismiss();

    setLoading(true);
    setResult('none');

    const strippedTitle = title?.trim() ?? '';
    setTitle(strippedTitle);

    let maybeStrippedBody = body;
    if (maybeStrippedBody?.length) {
      maybeStrippedBody = maybeStrippedBody.trim();
      setBody(maybeStrippedBody);
    }

    try {
      const jwt = await currentUser.createAuthToken({ scope: '*' });
      const { e2eEncrypt } = currentUser;

      const { errorMessage, createdAt, id } = await createPost({
        body: maybeStrippedBody,
        category: postCategory,
        e2eEncrypt,
        jwt,
        title: strippedTitle,
      });

      if (errorMessage !== undefined) {
        setResult('error', { message: errorMessage });
        return;
      }

      resetForm();
      setResult('success', { message: 'Successfully created post' });

      const post: Post = {
        body: maybeStrippedBody,
        createdAt,
        category: postCategory,
        id,
        myVote: 1,
        pseudonym: currentUser.pseudonym,
        score: 1,
        title: strippedTitle,
        userId: currentUser.id,
      };
      cachePost(post);

      const params = { prependedPostIds: [id] };

      screenKeysToUpdate.forEach((key) => navigation.dispatch({
        ...CommonActions.setParams(params),
        source: key,
      }));
      navigation.goBack();
    } catch (error) {
      console.error(error);
      setResult('error', { message: GENERIC_ERROR_MESSAGE });
    }
  };

  return (
    <KeyboardAvoidingScreenBackground>
      <ScrollView keyboardShouldPersistTaps="handled" style={styles.scrollView}>
        {!maybeCategory && (
          <PostCategorySelector
            onSelectionChanged={setPostCategory}
            selection={postCategory}
          />
        )}
        <View style={styles.container}>
          <TextInputRow
            // Prevents dismissing the keyboard when hitting next on Android
            // before entering any input
            blurOnSubmit={false}
            enablesReturnKeyAutomatically // iOS only
            maxLength={MAX_TITLE_LENGTH}
            onChangeText={setTitle}
            onEndEditing={({ nativeEvent: { text } }) => setTitle(text)}
            onSubmitEditing={({ nativeEvent: { text } }) => {
              if (text.length) {
                multilineTextInputRef.current?.focus();
              }
            }}
            placeholder="Title"
            value={title}
          />
          <MultilineTextInput
            maxLength={MAX_BODY_LENGTH}
            onChangeText={setBody}
            onEndEditing={({ nativeEvent: { text } }) => setBody(text)}
            placeholder="Body (optional)"
            style={styles.multilineTextInput}
            returnKeyType="default"
            ref={multilineTextInputRef}
            value={body}
          />
          {(!loading && result === 'none') ? null
            : <RequestProgress style={styles.requestProgress} />}
          <PrimaryButton
            iconName="publish"
            label="Publish"
            onPress={onPublishPressed}
            style={styles.button}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingScreenBackground>
  );
}
