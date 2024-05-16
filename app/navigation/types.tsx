/* eslint-disable @typescript-eslint/indent */
import {
  CompositeNavigationProp, CompositeScreenProps, NavigatorScreenParams,
} from '@react-navigation/native';
import {
  NativeStackNavigationProp, NativeStackScreenProps,
} from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import type { OfficeCategory, PermissionScope, PostCategory } from '../model';

export type RootStackParamList = {
  WelcomeStack: NavigatorScreenParams<WelcomeStackParamList>;
  OrgTabs: NavigatorScreenParams<OrgTabsParamList>;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type RootStackNavigationProp<T extends keyof RootStackParamList> =
  NativeStackNavigationProp<RootStackParamList, T>;

export type NewOrgScreenParams = {
  definition?: string;
  name?: string;
  step: number;
};

export type OrgReviewParams = Required<Omit<NewOrgScreenParams, 'step'>>;

export type NewOrgParam = keyof OrgReviewParams;

export type WelcomeStackParamList = {
  JoinOrg: undefined;
  NewOrg: NewOrgScreenParams;
  OrgReview: OrgReviewParams;
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
  NewConnection: undefined;
};

export type ConnectStackScreenProps<T extends keyof ConnectStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<ConnectStackParamList, T>,
    OrgTabsScreenProps<keyof OrgTabsParamList>
  >;

export type ConnectScreenProps = ConnectStackScreenProps<'Connect'>;

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

export type OrgStackParamList = {
  Org: undefined;
  Settings: undefined;
};

export type OrgStackScreenProps<T extends keyof OrgStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<OrgStackParamList, T>,
    OrgTabsScreenProps<keyof OrgTabsParamList>
  >;

export type OrgScreenProps = OrgStackScreenProps<'Org'>;
export type SettingsScreenProps = OrgStackScreenProps<'Settings'>;

export type OrgStackNavigationProp<T extends keyof OrgStackParamList> =
  CompositeNavigationProp<
    NativeStackNavigationProp<OrgStackParamList, T>,
    RootStackNavigationProp<keyof RootStackParamList>
  >;
export type SettingsScreenNavigationProp = (
  OrgStackNavigationProp<'Settings'>
);

export type PermissionScreenParams = {
  scope: PermissionScope;
};

export type LeadStackParamList = {
  EditOrg: undefined;
  FlagTabs: undefined | NavigatorScreenParams<FlagTabsParamList>;
  Lead: undefined;
  Moderation: undefined;
  Permission: PermissionScreenParams;
  Permissions: undefined;
};

export type LeadStackScreenProps<T extends keyof LeadStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<LeadStackParamList, T>,
    OrgTabsScreenProps<keyof OrgTabsParamList>
  >;

export type EditOrgScreenProps = LeadStackScreenProps<'EditOrg'>;
export type LeadScreenProps = LeadStackScreenProps<'Lead'>;
export type ModerationScreenProps = LeadStackScreenProps<'Moderation'>;
export type PermissionScreenProps = LeadStackScreenProps<'Permission'>;
export type PermissionsScreenProps = LeadStackScreenProps<'Permissions'>;

export type FlagTabsParamList = {
  FlaggedHandled: undefined;
  FlaggedPending: undefined;
};

export type FlagTabsScreenProps<T extends keyof FlagTabsParamList> =
  CompositeScreenProps<
    MaterialTopTabScreenProps<FlagTabsParamList, T>,
    LeadStackScreenProps<keyof LeadStackParamList>
  >;

export type FlaggedHandledScreenProps = FlagTabsScreenProps<'FlaggedHandled'>;
export type FlaggedPendingScreenProps = FlagTabsScreenProps<'FlaggedPending'>;

// For more info, see
// https://reactnavigation.org/docs/typescript/#specifying-default-types-for-usenavigation-link-ref-etc
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
