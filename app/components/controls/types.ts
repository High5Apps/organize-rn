import { Dispatch, SetStateAction } from 'react';
import type { QRCodeValue } from '../../model';
import type { LeadStackParamList } from '../../navigation';

export type SetQRValue = Dispatch<SetStateAction<QRCodeValue | null>>;

export type LeadItem = {
  destination: keyof LeadStackParamList;
  iconName: string;
  title: string;
};
