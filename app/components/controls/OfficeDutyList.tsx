import React, {
  RefObject, useCallback, useEffect, useRef,
} from 'react';
import { FlatList, ListRenderItem, StyleSheet } from 'react-native';
import { OFFICE_DUTIES, OfficeCategory, OfficeDuty } from '../../model';
import OfficeDutyRow from './OfficeDutyRow';
import useTheme from '../../Theme';

const useStyles = () => {
  const { spacing } = useTheme();

  const styles = StyleSheet.create({
    container: {
      padding: spacing.s,
    },
  });

  return { styles };
};

function useScrollToOffice(
  listRef: RefObject<FlatList<OfficeDuty>>,
  officeCategory?: OfficeCategory,
) {
  useEffect(() => {
    if (!officeCategory) { return; }

    const item = OFFICE_DUTIES.find(
      ({ category }) => category === officeCategory,
    );
    if (!item) { return; }

    // HACK: This timeout allows the list to render before attempting to scroll.
    // If 100ms isn't enough, the error will be logged to the console via
    // onScrollToIndexFailed, and the user will need to manually scroll to the
    // highlighted item.
    setTimeout(
      () => listRef.current?.scrollToItem({ animated: false, item }),
      100,
    );
  }, [listRef, officeCategory]);
}

type Props = {
  highlightedOffice?: OfficeCategory;
};

export default function OfficeDutyList({ highlightedOffice }: Props) {
  const { styles } = useStyles();

  const listRef = useRef<FlatList<OfficeDuty>>(null);
  useScrollToOffice(listRef, highlightedOffice);

  const renderItem: ListRenderItem<OfficeDuty> = useCallback(({ item }) => (
    <OfficeDutyRow
      highlight={item.category === highlightedOffice}
      item={item}
    />
  ), [highlightedOffice]);

  return (
    <FlatList
      contentContainerStyle={styles.container}
      data={OFFICE_DUTIES}
      onScrollToIndexFailed={console.error}
      ref={listRef}
      renderItem={renderItem}
    />
  );
}

OfficeDutyList.defaultProps = {
  highlightedOffice: undefined,
};
