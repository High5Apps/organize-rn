import React from 'react';
import { QRCodeValue } from '../../model';
import ReviewFrame from './ReviewFrame';

type Props = {
  qrValue: QRCodeValue;
};

export default function MembershipReview({ qrValue }: Props) {
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
    />
  );
}
