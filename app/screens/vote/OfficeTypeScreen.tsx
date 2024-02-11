import React from 'react';
import { OfficeList, ScreenBackground } from '../../components';

export default function OfficeTypeScreen() {
  return (
    <ScreenBackground>
      <OfficeList onPress={(item) => console.log(`Press ${item.title}`)} />
    </ScreenBackground>
  );
}
