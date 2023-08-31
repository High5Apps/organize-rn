import { Dispatch, SetStateAction } from 'react';
import type { QRCodeValue } from '../../model';

export type SetQRValue = Dispatch<SetStateAction<QRCodeValue | null>>;

export type { NotableUserListRef } from './NotableUserListRef';
export type { OrgGraphRef } from './OrgGraphRef';
