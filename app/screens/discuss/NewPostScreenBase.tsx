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
import { useTranslation } from '../../i18n';

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

  const { t } = useTranslation();

  let body: string;
  let headline: string;
  let icon: string;
  if (postCategory === 'demands') {
    icon = 'trending-up';
    headline = t('question.demand');
    body = t('explanation.demand');
  } else if (postCategory === 'general') {
    if (candidateId) {
      icon = 'campaign';
      headline = t('question.candidacyAnnouncement');
      body = t('explanation.candidacyAnnouncement');
    } else {
      icon = 'question-answer';
      headline = t('question.discussionTopic');
      body = t('explanation.discussionTopic');
    }
  } else if (postCategory === 'grievances') {
    icon = 'heart-broken';
    headline = t('question.grievance');
    body = t('explanation.grievance');
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
  const { t } = useTranslation();

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
      setResult('success', { message: t('result.successfulPostCreation') });
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
            <HeaderText>{t('object.category')}</HeaderText>
            <PostCategorySelector
              disabled={loading}
              onSelectionChanged={setPostCategory}
              selection={postCategory}
            />
          </View>
        )}
        <View style={styles.section}>
          <HeaderText>{t('object.title')}</HeaderText>
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
            placeholder={t('placeholder.discussionTitle')}
            // Prevents dismissing the keyboard when hitting next on Android
            // before entering any input
            submitBehavior="submit"
            value={title}
          />
        </View>
        <View style={styles.section}>
          <HeaderText>{t('object.optional.body')}</HeaderText>
          <MultilineTextInput
            editable={!loading}
            maxLength={MAX_BODY_LENGTH}
            onChangeText={setBody}
            onEndEditing={({ nativeEvent: { text } }) => setBody(text)}
            placeholder={t('placeholder.discussionBody')}
            returnKeyType="default"
            ref={multilineTextInputRef}
            value={body}
          />
        </View>
        <RequestProgress style={styles.requestProgress} />
        <PrimaryButton
          iconName="publish"
          label={t('action.publish')}
          onPress={onPublishPressed}
          style={styles.button}
        />
      </View>
    </KeyboardAvoidingScreenBackground>
  );
}
