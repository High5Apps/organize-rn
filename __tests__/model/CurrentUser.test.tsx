import { CurrentUser } from '../../app/model/context/consumers/CurrentUser';
import { storeCurrentUserData } from '../../app/model/context/providers/caches/CurrentUserDataStorage';
import { useResetContext } from '../../app/model/context/providers/Context';
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

jest.mock('../../app/model/context/providers/Context');
const mockUseResetContext = useResetContext as jest.Mock;
const mockResetContext = jest.fn();
mockUseResetContext.mockReturnValue({ resetContext: mockResetContext });

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
      mockResetContext,
    );

    it('should delete keys', async () => {
      await mockCurrentUser.logOut();
      expect(mockEccDelete).toHaveBeenCalled();
      expect(mockRsaDelete).toHaveBeenCalled();
    });

    it('should reset context', async () => {
      await mockCurrentUser.logOut();
      expect(mockResetContext).toHaveBeenCalled();
    });

    it('should store null user', async () => {
      await mockCurrentUser.logOut();
      expect(mockStoreCurrentUserData).toHaveBeenCalledWith(null);
    });

    it('should call UserAPI.leaveOrg', async () => {
      await mockCurrentUser.logOut();
      expect(mockLeaveOrg).toHaveBeenCalled();
    });

    it('should throw on UserAPI.leaveOrg error', async () => {
      const message = 'test error';
      mockLeaveOrg.mockRejectedValue(new Error(message));
      expect(mockCurrentUser.logOut).rejects.toThrow(message);
    });
  });
});
