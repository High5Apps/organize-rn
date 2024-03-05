import React, { useCallback } from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import {
  UserPreview, useCurrentUser, useUserPreviews,
} from '../../model';
import { ItemSeparator } from '../views';
import { useInfiniteScroll, usePullToRefresh } from '../hooks';
import UserPreviewRow from './UserPreviewRow';

type Props = {
  onItemPress?: (item: UserPreview) => void;
};

export default function UserPreviewList({ onItemPress }: Props) {
  const {
    fetchedLastPage, fetchFirstPageOfUserPreviews, fetchNextPageOfUserPreviews,
    userPreviews,
  } = useUserPreviews({ sort: 'service' });

  const { ListHeaderComponent, refreshControl, refreshing } = usePullToRefresh({
    onRefresh: async () => {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      clearNextPageError();

      await fetchFirstPageOfUserPreviews();
    },
    refreshOnMount: true,
  });

  const {
    clearError: clearNextPageError, ListFooterComponent, onEndReached,
    onEndReachedThreshold,
  } = useInfiniteScroll({
    getDisabled: () => (!userPreviews.length || refreshing || fetchedLastPage),
    onLoadNextPage: fetchNextPageOfUserPreviews,
  });

  const { currentUser } = useCurrentUser();

  const renderItem: ListRenderItem<UserPreview> = useCallback(
    ({ item }) => {
      const isMe = item.id === currentUser?.id;
      return (
        <UserPreviewRow
          compact
          isMe={isMe}
          item={item}
          onPress={onItemPress}
        />
      );
    },
    [currentUser, onItemPress],
  );

  return (
    <FlatList
      data={userPreviews}
      ItemSeparatorComponent={ItemSeparator}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={ListFooterComponent}
      onEndReached={onEndReached}
      onEndReachedThreshold={onEndReachedThreshold}
      refreshControl={refreshControl}
      renderItem={renderItem}
    />
  );
}

UserPreviewList.defaultProps = {
  onItemPress: () => null,
};
