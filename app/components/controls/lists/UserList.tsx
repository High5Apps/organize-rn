import React, {
  ReactElement, useCallback, useEffect, useMemo,
} from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import {
  User, UserSort, useCurrentUser, useUsers,
} from '../../../model';
import { ItemSeparator, ListEmptyMessage } from '../../views';
import { UserRow } from './rows';
import usePullToRefresh from './PullToRefresh';
import useInfiniteScroll from './InfiniteScroll';

const LIST_EMPTY_MESSAGE = 'Nobody matched your search. Type a little more or check your spelling.';

type DebouncedQueryFetcherProps = {
  debouncedQuery?: string;
  disabled?: boolean;
  fetch: () => void;
};

function useDebouncedQueryFetcher({
  debouncedQuery, disabled, fetch,
}: DebouncedQueryFetcherProps) {
  useEffect(() => {
    if (!disabled) {
      fetch();
    }
  }, [debouncedQuery, disabled]);
}

type Props = {
  debouncedQuery?: string;
  ListFooterComponent?: ReactElement;
  onItemPress?: (item: User) => void;
  onlyShowUserId?: string;
  sort: UserSort;
};

export default function UserList({
  debouncedQuery, ListFooterComponent, onItemPress = () => null, onlyShowUserId,
  sort,
}: Props) {
  const {
    fetchedLastPage, fetchFirstPageOfUsers, fetchNextPageOfUsers, ready, users,
  } = useUsers({ sort, query: debouncedQuery });
  const onlyShowUser = useMemo(() => (
    onlyShowUserId ? users.find((u) => u.id === onlyShowUserId) : undefined
  ), [onlyShowUserId]);

  useDebouncedQueryFetcher({
    debouncedQuery,
    // Checking against undefined allows for refetching when the clear button is
    // pressed, which causes debouncedQuery to equal ''
    disabled: !ready || debouncedQuery === undefined || !!onlyShowUser,
    fetch: fetchFirstPageOfUsers,
  });

  const ListEmptyComponent = useCallback(() => (
    <ListEmptyMessage asteriskDelimitedMessage={LIST_EMPTY_MESSAGE} />
  ), []);

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
      keyboardShouldPersistTaps="handled"
      ListEmptyComponent={debouncedQuery ? ListEmptyComponent : null}
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
