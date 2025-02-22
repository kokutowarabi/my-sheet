'use client'
import { create } from 'zustand';

type HeaderDragType = 'row' | 'column';

export interface OverColumn {
  id: string;
  columnOrder: number;
}

export interface OverRow {
  id: string;
  rowOrder: number;
}

interface DragState {
  activeDragId: string | null;
  activeHeaderDrag: { type: HeaderDragType; id: string } | null;
  overRows: OverRow[];
  overColumns: OverColumn[];
  setActiveDragId: (id: string | null) => void;
  setActiveHeaderDrag: (header: { type: HeaderDragType; id: string } | null) => void;
  setOverRows: (updater: OverRow[] | ((prev: OverRow[]) => OverRow[])) => void;
  setOverColumns: (updater: OverColumn[] | ((prev: OverColumn[]) => OverColumn[])) => void;
}

const useDragStore = create<DragState>((set) => ({
  activeDragId: null,
  activeHeaderDrag: null,
  overRows: [],
  overColumns: [],
  setActiveDragId: (id: string | null) => set({ activeDragId: id }),
  setActiveHeaderDrag: (header: { type: HeaderDragType; id: string } | null) =>
    set({ activeHeaderDrag: header }),
  setOverRows: (updater: OverRow[] | ((prev: OverRow[]) => OverRow[])) =>
    set((state) => ({
      overRows: typeof updater === 'function' ? (updater as (prev: OverRow[]) => OverRow[])(state.overRows) : updater,
    })),
  setOverColumns: (updater: OverColumn[] | ((prev: OverColumn[]) => OverColumn[])) =>
    set((state) => ({
      overColumns:
        typeof updater === 'function' ? (updater as (prev: OverColumn[]) => OverColumn[])(state.overColumns)
        : updater,
    })),
}));

export default useDragStore;
