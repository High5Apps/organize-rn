import { useMemo } from 'react';
import { Linking, Share } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ENABLE_DEVELOPER_SETTINGS } from './Config';
import { useCurrentUser } from './context';
import { SettingsSection } from './types';
import type { SettingsScreenNavigationProp } from '../navigation';
import Email from './Email';
import { privacyPolicyURI, termsOfServiceURI } from '../networking';

const BUG_REPORT_BODY = 'Please describe the bug and add screenshots if possible. The more you can tell us, the quicker we can fix it.\n\nInclude things like what you expected to happen, what actually happened, and what you were doing in the app right before the bug happened. Thanks!\n\n';
const BUG_REPORT_SUBJECT = 'Organize Bug Report';
const REPO_URL = 'https://github.com/High5Apps/organize-rn';

export default function useSettings(): SettingsSection[] {
  const { currentUser } = useCurrentUser();
  const navigation = useNavigation<SettingsScreenNavigationProp>();

  if (!currentUser) {
    console.warn('Expected current user to be set');
    return [];
  }

  return useMemo(() => {
    const settings = [
      {
        title: 'Org',
        data: [
          {
            iconName: 'delete',
            onPress: () => navigation.navigate('LeaveOrg'),
            title: 'Leave Org',
          },
          {
            iconName: 'visibility',
            onPress: () => navigation.navigate('TransparencyLog'),
            title: 'Transparency Log',
          },
        ],
      },
      {
        title: 'Communication',
        data: [
          {
            iconName: 'mail',
            onPress: Email().openComposer,
            title: 'Email the App Developer',
          },
          {
            iconName: 'bug-report',
            onPress: Email({
              body: BUG_REPORT_BODY,
              subject: BUG_REPORT_SUBJECT,
            }).openComposer,
            title: 'Report a Bug',
          },
        ],
      },
      {
        title: 'About',
        data: [
          {
            iconName: 'lock',
            onPress: () => Linking.openURL(privacyPolicyURI),
            title: 'Privacy Policy',
          },
          {
            iconName: 'description',
            onPress: () => Linking.openURL(termsOfServiceURI),
            title: 'Terms of Service',
          },
          {
            iconName: 'code',
            onPress: () => Linking.openURL(REPO_URL),
            title: 'Source Code',
          },
        ],
      },
    ];

    if (ENABLE_DEVELOPER_SETTINGS) {
      settings.push({
        title: 'Developer',
        data: [
          {
            iconName: 'vpn-key',
            onPress: async () => {
              const groupKey = await currentUser.decryptGroupKey();
              Share.share({ message: groupKey });
            },
            title: 'Share Group Key',
          },
        ],
      });
    }

    return settings;
  }, [currentUser, ENABLE_DEVELOPER_SETTINGS]);
}
