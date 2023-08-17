/* eslint-disable @typescript-eslint/indent */
import {
  CompositeNavigationProp, CompositeScreenProps, NavigatorScreenParams,
} from '@react-navigation/native';
import {
  NativeStackNavigationProp, NativeStackScreenProps,
} from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

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
  ConnectStack: undefined;
  DiscussStack: undefined;
  VoteStack: undefined;
  OrgStack: undefined;
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

export type PostScreenParams = {
  postId: string;
};

export type DiscussStackParamList = {
  Discuss: undefined;
  NewPost: undefined;
  Post: PostScreenParams;
};

export type DiscussStackScreenProps<T extends keyof DiscussStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<DiscussStackParamList, T>,
    OrgTabsScreenProps<keyof OrgTabsParamList>
  >;

export type DiscussScreenProps = DiscussStackScreenProps<'Discuss'>;
export type NewPostScreenProps = DiscussStackScreenProps<'NewPost'>;
export type PostScreenProps = DiscussStackScreenProps<'Post'>;

export type VoteStackParamList = {
  Vote: undefined;
};

export type VoteStackScreenProps<T extends keyof VoteStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<VoteStackParamList, T>,
    OrgTabsScreenProps<keyof OrgTabsParamList>
  >;

export type VoteScreenProps = VoteStackScreenProps<'Vote'>;

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

// For more info, see
// https://reactnavigation.org/docs/typescript/#specifying-default-types-for-usenavigation-link-ref-etc
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
