import { useState, useCallback, useRef, useEffect } from 'react';
import type { Section } from '@/lib/types';

const MAX_HISTORY = 50;

export interface PageHistoryState {
  sections: Section[];
  pageFields: {
    title: string;
    slug: string;
    description: string;
    published: boolean;
  };
}

export function usePageHistory(
  initial: PageHistoryState,
  onUndoRedo?: (action: 'undo' | 'redo') => void
) {
  const [past, setPast] = useState<PageHistoryState[]>([]);
  const [present, setPresent] = useState<PageHistoryState>(initial);
  const [future, setFuture] = useState<PageHistoryState[]>([]);
  const skipNextRef = useRef(false);

  useEffect(() => {
    if (skipNextRef.current) {
      skipNextRef.current = false;
      return;
    }
    setPresent(initial);
    setPast([]);
    setFuture([]);
  }, [initial.pageFields.title]); // reset on page change

  const canUndo = past.length > 0;
  const canRedo = future.length > 0;

  const pushState = useCallback((next: PageHistoryState) => {
    setPast((prev) => {
      const updated = [...prev, present].slice(-MAX_HISTORY);
      return updated;
    });
    setPresent(next);
    setFuture([]);
    skipNextRef.current = true;
  }, [present]);

  const updateSections = useCallback((sections: Section[]) => {
    pushState({ ...present, sections });
  }, [present, pushState]);

  const updatePageFields = useCallback((fields: Partial<PageHistoryState['pageFields']>) => {
    pushState({ ...present, pageFields: { ...present.pageFields, ...fields } });
  }, [present, pushState]);

  const undo = useCallback(() => {
    if (!canUndo) return;
    const prev = past[past.length - 1];
    setPast((p) => p.slice(0, -1));
    setFuture((f) => [present, ...f].slice(0, MAX_HISTORY));
    setPresent(prev);
    skipNextRef.current = true;
    onUndoRedo?.('undo');
  }, [canUndo, past, present, onUndoRedo]);

  const redo = useCallback(() => {
    if (!canRedo) return;
    const next = future[0];
    setFuture((f) => f.slice(1));
    setPast((p) => [...p, present].slice(-MAX_HISTORY));
    setPresent(next);
    skipNextRef.current = true;
    onUndoRedo?.('redo');
  }, [canRedo, future, present, onUndoRedo]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isMod = e.metaKey || e.ctrlKey;
      if (!isMod) return;
      if (e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if ((e.key === 'z' && e.shiftKey) || e.key === 'y') {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [undo, redo]);

  const resetHistory = useCallback((newPresent: PageHistoryState) => {
    setPast([]);
    setPresent(newPresent);
    setFuture([]);
    skipNextRef.current = true;
  }, []);

  return {
    present,
    canUndo,
    canRedo,
    undo,
    redo,
    updateSections,
    updatePageFields,
    pushState,
    resetHistory,
  };
}
