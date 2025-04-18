import React, { useEffect, useRef, useState } from 'react';
import {
  Keyboard, StyleSheet, TextInput, View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useCachedValue, usePost } from '../../model';
import type { Post, PostCategory } from '../../model';
import useTheme from '../../Theme';
import {
  HeaderText, KeyboardAvoidingScreenBackground, LearnMoreModal as LearnMoreModalComponent,
  MultilineTextInput, PostCategorySelector, PrimaryButton, TextInputRow,
  useHeaderButton, useRequestProgress,
} from '../../components';
import type {
  NewCandidacyAnnouncementScreenProps, NewPostScreenProps,
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
      paddingHorizontal: spacing.m,
    },
    container: {
      padding: spacing.m,
      rowGap: spacing.m,
    },
    requestProgress: {
      marginHorizontal: spacing.m,
    },
    section: {
      rowGap: spacing.s,
    },
  });

  return { styles };
};

function usePostTitle(titleParam?: string) {
  const [title, setTitle] = useCachedValue<string | undefined>(CACHE_KEY_TITLE);

  // If title param was included, override the cached title
  useEffect(() => {
    if (titleParam) {
      setTitle(titleParam);
    }
  }, []);

  return [title, setTitle] as const;
}

type UseLearnMoreModalProps = {
  candidateId?: string | null;
  postCategory: PostCategory;
};

function useLearnMoreModal({
  candidateId, postCategory,
}: UseLearnMoreModalProps) {
  const [modalVisible, setModalVisible] = useState(false);

  const navigation = useNavigation<
    NewPostScreenProps['navigation']
      | NewCandidacyAnnouncementScreenProps['navigation']
  >();
  useHeaderButton({
    iconName: 'help-outline',
    navigation,
    onPress: () => setModalVisible(true),
  });

  let body: string;
  let headline: string;
  let icon: string;
  if (postCategory === 'demands') {
    icon = 'trending-up';
    headline = "What's a demand?";
    body = "Demands let you voice how specific things at your workplace should change for the better.\n\nOver time, Org members' upvotes and downvotes will help everyone come to a consensus on which demands are the most important.";
  } else if (postCategory === 'general') {
    if (candidateId) {
      icon = 'campaign';
      headline = "What's a candidacy announcement?";
      body = "It's your opportunity to explain to your coworkers why they should vote for you.\n\nIf you've got relevant experience or character traits, let them know!\n\nWhat will you do if you win?\n\nWhy are you the best person for the job?";
    } else {
      icon = 'question-answer';
      headline = 'What should we discuss?';
      body = "You can discuss anything here!\n\nJust try to keep it civil.\n\nYou might not agree with your coworkers on every issue, but at the end of the day you're all in it together.";
    }
  } else if (postCategory === 'grievances') {
    icon = 'heart-broken';
    headline = "What's a grievance?";
    body = "If you've experienced issues in your workplace, others may have experienced them too.\n\nGrievances offer a chance to shine a light on injustice, unethical behavior, and illegal practices.";
  } else {
    throw new Error('Unexpected postCategory');
  }

  return (
    <LearnMoreModalComponent
      body={body}
      headline={headline}
      iconName={icon}
      setVisible={setModalVisible}
      visible={modalVisible}
    />
  );
}

type Props = {
  candidateId?: string | null;
  initialCategory?: PostCategory;
  initialPostTitle?: string;
  onPostCreated?: (post: Post) => void;
};

export default function NewPostScreenBase({
  candidateId, initialCategory, initialPostTitle, onPostCreated = () => null,
}: Props) {
  const [
    postCategory, setPostCategory,
  ] = useState<PostCategory>(initialCategory ?? 'general');
  const [body, setBody] = useCachedValue<string>(CACHE_KEY_BODY);
  const [title, setTitle] = usePostTitle(initialPostTitle);

  const {
    loading, RequestProgress, setLoading, setResult,
  } = useRequestProgress({ removeWhenInactive: true });

  const { createPost } = usePost();

  const multilineTextInputRef = useRef<TextInput | null>(null);

  const { styles } = useStyles();

  const resetForm = () => {
    setTitle('');
    setBody('');
    setResult('none');
  };

  const onPublishPressed = async () => {
    Keyboard.dismiss();

    setLoading(true);
    setResult('none');

    try {
      const post = await createPost({
        body, candidateId, category: postCategory, title,
      });
      resetForm();
      setResult('success', { message: 'Successfully created post' });
      onPostCreated?.(post);
    } catch (error) {
      setResult('error', { error });
    }
  };

  const LearnMoreModal = useLearnMoreModal({ candidateId, postCategory });

  return (
    <KeyboardAvoidingScreenBackground>
      { LearnMoreModal }
      <View style={styles.container}>
        {!initialCategory && (
          <View style={styles.section}>
            <HeaderText>Category</HeaderText>
            <PostCategorySelector
              disabled={loading}
              onSelectionChanged={setPostCategory}
              selection={postCategory}
            />
          </View>
        )}
        <View style={styles.section}>
          <HeaderText>Title</HeaderText>
          <TextInputRow
            editable={!loading}
            enablesReturnKeyAutomatically // iOS only
            maxLength={MAX_TITLE_LENGTH}
            onChangeText={setTitle}
            onEndEditing={({ nativeEvent: { text } }) => setTitle(text)}
            onSubmitEditing={({ nativeEvent: { text } }) => {
              if (text.length) {
                multilineTextInputRef.current?.focus();
              }
            }}
            placeholder="Enter a short title"
            // Prevents dismissing the keyboard when hitting next on Android
            // before entering any input
            submitBehavior="submit"
            value={title}
          />
        </View>
        <View style={styles.section}>
          <HeaderText>Body (optional)</HeaderText>
          <MultilineTextInput
            editable={!loading}
            maxLength={MAX_BODY_LENGTH}
            onChangeText={setBody}
            onEndEditing={({ nativeEvent: { text } }) => setBody(text)}
            placeholder="Enter any details that can't fit in the title"
            returnKeyType="default"
            ref={multilineTextInputRef}
            value={body}
          />
        </View>
        <RequestProgress style={styles.requestProgress} />
        <PrimaryButton
          iconName="publish"
          label="Publish"
          onPress={onPublishPressed}
          style={styles.button}
        />
      </View>
    </KeyboardAvoidingScreenBackground>
  );
}
