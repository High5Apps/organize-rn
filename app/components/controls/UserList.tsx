import React, { useCallback } from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import {
  User, useCurrentUser, useUsers,
} from '../../model';
import { ItemSeparator } from '../views';
import { useInfiniteScroll, usePullToRefresh } from '../hooks';
import UserRow from './UserRow';

type Props = {
  onItemPress?: (item: User) => void;
};

export default function UserList({ onItemPress }: Props) {
  const {
    fetchedLastPage, fetchFirstPageOfUsers, fetchNextPageOfUsers, users,
  } = useUsers({ sort: 'service' });

  const { ListHeaderComponent, refreshControl, refreshing } = usePullToRefresh({
    onRefresh: async () => {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      clearNextPageError();

      await fetchFirstPageOfUsers();
    },
    refreshOnMount: true,
  });

  const {
    clearError: clearNextPageError, ListFooterComponent, onEndReached,
    onEndReachedThreshold,
  } = useInfiniteScroll({
    getDisabled: () => (!users.length || refreshing || fetchedLastPage),
    onLoadNextPage: fetchNextPageOfUsers,
  });

  const { currentUser } = useCurrentUser();

  const renderItem: ListRenderItem<User> = useCallback(
    ({ item }) => {
      const isMe = item.id === currentUser?.id;
      return (
        <UserRow
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
      data={users}
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

UserList.defaultProps = {
  onItemPress: () => null,
};
