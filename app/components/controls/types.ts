import { Dispatch, SetStateAction } from 'react';
import type { QRCodeValue } from '../../model';

export type SetQRValue = Dispatch<SetStateAction<QRCodeValue | null>>;
export type { PostType } from './PostTypeSelector';
