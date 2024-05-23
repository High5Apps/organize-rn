import React from 'react';
import type { FlagReportsPendingScreenProps } from '../../navigation';
import FlagReportsScreen from './FlagReportsScreen';

export default function FlagReportsPendingScreen({
  navigation,
}: FlagReportsPendingScreenProps) {
  return (
    <FlagReportsScreen <'FlagReportsPending'>
      handled={false}
      navigation={navigation}
    />
  );
}
