import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { QRCodeValue } from '../../model';
import ReviewFrame from './ReviewFrame';

type Props = {
  qrValue: QRCodeValue;
  style?: StyleProp<ViewStyle>;
};

export default function MembershipReview({ qrValue, style }: Props) {
  const { org: { potentialMemberDefinition, name } } = qrValue;
  return (
    <ReviewFrame
      labeledValues={[
        {
          label: 'I am',
          value: potentialMemberDefinition,
        },
        {
          label: 'and I want to join',
          value: name,
        },
      ]}
      style={style}
    />
  );
}

MembershipReview.defaultProps = {
  style: {},
};
