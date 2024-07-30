import React from 'react';
import { BallotType } from '../../../../model';
import IconRow from './IconRow';

type Props = {
  ballotType: BallotType
  onPress: () => void;
};

export default function BallotTypeRow({
  ballotType: { iconName, name }, onPress,
}: Props) {
  return <IconRow iconName={iconName} title={name} onPress={onPress} />;
}
