import { CurrentUser } from '../../app/model/CurrentUser';
import { storeCurrentUserData } from '../../app/model/CurrentUserDataStorage';
import { fakeCurrentUser } from '../FakeData';
import Keys from '../../app/model/keys/Keys';

jest.mock('../../app/model/keys/Keys');
const mockKeys = Keys as jest.Mock;
const mockEccDelete = jest.fn();
const mockRsaDelete = jest.fn();
mockKeys.mockReturnValue({
  ecc: { delete: mockEccDelete },
  rsa: { delete: mockRsaDelete },
});

jest.mock('../../app/model/CurrentUserDataStorage');
const mockStoreCurrentUserData = storeCurrentUserData as jest.Mock;

const mockClearCurrentUser = jest.fn();

describe('useCurrentUser', () => {
  describe('logOut', () => {
    beforeEach(async () => {
      const mockCurrentUser = CurrentUser(fakeCurrentUser, mockClearCurrentUser);
      await mockCurrentUser.logOut();
    });

    it('should delete keys', () => {
      expect(mockEccDelete).toBeCalled();
      expect(mockRsaDelete).toBeCalled();
    });

    it('should clear currentUser', () => {
      expect(mockClearCurrentUser).toBeCalled();
    });

    it('should store null user', () => {
      expect(mockStoreCurrentUserData).toBeCalledWith(null);
    });
  });
});
