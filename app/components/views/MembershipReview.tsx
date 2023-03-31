import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { QRCodeValue } from '../../model';
import { PreviewConnectionResponse } from '../../networking';
import ConnectionRequestProgress from './ConnectionRequestProgress';
import ReviewFrame from './ReviewFrame';

const reviewFrameProvider = ({ org }: PreviewConnectionResponse) => (
  <ReviewFrame
    labeledValues={[
      {
        label: 'I am',
        value: org.potential_member_definition,
      },
      {
        label: 'and I want to join',
        value: org.name,
      },
    ]}
  />
);

type Props = {
  qrValue: QRCodeValue;
  style?: StyleProp<ViewStyle>;
};

export default function MembershipReview({ qrValue, style }: Props) {
  const { jwt: sharerJwt } = qrValue;

  return (
    <ConnectionRequestProgress
      reviewFrameProvider={reviewFrameProvider}
      sharerJwt={sharerJwt}
      style={style}
    />
  );
}

MembershipReview.defaultProps = {
  style: {},
};
