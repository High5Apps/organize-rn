import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { ConnectionPreview, QRCodeValue } from '../../model';
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
  onConnectionPreview: (connectionPreview: ConnectionPreview) => void;
  onConnectionPreviewError: (errorMessage: string) => void;
  qrValue: QRCodeValue;
  style?: StyleProp<ViewStyle>;
};

export default function ConnectionReview({
  onConnectionPreview, onConnectionPreviewError, qrValue, style = {},
}: Props) {
  return (
    <ConnectionRequestProgress
      onConnectionPreview={onConnectionPreview}
      onConnectionPreviewError={onConnectionPreviewError}
      qrCodeValue={qrValue}
      reviewFrameProvider={reviewFrameProvider}
      style={style}
    />
  );
}
