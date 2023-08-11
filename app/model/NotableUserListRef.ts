import { ForwardedRef, RefObject, useImperativeHandle } from 'react';
import { SectionList } from 'react-native';
import { type NotableUserItem } from '../components/controls/NotableUserRow';
import { type NotableUserSection } from '../components/controls/NotableUserList';

export type NotableUserListRef = {
  scrollToTop: () => void;
};

export default function useNotableUserListRef(
  ref: ForwardedRef<NotableUserListRef>,
  sectionListRef: RefObject<SectionList<NotableUserItem, NotableUserSection>>,
  listHeaderComponentHeight?: number,
) {
  useImperativeHandle(
    ref,
    () => {
      const scrollToTop = () => sectionListRef.current?.scrollToLocation({
        itemIndex: 0,
        sectionIndex: 0,
        viewOffset: listHeaderComponentHeight,
      });

      return { scrollToTop };
    },
    [ref, sectionListRef.current],
  );
}
