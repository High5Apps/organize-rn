import React, {
  ReactElement, useCallback, useEffect, useMemo,
} from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import {
  User, useCurrentUser, useUsers,
} from '../../model';
import { ItemSeparator } from '../views';
import { useInfiniteScroll, usePullToRefresh } from '../hooks';
import UserRow from './UserRow';

type Props = {
  debouncedQuery?: string;
  ListFooterComponent?: ReactElement;
  onItemPress?: (item: User) => void;
  onlyShowUserId?: string;
};

export default function UserList({
  debouncedQuery, ListFooterComponent, onItemPress, onlyShowUserId,
}: Props) {
  const {
    fetchedLastPage, fetchFirstPageOfUsers, fetchNextPageOfUsers, ready, users,
  } = useUsers({ sort: 'service', query: debouncedQuery });
  const onlyShowUser = useMemo(() => (
    onlyShowUserId ? users.find((u) => u.id === onlyShowUserId) : undefined
  ), [onlyShowUserId]);

  useEffect(() => {
    // query !== undefined allows for refetching when clear button is pressed
    if (ready && debouncedQuery !== undefined) {
      fetchFirstPageOfUsers();
    }
  }, [debouncedQuery, ready]);

  const { ListHeaderComponent, refreshControl, refreshing } = usePullToRefresh({
    onRefresh: async () => {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      clearNextPageError();

      await fetchFirstPageOfUsers();
    },
    refreshOnMount: true,
  });

  const {
    clearError: clearNextPageError,
    ListFooterComponent: InfiniteScrollListFooterComponent,
    onEndReached,
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
          disabled={!!onlyShowUserId}
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
      data={onlyShowUser !== undefined ? [onlyShowUser] : users}
      ItemSeparatorComponent={ItemSeparator}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={!onlyShowUserId
        ? InfiniteScrollListFooterComponent : ListFooterComponent}
      onEndReached={!onlyShowUserId ? onEndReached : undefined}
      onEndReachedThreshold={onEndReachedThreshold}
      refreshControl={!onlyShowUserId ? refreshControl : undefined}
      renderItem={renderItem}
    />
  );
}

UserList.defaultProps = {
  debouncedQuery: undefined,
  ListFooterComponent: undefined,
  onItemPress: () => null,
  onlyShowUserId: undefined,
};
