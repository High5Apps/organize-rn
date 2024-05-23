import React from 'react';
import type { FlagReportsHandledScreenProps } from '../../navigation';
import FlagReportsScreen from './FlagReportsScreen';

export default function FlagReportsHandledScreen({
  navigation,
}: FlagReportsHandledScreenProps) {
  return (
    <FlagReportsScreen <'FlagReportsHandled'>
      handled
      navigation={navigation}
    />
  );
}
