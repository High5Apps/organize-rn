import { useCallback } from 'react';
import { updateWorkGroup as updateBackendWorkGroup } from '../../../networking';
import useCurrentUser from './CurrentUser';
import { useWorkGroupContext } from '../providers';
import { sanitizeSingleLineField } from '../../formatters';
import i18n from '../../../i18n';

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

export function getShiftIndex(shift?: string) {
  // Default to 0 if shift starts with 0, is undefined, or is NaN
  const parsedShiftIndex = (parseInt(shift ?? '1', 10) || 1) - 1;

  // Clamp to valid indicies (i.e. 0 to 2)
  const max = i18n.t('object.shiftNames', { returnObjects: true }).length;
  return Math.min(Math.max(parsedShiftIndex, 0), max - 1);
}

export function getShiftName(shift?: string) {
  const shiftIndex = getShiftIndex(shift);
  return i18n.t('object.shiftNames', { returnObjects: true })[shiftIndex];
}
