import NewOrgScreen from './NewOrgScreen';

const NameOrgScreen = () => NewOrgScreen({
  body: 'You can name your Org anything your want, but traditionally unions are called "locals." For example you might name your Org "Local 4286" or "Local 552."',
  headline: "What's in a name?",
  iconName: 'badge',
  maxLength: 35,
  message: "Don't worry- you can change the info in any of these steps later.",
  placeholder: 'ex. Local 9918',
  title: 'Name Your Org',
});

export default NameOrgScreen;
