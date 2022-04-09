import { LinkingOptions } from '@react-navigation/native';

const linking: LinkingOptions<ReactNavigation.RootParamList> = {
  prefixes: ['organize://'],
  config: {
    screens: {
      WelcomeStack: {
        initialRouteName: 'Welcome',
        screens: {
          NewOrg: 'orgs/new',
          OrgReview: 'orgs/review',
          JoinOrg: 'memberships/new',
          Welcome: 'welcome',
        },
      },
      OrgTabs: {
        screens: {
          ConnectStack: {
            screens: {
              Connect: 'connect',
            },
          },
          DiscussStack: {
            screens: {
              Discuss: 'discuss',
            },
          },
          VoteStack: {
            screens: {
              Vote: 'vote',
            },
          },
          OrgStack: {
            screens: {
              Org: 'org',
            },
          },
        },
      },
    },
  },
};

export default linking;
