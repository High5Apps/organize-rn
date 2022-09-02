import { Dispatch, SetStateAction } from 'react';
import type { QRCodeValue } from '../../model';

export type QRValueFilter = (value: QRCodeValue) => boolean;
export type SetQRValue = Dispatch<SetStateAction<QRCodeValue | null>>;
