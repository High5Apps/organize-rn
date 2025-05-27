import { TextInputProps } from 'react-native';
import type { NewOrgParam } from '../navigation';
import i18n from '../i18n';

// Min included, max excluded, i.e. the interval [min, max)
function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}

type NewOrgStep = {
  autoCaptitalize: TextInputProps['autoCapitalize'];
  autoComplete: TextInputProps['autoComplete'];
  autoCorrect: TextInputProps['autoCorrect'];
  body: string;
  header: string;
  headline: string;
  iconName: string;
  keyboardType: TextInputProps['keyboardType'];
  maxLength: number;
  message?: string;
  messageMultiline: boolean;
  param: NewOrgParam;
  placeholder: () => string;
  title: string;
};

const message = i18n.t('hint.inputModifiable');

const NewOrgSteps: NewOrgStep[] = [
  {
    autoCaptitalize: 'words',
    autoComplete: 'off',
    autoCorrect: true,
    body: i18n.t('explanation.orgName'),
    header: i18n.t('object.name'),
    headline: i18n.t('question.orgName'),
    iconName: 'badge',
    keyboardType: 'default',
    maxLength: 35,
    message,
    messageMultiline: false,
    param: 'name',
    placeholder: () => `Local ${randomIntFromInterval(100, 10000)}`,
    title: i18n.t('action.initializeOrgName'),
  },
  {
    autoCaptitalize: 'sentences',
    autoComplete: 'off',
    autoCorrect: true,
    body: i18n.t('explanation.potentialMemberDefinition'),
    header: i18n.t('object.potentialMemberDefinition'),
    headline: i18n.t('question.potentialMemberDefinition'),
    iconName: 'menu-book',
    keyboardType: 'default',
    maxLength: 75,
    message,
    messageMultiline: true,
    param: 'memberDefinition',
    placeholder: () => i18n.t('placeholder.potentialMemberDefinition'),
    title: i18n.t('action.initializeOrgMemberDefinition'),
  },
  {
    autoCaptitalize: 'none',
    autoComplete: 'email',
    autoCorrect: false,
    body: i18n.t('explanation.orgEmail'),
    header: i18n.t('object.email'),
    headline: i18n.t('question.orgEmail'),
    iconName: 'mail',
    keyboardType: 'email-address',
    maxLength: 100,
    message,
    messageMultiline: false,
    param: 'email',
    placeholder: () => i18n.t('placeholder.email'),
    title: i18n.t('action.initializeOrgEmail'),
  },
];

export default NewOrgSteps;
