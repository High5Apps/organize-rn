import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { QRCodeValue } from '../../model';
import { PreviewConnectionResponse } from '../../networking';
import ConnectionRequestProgress from './ConnectionRequestProgress';
import ReviewFrame from './ReviewFrame';

const reviewFrameProvider = ({ user }: PreviewConnectionResponse) => (
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
  qrValue: QRCodeValue;
  style?: StyleProp<ViewStyle>;
};

export default function ConnectionReview({ qrValue, style }: Props) {
  const { jwt: sharerJwt } = qrValue;

  return (
    <ConnectionRequestProgress
      reviewFrameProvider={reviewFrameProvider}
      sharerJwt={sharerJwt}
      style={style}
    />
  );
}

ConnectionReview.defaultProps = {
  style: {},
};
