import React from 'react';
import { render, screen } from '@testing-library/react-native';
import Navigation from '../../app/navigation';
import { fakeCurrentUserData } from '../FakeData';
import useCurrentUser from '../../app/model/context/consumers/CurrentUser';

const connectScreenText = 'Share the app';
const verificationScreenText = 'Account Verification';
const welcomeScreenText = 'Create Org';

jest.mock('../../app/model/context/consumers/CurrentUser');
const mockUseCurrentUser = useCurrentUser as jest.Mock;

function renderNavigation() {
  render(<Navigation />);
}

describe('Navigation', () => {
  it('renders WelcomeScreen when current user absent', async () => {
    mockUseCurrentUser.mockReturnValue({ currentUser: undefined });
    renderNavigation();
    expect(await screen.findByText(welcomeScreenText)).toBeDefined();
  });

  it('renders WelcomeStack and WelcomeScreen when current user null', async () => {
    mockUseCurrentUser.mockReturnValue({ currentUser: null });
    renderNavigation();
    expect(await screen.findByText(welcomeScreenText)).toBeDefined();
  });

  it('renders WelcomeStack and VerificationScreen if current user org is unverified', async () => {
    const currentUserWithUnverifiedOrg = {
      ...fakeCurrentUserData,
      org: { ...fakeCurrentUserData.org, unverified: true },
    };
    mockUseCurrentUser.mockReturnValue({
      currentUser: currentUserWithUnverifiedOrg,
    });
    renderNavigation();
    expect(await screen.findByText(verificationScreenText)).toBeDefined();
  });

  it('renders OrgTabs when current user present', async () => {
    mockUseCurrentUser.mockReturnValue({ currentUser: fakeCurrentUserData });
    renderNavigation();
    expect(await screen.findByText(connectScreenText)).toBeDefined();
  });
});
