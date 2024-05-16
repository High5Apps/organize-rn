import { Dispatch, SetStateAction } from 'react';
import type { QRCodeValue } from '../../model';

export type SetQRValue = Dispatch<SetStateAction<QRCodeValue | null>>;

export type LeadItem = {
  destination: 'EditOrg' | 'Permissions' | 'Moderation';
  iconName: string;
  title: string;
};

export type ModerationItem = {
  destination: 'FlagReportTabs';
  iconName: string;
  title: string;
};
