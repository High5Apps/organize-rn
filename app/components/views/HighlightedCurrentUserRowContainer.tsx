import React, { PropsWithChildren } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { useCurrentUser } from '../../model';
import HighlightedRowContainer from './HighlightedRowContainer';
import useTheme from '../../Theme';

type Props = {
  userIds: string[];
  style?: StyleProp<ViewStyle>;
};

export default function HighlightedCurrentUserRowContainer({
  children, userIds, style,
}: PropsWithChildren<Props>) {
  const { colors, spacing } = useTheme();

  const { currentUser } = useCurrentUser();
  const highlighted = !!currentUser && userIds.includes(currentUser?.id);

  return (
    <HighlightedRowContainer
      color={colors.primary}
      highlighted={highlighted}
      style={style}
      width={spacing.s}
    >
      {children}
    </HighlightedRowContainer>
  );
}

HighlightedCurrentUserRowContainer.defaultProps = {
  style: {},
};
