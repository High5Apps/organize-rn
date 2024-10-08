import React from 'react';
import { act, create, ReactTestRenderer } from 'react-test-renderer';
import Navigation from '../../app/navigation';
import WelcomeStack from '../../app/navigation/WelcomeStack';
import OrgTabs from '../../app/navigation/OrgTabs';
import { fakeCurrentUserData } from '../FakeData';
import useCurrentUser from '../../app/model/context/consumers/CurrentUser';
import { VerificationScreen, WelcomeScreen } from '../../app/screens';

jest.mock('../../app/model/context/consumers/CurrentUser');
const mockUseCurrentUser = useCurrentUser as jest.Mock;

async function renderNavigation() {
  let renderer: ReactTestRenderer | undefined;
  await act(async () => {
    renderer = create(<Navigation />);
  });
  const root = renderer?.root;
  const unmount = async () => act(async () => renderer?.unmount());
  return { root, unmount };
}

describe('Navigation', () => {
  it('renders WelcomeStack and WelcomeScreen when current user absent', async () => {
    mockUseCurrentUser.mockReturnValue({ currentUser: undefined });
    const { root, unmount } = await renderNavigation();
    expect(root?.findByType(WelcomeStack)).toBeTruthy();
    expect(root?.findByType(WelcomeScreen)).toBeTruthy();
    expect(root?.findAllByType(VerificationScreen).length).toBeFalsy();
    expect(root?.findAllByType(OrgTabs).length).toBeFalsy();
    await unmount();
  });

  it('renders WelcomeStack and WelcomeScreen when current user null', async () => {
    mockUseCurrentUser.mockReturnValue({ currentUser: null });
    const { root, unmount } = await renderNavigation();
    expect(root?.findByType(WelcomeStack)).toBeTruthy();
    expect(root?.findByType(WelcomeScreen)).toBeTruthy();
    expect(root?.findAllByType(VerificationScreen).length).toBeFalsy();
    expect(root?.findAllByType(OrgTabs).length).toBeFalsy();
    await unmount();
  });

  it('renders WelcomeStack and VerificationScreen if current user org is unverified', async () => {
    const currentUserWithUnverifiedOrg = {
      ...fakeCurrentUserData,
      org: { ...fakeCurrentUserData.org, unverified: true },
    };
    mockUseCurrentUser.mockReturnValue({
      currentUser: currentUserWithUnverifiedOrg,
    });
    const { root, unmount } = await renderNavigation();
    expect(root?.findByType(WelcomeStack)).toBeTruthy();
    expect(root?.findByType(VerificationScreen)).toBeTruthy();
    expect(root?.findAllByType(OrgTabs).length).toBeFalsy();
    await unmount();
  });

  it('renders OrgTabs when current user present', async () => {
    mockUseCurrentUser.mockReturnValue({ currentUser: fakeCurrentUserData });
    const { root, unmount } = await renderNavigation();
    expect(root?.findAllByType(WelcomeStack).length).toBeFalsy();
    expect(root?.findByType(OrgTabs)).toBeTruthy();
    await unmount();
  });
});
