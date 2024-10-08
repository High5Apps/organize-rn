import type { NewOrgParam } from '../navigation';

// Min included, max excluded, i.e. the interval [min, max)
function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}

type NewOrgStep = {
  body: string;
  header: string;
  headline: string;
  iconName: string;
  maxLength: number;
  message?: string;
  messageMultiline: boolean;
  param: NewOrgParam;
  paramType: 'string' | 'email';
  placeholder: () => string;
  title: string;
};

const message = 'You can change this later';

const NewOrgSteps: NewOrgStep[] = [
  {
    body: 'You can name your Org anything your want, but usually they\'re called locals. For example, you might name your Org "Local 4286" or "Local 552."',
    header: 'Name',
    headline: 'What should I name my Org?',
    iconName: 'badge',
    maxLength: 35,
    message,
    messageMultiline: false,
    param: 'name',
    paramType: 'string',
    placeholder: () => `Local ${randomIntFromInterval(100, 10000)}`,
    title: 'Name Your Org',
  },
  {
    body: 'An Org is strongest and healthiest once it recruits 70% of the people that fit its potential member definition.\n\nIf your definition is too broad, it\'ll be hard to hit 70%. If your definition is too strict, it\'ll be easier to hit 70%, but your Org may be too small to really benefit from "strength in numbers."\n\nThe most common definition is to include every employee at your workplace who isn\'t in management.',
    header: 'Potential Member Definition',
    headline: 'How do I decide who can join?',
    iconName: 'menu-book',
    maxLength: 75,
    message,
    messageMultiline: true,
    param: 'memberDefinition',
    paramType: 'string',
    placeholder: () => 'An employee of *employer* at *location*',
    title: 'Define Who Can Join',
  },
  {
    body: 'The app developers will email this address if they need to contact your Org.\n\nWhether your Org has 10 members or 10,000, this email is the single point of contact for your entire Org.',
    header: 'Email',
    headline: 'Why do you need my email?',
    iconName: 'mail',
    maxLength: 100,
    message,
    messageMultiline: false,
    param: 'email',
    paramType: 'email',
    placeholder: () => 'email@example.com',
    title: 'Add Your Email',
  },
];

export default NewOrgSteps;
