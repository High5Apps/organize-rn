import { useMemo } from 'react';
import { Linking, Share } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ENABLE_DEVELOPER_SETTINGS } from './Config';
import { useCurrentUser } from './context';
import { SettingsSection } from './types';
import type { SettingsScreenNavigationProp } from '../navigation';
import Email from './Email';
import { blogURI, privacyPolicyURI, termsOfServiceURI } from '../networking';
import { useTranslation } from '../i18n';

const REPO_URL = 'https://github.com/High5Apps/organize-rn';

export default function useSettings(): SettingsSection[] {
  const { currentUser } = useCurrentUser();
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const { t } = useTranslation();

  if (!currentUser) {
    console.warn('Expected current user to be set');
    return [];
  }

  return useMemo(() => {
    const settings = [
      {
        title: t('object.org'),
        data: [
          {
            iconName: 'delete',
            onPress: () => navigation.navigate('LeaveOrg'),
            title: t('action.leaveOrg'),
          },
          {
            iconName: 'visibility',
            onPress: () => navigation.navigate('TransparencyLog'),
            title: t('object.transparencyLog'),
          },
        ],
      },
      {
        title: t('object.communication'),
        data: [
          {
            iconName: 'mail',
            onPress: Email().openComposer,
            title: t('action.emailUs'),
          },
          {
            iconName: 'bug-report',
            onPress: Email({
              body: t('email.body.bugReport'),
              subject: t('email.subject.bugReport'),
            }).openComposer,
            title: t('action.reportBug'),
          },
        ],
      },
      {
        title: t('hint.about'),
        data: [
          {
            iconName: 'menu-book',
            onPress: () => Linking.openURL(blogURI),
            title: t('object.handbookTitle'),
          },
          {
            iconName: 'lock',
            onPress: () => Linking.openURL(privacyPolicyURI),
            title: t('object.privacyPolicy'),
          },
          {
            iconName: 'description',
            onPress: () => Linking.openURL(termsOfServiceURI),
            title: t('object.termsOfService'),
          },
          {
            iconName: 'code',
            onPress: () => Linking.openURL(REPO_URL),
            title: t('object.sourceCode'),
          },
        ],
      },
    ];

    if (ENABLE_DEVELOPER_SETTINGS) {
      settings.push({
        title: t('object.developer'),
        data: [
          {
            iconName: 'vpn-key',
            onPress: async () => {
              const groupKey = await currentUser.decryptGroupKey();
              Share.share({ message: groupKey });
            },
            title: t('action.shareGroupKey'),
          },
        ],
      });
    }

    return settings;
  }, [currentUser, ENABLE_DEVELOPER_SETTINGS, t]);
}
