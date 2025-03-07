import { TextInputProps } from 'react-native';
import type { NewOrgParam } from '../navigation';

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

const message = 'You can change this later';

const NewOrgSteps: NewOrgStep[] = [
  {
    autoCaptitalize: 'words',
    autoComplete: 'off',
    autoCorrect: true,
    body: 'You can name your Org anything your want, but usually they\'re called locals. For example, you might name your Org "Local 4286" or "Local 552."',
    header: 'Name',
    headline: 'What should I name my Org?',
    iconName: 'badge',
    keyboardType: 'default',
    maxLength: 35,
    message,
    messageMultiline: false,
    param: 'name',
    placeholder: () => `Local ${randomIntFromInterval(100, 10000)}`,
    title: 'Name Your Org',
  },
  {
    autoCaptitalize: 'sentences',
    autoComplete: 'off',
    autoCorrect: true,
    body: 'An Org is strongest and healthiest once it recruits 70% of the people that fit its potential member definition.\n\nIf your definition is too broad, it\'ll be hard to hit 70%. If your definition is too strict, it\'ll be easier to hit 70%, but your Org may be too small to really benefit from "strength in numbers."\n\nThe most common definition is to include every employee at your workplace who isn\'t in management.',
    header: 'Potential Member Definition',
    headline: 'How do I decide who can join?',
    iconName: 'menu-book',
    keyboardType: 'default',
    maxLength: 75,
    message,
    messageMultiline: true,
    param: 'memberDefinition',
    placeholder: () => 'An employee of *employer* at *location*',
    title: 'Define Who Can Join',
  },
  {
    autoCaptitalize: 'none',
    autoComplete: 'email',
    autoCorrect: false,
    body: 'The app developers will email this address if they need to contact your Org.\n\nWhether your Org has 10 members or 10,000, this email is the single point of contact for your entire Org.',
    header: 'Email',
    headline: 'Why do you need my email?',
    iconName: 'mail',
    keyboardType: 'email-address',
    maxLength: 100,
    message,
    messageMultiline: false,
    param: 'email',
    placeholder: () => 'email@example.com',
    title: 'Add Your Email',
  },
];

export default NewOrgSteps;
