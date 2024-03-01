import React, { useCallback } from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import {
  UserFilter, UserPreview, useUserContext, useUserPreviews,
} from '../../model';
import { ItemSeparator } from '../views';
import { useInfiniteScroll, usePullToRefresh } from '../hooks';
import UserPreviewRow from './UserPreviewRow';

type Props = {
  filter?: UserFilter;
  onItemPress?: (item: UserPreview) => void;
};

export default function UserPreviewList({ filter, onItemPress }: Props) {
  const sort = (filter === 'officer') ? 'office' : 'service';
  const {
    fetchedLastPage, fetchFirstPageOfUserPreviews, fetchNextPageOfUserPreviews,
    userPreviews,
  } = useUserPreviews({ filter, sort });

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

  const { currentUser } = useUserContext();

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
  filter: undefined,
  onItemPress: () => null,
};
