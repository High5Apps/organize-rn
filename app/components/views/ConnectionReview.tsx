import React from 'react';
import { QRCodeValue, User } from '../../model';
import ReviewFrame from './ReviewFrame';

type Props = {
  qrValue: QRCodeValue;
};

export default function ConnectionReview({ qrValue }: Props) {
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
    />
  );
}
