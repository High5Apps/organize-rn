import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { QRCodeValue } from '../../model';
import { ConnectionPreview } from '../../networking';
import ConnectionRequestProgress from './ConnectionRequestProgress';
import ReviewFrame from './ReviewFrame';

const reviewFrameProvider = ({ org }: ConnectionPreview) => (
  <ReviewFrame
    labeledValues={[
      {
        label: 'I am',
        value: org.potentialMemberDefinition,
      },
      {
        label: 'and I want to join',
        value: org.name,
      },
    ]}
  />
);

type Props = {
  onConnectionPreview?: (connectionPreview: ConnectionPreview) => void;
  qrValue: QRCodeValue;
  style?: StyleProp<ViewStyle>;
};

export default function MembershipReview({
  onConnectionPreview, qrValue, style,
}: Props) {
  return (
    <ConnectionRequestProgress
      onConnectionPreview={onConnectionPreview}
      qrCodeValue={qrValue}
      reviewFrameProvider={reviewFrameProvider}
      style={style}
    />
  );
}

MembershipReview.defaultProps = {
  onConnectionPreview: () => {},
  style: {},
};
