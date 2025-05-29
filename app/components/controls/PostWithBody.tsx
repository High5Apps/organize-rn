import React from 'react';
import {
  LayoutChangeEvent, StyleSheet, Text, View,
} from 'react-native';
import { Post } from '../../model';
import { PostRow } from './lists';
import useTheme from '../../Theme';
import { HyperlinkDetector } from '../views';
import { useTranslation } from '../../i18n';

const useStyles = () => {
  const { colors, font, spacing } = useTheme();

  const styles = StyleSheet.create({
    body: {
      backgroundColor: colors.fill,
      color: colors.label,
      fontSize: font.sizes.body,
      fontFamily: font.weights.regular,
      paddingHorizontal: spacing.m,
      paddingBottom: spacing.m,
    },
    bodyDeleted: {
      color: colors.labelSecondary,
    },
  });

  return { styles };
};

type Props = {
  onLayout?: (event: LayoutChangeEvent) => void;
  onPostChanged?: (post: Post) => void;
  post?: Post;
};

export default function PostWithBody({
  onLayout = () => {}, onPostChanged = () => {}, post,
}: Props) {
  const { styles } = useStyles();
  const { t } = useTranslation();

  if (!post) { return null; }

  const body = post.deletedAt ? t('placeholder.authorLeftOrg') : post.body;

  return (
    <View onLayout={onLayout}>
      <PostRow item={post} onPostChanged={onPostChanged} />
      {body && (
        <HyperlinkDetector>
          <Text
            style={[styles.body, post.deletedAt && styles.bodyDeleted]}
          >
            {body}
          </Text>
        </HyperlinkDetector>
      )}
    </View>
  );
}
