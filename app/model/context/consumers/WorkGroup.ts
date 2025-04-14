import { useCallback } from 'react';
import { updateWorkGroup as updateBackendWorkGroup } from '../../../networking';
import useCurrentUser from './CurrentUser';
import { useWorkGroupContext } from '../providers';
import { sanitizeSingleLineField } from '../../formatters';

type UpdateProps = {
  department?: string;
  jobTitle?: string;
  shift?: string;
};

export default function useWorkGroup(workGroupId: string) {
  const { currentUser } = useCurrentUser();
  const { cacheWorkGroup, getCachedWorkGroup } = useWorkGroupContext();

  const updateWorkGroup = useCallback(async (props: UpdateProps) => {
    const { shift } = props;
    const previousWorkGroup = getCachedWorkGroup(workGroupId);

    if (!currentUser || !previousWorkGroup) {
      throw new Error('Expected currentUser and workGroup to be cached');
    }

    const department = sanitizeSingleLineField(props.department);
    const jobTitle = sanitizeSingleLineField(props.jobTitle);

    const jwt = await currentUser.createAuthToken({ scope: '*' });
    const { e2eEncrypt } = currentUser;
    const { errorMessage } = await updateBackendWorkGroup({
      department, e2eEncrypt, jobTitle, jwt, shift, workGroupId,
    });

    if (errorMessage !== undefined) {
      throw new Error(errorMessage);
    }

    cacheWorkGroup({
      ...previousWorkGroup,
      department,
      jobTitle: jobTitle!,
      shift: shift!,
    });
  }, [cacheWorkGroup, currentUser, workGroupId]);

  return { updateWorkGroup };
}
