import NewOrgScreen from './NewOrgScreen';

const NameOrgScreen = () => NewOrgScreen({
  maxLength: 35,
  message: 'Don’t worry- you can change the info in any of these steps later.',
  placeholder: 'ex. Local 9918',
  title: 'Name Your Org',
});

export default NameOrgScreen;
