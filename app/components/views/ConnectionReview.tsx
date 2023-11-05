import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { QRCodeValue } from '../../model';
import { ConnectionPreview } from '../../networking';
import ConnectionRequestProgress from './ConnectionRequestProgress';
import ReviewFrame from './ReviewFrame';

const reviewFrameProvider = ({ user }: ConnectionPreview) => (
  <ReviewFrame
    labeledValues={[
      {
        label: 'I want to connect with',
        value: user.pseudonym,
      },
    ]}
  />
);

type Props = {
  onConnectionPreview?: (connectionPreview: ConnectionPreview) => void;
  qrValue: QRCodeValue;
  style?: StyleProp<ViewStyle>;
};

export default function ConnectionReview({
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

ConnectionReview.defaultProps = {
  onConnectionPreview: () => {},
  style: {},
};
