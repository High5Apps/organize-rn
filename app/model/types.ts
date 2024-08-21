import type {
  BallotCategory, Nomination, OfficeAvailability, OfficeCategory, Optional, Org,
  User,
} from '../networking';
import { isOrg } from '../networking';
import type { PermissionItem } from './PermissionItems';

export type {
  BallotCategory, Nomination, OfficeCategory, PermissionItem,
};
export type {
  Ballot, BallotPreview, Candidate, Comment, FlagReport, ModeratableType,
  ModerationEvent, ModerationEventAction, MyPermission, OfficeAvailability, Org,
  OrgGraph, Permission, PermissionScope, Post, PostCategory, PostSort, Result,
  User, UserFilter, UserSort, VoteState,
} from '../networking';
export { OFFICE_CATEGORIES, POST_CATEGORIES, isDefined } from '../networking';

export type Office = Optional<OfficeAvailability, 'open'> & {
  iconName: string;
  title: string;
};

export type OfficeDuty = {
  category: OfficeCategory;
  duties: string[];
};

export type CurrentUserBaseData = {
  authenticationKeyId: string,
  encryptedGroupKey: string,
  id: string,
  localEncryptionKeyId: string,
};

export type CurrentUserData = CurrentUserBaseData & User & {
  org: Org;
};

export function isCurrentUserData(object: unknown): object is CurrentUserData {
  const currentUserData = (object as CurrentUserData);
  return currentUserData
    && isOrg(currentUserData.org)
    && currentUserData.authenticationKeyId?.length > 0
    && currentUserData.encryptedGroupKey?.length > 0
    && currentUserData.localEncryptionKeyId?.length > 0
    && currentUserData.id?.length > 0
    && currentUserData.pseudonym?.length > 0;
}

export type QRCodeValue = {
  groupKey: string;
  jwt: string;
};

export function isQRCodeValue(object: unknown): object is QRCodeValue {
  const qrCodeValue = (object as QRCodeValue);
  return (qrCodeValue?.jwt?.length > 0) && (qrCodeValue?.groupKey?.length > 0);
}

export type SettingsItem = {
  iconName: string;
  onPress: () => void;
  title: string;
};

export type SettingsSection = {
  title: string;
  data: SettingsItem[];
};

// Must return a base64 encoded signature (not base64Url)
export type Signer = ({ message }: { message: string }) => Promise<string>;

export type Scope = '*' | 'create:connections';

export function isNonNull<T>(argument: T | null): argument is T {
  return argument !== null;
}

export type BallotType = {
  category: BallotCategory;
  iconName: string;
  name: string;
};

type NewBallotSubtypeSelectionScreen = 'OfficeAvailability';
type NewBallotScreen = 'NewYesOrNoBallot' | 'NewMultipleChoiceBallot' | 'NewElectionBallot';

export type BallotTypeInfo = {
  category: BallotCategory;
  iconName: string;
  name: string;
  newScreenName: NewBallotScreen;
  subtypeSelectionScreenName?: NewBallotSubtypeSelectionScreen;
};

export type Model = {
  id: string;
};

export type NonPendingNomination = Nomination & {
  accepted: boolean;
};
