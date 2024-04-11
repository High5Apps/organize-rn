import { useCallback, useMemo, useState } from 'react';
import { GENERIC_ERROR_MESSAGE } from './Errors';

type Props = {
  initialSelection?: string[];
  maxSelections?: number;
  onSyncSelection: (selection: string[]) => Promise<void>;
  onSyncSelectionError: (errorMessage: string) => void;
  options?: string[];
};

function quickDifference<T>(a: T[], b: T[]): T[] {
  const setB = new Set(b);
  return [...a].filter((value) => !setB.has(value));
}

export default function useSelectionUpdater({
  initialSelection, maxSelections: maybeMaxSelections, onSyncSelection,
  onSyncSelectionError, options: maybeOptions,
}: Props) {
  const maxSelections = maybeMaxSelections ?? 0;
  const options = maybeOptions ?? [];

  const selections = useMemo(() => initialSelection, [initialSelection]);
  const [
    waitingForDeselections, setWaitingForDeselections,
  ] = useState<string[]>([]);
  const [
    waitingForSelections, setWaitingForSelections,
  ] = useState<string[]>([]);

  // Toggle selections when multiple selections are allowed or when there's
  // only a single option to choose from
  const shouldToggleSelections = (maxSelections > 1)
    || (options.length === 1);

  const onNewSelection = useCallback(async (selection: string) => {
    let updatedSelections: string[];

    if (shouldToggleSelections) {
      if (selections?.includes(selection)) {
        // Remove selection when it was previously included
        updatedSelections = selections.filter((s) => s !== selection);
      } else {
        // Add selection when it wasn't previously included
        updatedSelections = [...(selections ?? []), selection];
      }
    } else {
      // Return early when the selection was unchanged
      const wasAlreadySelected = (selections?.length === 1)
        && (selections[0] === selection);
      if (wasAlreadySelected) { return; }

      // Only include the selection
      updatedSelections = [selection];
    }

    setWaitingForDeselections(
      quickDifference(selections ?? [], updatedSelections),
    );
    setWaitingForSelections(
      quickDifference(updatedSelections, selections ?? []),
    );

    try {
      await onSyncSelection(updatedSelections);
    } catch (error) {
      let errorMessage = GENERIC_ERROR_MESSAGE;
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      onSyncSelectionError(errorMessage);
    }

    setWaitingForSelections([]);
    setWaitingForDeselections([]);
  }, [
    onSyncSelection, onSyncSelectionError, selections, shouldToggleSelections,
  ]);

  const getSelectionInfo = useCallback((selection: string) => {
    const previouslySelected = selections?.includes(selection);
    const waitingToSelect = waitingForSelections.includes(selection);
    const waitingToDeselect = waitingForDeselections.includes(selection);
    const waitingForChange = waitingToSelect || waitingToDeselect;
    const selected = waitingForChange ? (waitingToSelect || !waitingToDeselect)
      : previouslySelected;
    const disabledDueToWaiting = waitingForSelections.length > 0
      || waitingForDeselections.length > 0;
    const multipleSelectionsAllowed = maxSelections > 1;
    const selectionCount = (selections?.length ?? 0)
      + (waitingForSelections?.length ?? 0);
    const disabledDueToMaxSelections = multipleSelectionsAllowed
      && (selectionCount >= maxSelections)
      && !selected;
    const disabled = disabledDueToWaiting || disabledDueToMaxSelections;
    const showDisabled = disabledDueToMaxSelections || waitingForChange;

    return {
      disabled, selected, shouldToggleSelections, showDisabled,
    };
  }, [selections, waitingForDeselections, waitingForSelections]);

  const onRowPressed = useCallback(async (selection: string) => {
    try {
      await onNewSelection(selection);
    } catch (error) {
      console.error('Uncaught error in onNewSelection');

      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  }, [onNewSelection]);

  return { getSelectionInfo, onRowPressed };
}
