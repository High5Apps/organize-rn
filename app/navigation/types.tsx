import {
  CompositeNavigationProp, CompositeScreenProps, NavigatorScreenParams,
} from '@react-navigation/native';
import {
  NativeStackNavigationProp, NativeStackScreenProps,
} from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import type {
  OfficeCategory, PermissionScope, PostCategory, QRValueRouteParams,
} from '../model';

export type RootStackParamList = {
  WelcomeStack: NavigatorScreenParams<WelcomeStackParamList>;
  OrgTabs: NavigatorScreenParams<OrgTabsParamList>;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type RootStackNavigationProp<T extends keyof RootStackParamList> =
  NativeStackNavigationProp<RootStackParamList, T>;

export type NewOrgScreenParams = {
  email?: string;
  memberDefinition?: string;
  name?: string;
  step: number;
};

export type OrgReviewParams = Required<Omit<NewOrgScreenParams, 'step'>>;

export type NewOrgParam = keyof OrgReviewParams;

export type WelcomeStackParamList = {
  JoinOrg: QRValueRouteParams | undefined;
  NewOrg: NewOrgScreenParams;
  OrgReview: OrgReviewParams;
  Verification: undefined;
  Welcome: undefined;
};

export type WelcomeStackScreenProps<T extends keyof WelcomeStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<WelcomeStackParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

export type WelcomeScreenProps = WelcomeStackScreenProps<'Welcome'>;
export type NewOrgScreenProps = WelcomeStackScreenProps<'NewOrg'>;
export type OrgReviewScreenProps = WelcomeStackScreenProps<'OrgReview'>;
export type JoinOrgScreenProps = WelcomeStackScreenProps<'JoinOrg'>;
export type VerificationScreenProps = WelcomeStackScreenProps<'Verification'>;

export type WelcomeStackNavigationProp<T extends keyof WelcomeStackParamList> =
  CompositeNavigationProp<
    NativeStackNavigationProp<WelcomeStackParamList, T>,
    RootStackNavigationProp<keyof RootStackParamList>
  >;
export type NewOrgScreenNavigationProp = WelcomeStackNavigationProp<'NewOrg'>;

export type OrgTabsParamList = {
  ConnectStack: NavigatorScreenParams<ConnectStackParamList>;
  DiscussStack: NavigatorScreenParams<DiscussStackParamList>;
  VoteStack: NavigatorScreenParams<VoteStackParamList>;
  OrgStack: NavigatorScreenParams<OrgStackParamList>;
  LeadStack: NavigatorScreenParams<LeadStackParamList>;
};

export type OrgTabsScreenProps<T extends keyof OrgTabsParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<OrgTabsParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

export type ConnectStackParamList = {
  Connect: undefined;
  NewConnection: QRValueRouteParams | undefined;
  NewWorkGroup: undefined;
  SelectWorkGroup: undefined;
  UnionCard: undefined;
};

export type ConnectStackScreenProps<T extends keyof ConnectStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<ConnectStackParamList, T>,
    OrgTabsScreenProps<keyof OrgTabsParamList>
  >;

export type ConnectScreenProps = ConnectStackScreenProps<'Connect'>;
export type NewConnectionScreenProps = ConnectStackScreenProps<'NewConnection'>;
export type NewWorkGroupScreenProps = ConnectStackScreenProps<'NewWorkGroup'>;
export type SelectWorkGroupScreenProps = ConnectStackScreenProps<'SelectWorkGroup'>;
export type UnionCardScreenProps = ConnectStackScreenProps<'UnionCard'>;

export type CommentThreadScreenParams = {
  commentId: string;
};

export type InsertedComment = {
  commentId: string;
  parentCommentId?: string;
};

export type PostScreenParams = {
  insertedComments?: InsertedComment[];
  postId: string;
};

export type NewCommentScreenParams = {
  postId: string;
};

export type NewPostScreenParams = {
  category?: PostCategory;
};

export type NewReplyScreenParams = {
  commentId: string;
  postId: string;
};

export type DiscussStackParamList = {
  CommentThread: CommentThreadScreenParams;
  DiscussTabs: NavigatorScreenParams<DiscussTabsParamList>;
  NewPost: NewPostScreenParams;
  Post: PostScreenParams;
  NewComment: NewCommentScreenParams;
  NewReply: NewReplyScreenParams;
};

export type DiscussStackScreenProps<T extends keyof DiscussStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<DiscussStackParamList, T>,
    OrgTabsScreenProps<keyof OrgTabsParamList>
  >;

export type CommentThreadScreenProps = DiscussStackScreenProps<'CommentThread'>;
export type NewPostScreenProps = DiscussStackScreenProps<'NewPost'>;
export type PostScreenProps = DiscussStackScreenProps<'Post'>;
export type NewCommentScreenProps = DiscussStackScreenProps<'NewComment'>;
export type NewReplyScreenProps = DiscussStackScreenProps<'NewReply'>;

export type DiscussScreenParams = {
  prependedPostId: string;
};

export type DiscussTabsParamList = {
  General: DiscussScreenParams | undefined;
  Grievances: DiscussScreenParams | undefined;
  Demands: DiscussScreenParams | undefined;
  Recent: DiscussScreenParams | undefined;
};

export type DiscussTabsScreenProps<T extends keyof DiscussTabsParamList> =
  CompositeScreenProps<
    MaterialTopTabScreenProps<DiscussTabsParamList, T>,
    DiscussStackScreenProps<keyof DiscussStackParamList>
  >;

export type DiscussGeneralScreenProps = DiscussTabsScreenProps<'General'>;
export type DiscussGrievancesScreenProps = DiscussTabsScreenProps<'Grievances'>;
export type DiscussDemandsScreenProps = DiscussTabsScreenProps<'Demands'>;
export type DiscussRecentScreenProps = DiscussTabsScreenProps<'Recent'>;

export type BallotScreenParams = {
  ballotId: string;
};

export type BallotPreviewsScreenParams = {
  prependedBallotId: string;
};

export type NewCandidacyAnnouncementScreenParams = {
  ballotId: string;
  candidateId: string;
};

export type NewElectionBallotScreenParams = {
  officeCategory: OfficeCategory
};

export type NewNominationScreenParams = {
  ballotId: string;
};

export type NominationScreenParams = {
  ballotId: string;
};

export type ResultScreenParams = {
  ballotId: string;
};

export type VoteStackParamList = {
  Ballot: BallotScreenParams;
  BallotPreviews: BallotPreviewsScreenParams | undefined;
  BallotType: undefined;
  NewCandidacyAnnouncement: NewCandidacyAnnouncementScreenParams;
  NewElectionBallot: NewElectionBallotScreenParams;
  NewMultipleChoiceBallot: undefined;
  NewNomination: NewNominationScreenParams;
  NewYesOrNoBallot: undefined;
  Nominations: NominationScreenParams;
  OfficeAvailability: undefined;
  Result: ResultScreenParams;
};

export type VoteStackScreenProps<T extends keyof VoteStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<VoteStackParamList, T>,
    OrgTabsScreenProps<keyof OrgTabsParamList>
  >;

export type BallotScreenProps = VoteStackScreenProps<'Ballot'>;
export type BallotPreviewsScreenProps = VoteStackScreenProps<'BallotPreviews'>;
export type BallotTypeScreenProps = VoteStackScreenProps<'BallotType'>;
export type NewCandidacyAnnouncementScreenProps = VoteStackScreenProps<'NewCandidacyAnnouncement'>;
export type NewElectionBallotScreenProps = VoteStackScreenProps<'NewElectionBallot'>;
export type NewMultipleChoiceBallotScreenProps = VoteStackScreenProps<'NewMultipleChoiceBallot'>;
export type NewNominationScreenProps = VoteStackScreenProps<'NewNomination'>;
export type NewYesNoBallotScreenProps = VoteStackScreenProps<'NewYesOrNoBallot'>;
export type NominationScreenProps = VoteStackScreenProps<'Nominations'>;
export type OfficeAvailabilityScreenProps = VoteStackScreenProps<'OfficeAvailability'>;
export type ResultScreenProps = VoteStackScreenProps<'Result'>;

export type OrgScreenParams = {
  selectedUserId: string;
};

export type OrgStackParamList = {
  LeaveOrg: undefined;
  Org: undefined | OrgScreenParams;
  Settings: undefined;
  TransparencyLog: undefined;
};

export type OrgStackScreenProps<T extends keyof OrgStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<OrgStackParamList, T>,
    OrgTabsScreenProps<keyof OrgTabsParamList>
  >;

export type LeaveOrgScreenProps = OrgStackScreenProps<'LeaveOrg'>;
export type OrgScreenProps = OrgStackScreenProps<'Org'>;
export type SettingsScreenProps = OrgStackScreenProps<'Settings'>;
export type TransparencyLogScreenProps = OrgStackScreenProps<'TransparencyLog'>;

export type OrgStackNavigationProp<T extends keyof OrgStackParamList> =
  CompositeNavigationProp<
    NativeStackNavigationProp<OrgStackParamList, T>,
    RootStackNavigationProp<keyof RootStackParamList>
  >;
export type SettingsScreenNavigationProp = (
  OrgStackNavigationProp<'Settings'>
);

export type BlockedMembersScreenParams = {
  prependedModerationEventId: string;
};

export type EditWorkGroupScreenParams = {
  workGroupId: string;
};

export type PermissionScreenParams = {
  scope: PermissionScope;
};

export type LeadStackParamList = {
  BlockMember: undefined;
  BlockedMembers: undefined | BlockedMembersScreenParams;
  EditOrg: undefined;
  EditWorkGroup: EditWorkGroupScreenParams;
  EditWorkGroups: undefined;
  FlagReportTabs: undefined | NavigatorScreenParams<FlagReportTabsParamList>;
  Lead: undefined;
  Moderation: undefined;
  Permission: PermissionScreenParams;
  Permissions: undefined;
  UnionCards: undefined;
};

export type LeadStackScreenProps<T extends keyof LeadStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<LeadStackParamList, T>,
    OrgTabsScreenProps<keyof OrgTabsParamList>
  >;

export type BlockMemberScreenProps = LeadStackScreenProps<'BlockMember'>;
export type BlockedMembersScreenProps = LeadStackScreenProps<'BlockedMembers'>;
export type EditOrgScreenProps = LeadStackScreenProps<'EditOrg'>;
export type EditWorkGroupScreenProps = LeadStackScreenProps<'EditWorkGroup'>;
export type EditWorkGroupsScreenProps = LeadStackScreenProps<'EditWorkGroups'>;
export type LeadScreenProps = LeadStackScreenProps<'Lead'>;
export type ModerationScreenProps = LeadStackScreenProps<'Moderation'>;
export type PermissionScreenProps = LeadStackScreenProps<'Permission'>;
export type PermissionsScreenProps = LeadStackScreenProps<'Permissions'>;
export type UnionCardsScreenProps = LeadStackScreenProps<'UnionCards'>;

export type FlagReportTabsParamList = {
  FlagReportsHandled: undefined;
  FlagReportsPending: undefined;
};

export type FlagReportTabsScreenProps<T extends keyof FlagReportTabsParamList> =
  CompositeScreenProps<
    MaterialTopTabScreenProps<FlagReportTabsParamList, T>,
    LeadStackScreenProps<keyof LeadStackParamList>
  >;

export type FlagReportsHandledScreenProps = FlagReportTabsScreenProps<'FlagReportsHandled'>;
export type FlagReportsPendingScreenProps = FlagReportTabsScreenProps<'FlagReportsPending'>;

// For more info, see
// https://reactnavigation.org/docs/typescript/#specifying-default-types-for-usenavigation-link-ref-etc
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
