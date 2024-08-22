import { useCallback } from 'react';
import { ModerationEventAction } from '../../types';
import useCurrentUser from './CurrentUser';
import {
  createModerationEvent as _createModerationEvent, Moderatable, ModerationEvent,
} from '../../../networking';
import getErrorMessage from '../../ErrorMessage';
import { useModerationEventContext } from '../providers';

type CreateProps = {
  action: ModerationEventAction;
  moderatable: Moderatable;
};

export default function useModerationEvent() {
  const { currentUser } = useCurrentUser();
  const { cacheModerationEvent } = useModerationEventContext();

  const createModerationEvent = useCallback(async ({
    action, moderatable,
  }: CreateProps) => {
    if (!currentUser) { throw new Error('Expected current user'); }

    const jwt = await currentUser.createAuthToken({ scope: '*' });

    let errorMessage: string | undefined;
    let id: string | undefined;
    try {
      ({ errorMessage, id } = await _createModerationEvent({
        action,
        jwt,
        moderatableId: moderatable.id,
        moderatableType: moderatable.category,
      }));
    } catch (error) {
      errorMessage = getErrorMessage(error);
    }

    if (errorMessage !== undefined) {
      throw new Error(errorMessage);
    }

    const moderationEvent: Required<ModerationEvent> = {
      action,
      createdAt: new Date(),
      id: id!,
      moderatable,
      moderator: {
        id: currentUser.id,
        pseudonym: currentUser.pseudonym,
      },
    };
    cacheModerationEvent(moderationEvent);
    return moderationEvent;
  }, [currentUser]);

  return { createModerationEvent };
}
