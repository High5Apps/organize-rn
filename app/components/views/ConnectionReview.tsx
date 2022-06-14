import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { QRCodeValue, User } from '../../model';
import ReviewFrame from './ReviewFrame';

type Props = {
  qrValue: QRCodeValue;
  style?: StyleProp<ViewStyle>;
};

export default function ConnectionReview({ qrValue, style }: Props) {
  const { sharedBy: userData } = qrValue;
  const user = User(userData);
  return (
    <ReviewFrame
      labeledValues={[
        {
          label: 'I want to connect with',
          value: user.pseudonym(),
        },
      ]}
      style={style}
    />
  );
}

ConnectionReview.defaultProps = {
  style: {},
};
