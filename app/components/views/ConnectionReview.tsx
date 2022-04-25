import React from 'react';
import { QRCodeValue } from '../../model';
import ReviewFrame from './ReviewFrame';

type Props = {
  qrValue: QRCodeValue;
};

export default function ConnectionReview({ qrValue }: Props) {
  const { sharedBy: { pseduonym } } = qrValue;
  return (
    <ReviewFrame
      labeledValues={[
        {
          label: 'I want to connect with',
          value: pseduonym,
        },
      ]}
    />
  );
}
