import { getStateFromPath, LinkingOptions } from '@react-navigation/native';
import { useCurrentUser } from '../model';
import { RootStackParamList } from './types';

type LinkingConfig = LinkingOptions<RootStackParamList>;

const linking: LinkingConfig = {
  prefixes: ['https://getorganize.app'],
  getStateFromPath(originalPath, options) {
    let path = originalPath;
    if (originalPath.startsWith('/connect')) {
      path = originalPath.replace('#', '?');
    }
    return getStateFromPath(path, options);
  },
};

export default function useLinkingConfig(): LinkingConfig | undefined {
  const { currentUser } = useCurrentUser();
  if (!currentUser) {
    return {
      ...linking,
      config: {
        screens: {
          WelcomeStack: {
            initialRouteName: 'Welcome',
            screens: {
              JoinOrg: 'connect',
            },
          },
        },
      },
    };
  }

  if (currentUser.org.unverified) {
    return undefined;
  }

  return {
    ...linking,
    config: {
      screens: {
        OrgTabs: {
          initialRouteName: 'ConnectStack',
          screens: {
            ConnectStack: {
              initialRouteName: 'Connect',
              screens: {
                NewConnection: 'connect',
              },
            } as any, // as any fixes https://github.com/react-navigation/react-navigation/issues/10876
          },
        },
      },
    },
  };
}
