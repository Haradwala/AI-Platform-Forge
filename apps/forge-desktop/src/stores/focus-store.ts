import { create } from 'zustand';

export type FocusRegion = 'editor' | 'dock' | 'sidebar' | 'activityBar' | 'ai' | null;

export interface FocusState {
  readonly currentFocus: FocusRegion;
  setFocus(region: FocusRegion): void;
}

export const useFocusStore = create<FocusState>((set) => ({
  currentFocus: null,
  setFocus: (region) => set({ currentFocus: region }),
}));
