import { useCallback, useMemo, useState } from 'react';

type Props = {
  initialSelection?: string[];
  maxSelections?: number;
  onSyncSelection: (selection: string[]) => Promise<void>;
  options?: string[];
};

function quickDifference<T>(a: T[], b: T[]): T[] {
  const setB = new Set(b);
  return [...a].filter((value) => !setB.has(value));
}

export default function useSelectionUpdater({
  initialSelection, maxSelections, onSyncSelection, options,
}: Props) {
  const selections = useMemo(() => initialSelection, [initialSelection]);
  const [
    waitingForDeselections, setWaitingForDeselections,
  ] = useState<string[]>([]);
  const [
    waitingForSelections, setWaitingForSelections,
  ] = useState<string[]>([]);

  const onNewSelection = useCallback(async (selection: string) => {
    if (!options || !maxSelections) { return; }

    // Toggle selections when multiple selections are allowed or when there's
    // only a single option to choose from
    const shouldToggleSelections = (maxSelections > 1)
      || (options.length === 1);

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
    } catch {
      console.error('Uncaught error in onSyncSelection');
    }

    setWaitingForSelections([]);
    setWaitingForDeselections([]);
  }, [maxSelections, onSyncSelection, options, selections]);

  return {
    onNewSelection,
    selections,
    waitingForDeselections,
    waitingForSelections,
  };
}
