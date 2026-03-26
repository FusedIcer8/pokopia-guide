'use client';
import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

type ChecklistState = { [checklistName: string]: string[] };

export function useChecklist() {
  const [checklists, setChecklists] = useLocalStorage<ChecklistState>(
    'pokopia-checklists',
    {}
  );

  const isChecked = useCallback(
    (name: string, id: string) => {
      return (checklists[name] ?? []).includes(id);
    },
    [checklists]
  );

  const toggleCheck = useCallback(
    (name: string, id: string) => {
      setChecklists((prev: ChecklistState) => {
        const current = prev[name] ?? [];
        const updated = current.includes(id)
          ? current.filter((item) => item !== id)
          : [...current, id];
        return { ...prev, [name]: updated };
      });
    },
    [setChecklists]
  );

  const getProgress = useCallback(
    (name: string, total: number) => {
      const checked = (checklists[name] ?? []).length;
      return {
        checked,
        total,
        percent: total > 0 ? Math.round((checked / total) * 100) : 0,
      };
    },
    [checklists]
  );

  return { isChecked, toggleCheck, getProgress };
}
