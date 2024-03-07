import { NIL as NIL_UUID } from 'uuid';
import { User } from './types';

// eslint-disable-next-line import/prefer-default-export
export default function NullUser(): User {
  return ({
    connectionCount: 0,
    id: NIL_UUID,
    joinedAt: new Date(),
    offices: [],
    pseudonym: ' ', // Non-empty string allows text height measurements to occur
    recruitCount: 0,
  });
}
