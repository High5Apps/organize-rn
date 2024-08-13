import { CurrentUser } from '../../app/model/CurrentUser';
import { storeCurrentUserData } from '../../app/model/context/providers/caches/CurrentUserDataStorage';
import { fakeCurrentUserData, fakeJwtString } from '../FakeData';
import Keys from '../../app/model/keys/Keys';
import { leaveOrg } from '../../app/networking/UserAPI';

jest.mock('../../app/model/keys/Keys');
const mockKeys = Keys as jest.Mock;
const mockEccDelete = jest.fn();
const mockEccSign = jest.fn();
mockEccSign.mockReturnValue(fakeJwtString);
const mockRsaDelete = jest.fn();
mockKeys.mockReturnValue({
  ecc: { delete: mockEccDelete, sign: mockEccSign },
  rsa: { delete: mockRsaDelete },
});

jest.mock('../../app/model/context/providers/caches/CurrentUserDataStorage');
const mockStoreCurrentUserData = storeCurrentUserData as jest.Mock;

const mockSetCurrentUserData = jest.fn();
const mockCacheUser = jest.fn();

jest.mock('../../app/networking/UserAPI');
const mockLeaveOrg = leaveOrg as jest.Mock;
mockLeaveOrg.mockResolvedValue({});

describe('useCurrentUser', () => {
  describe('logOut', () => {
    const mockCurrentUser = CurrentUser(
      fakeCurrentUserData,
      mockSetCurrentUserData,
      mockCacheUser,
    );

    it('should delete keys', async () => {
      await mockCurrentUser.logOut();
      expect(mockEccDelete).toBeCalled();
      expect(mockRsaDelete).toBeCalled();
    });

    it('should clear currentUser', async () => {
      await mockCurrentUser.logOut();
      expect(mockSetCurrentUserData).toBeCalledWith(null);
    });

    it('should store null user', async () => {
      await mockCurrentUser.logOut();
      expect(mockStoreCurrentUserData).toBeCalledWith(null);
    });

    it('should call UserAPI.leaveOrg', async () => {
      await mockCurrentUser.logOut();
      expect(mockLeaveOrg).toBeCalled();
    });

    it('should throw on UserAPI.leaveOrg error', async () => {
      const message = 'test error';
      mockLeaveOrg.mockRejectedValue(new Error(message));
      expect(mockCurrentUser.logOut).rejects.toThrow(message);
    });
  });
});
