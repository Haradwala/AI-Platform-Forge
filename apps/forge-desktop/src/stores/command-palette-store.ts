import { create } from 'zustand';

interface CommandPaletteState {
  isVisible: boolean;
  toggle: () => void;
  setVisible: (visible: boolean) => void;
}

export const useCommandPaletteStore = create<CommandPaletteState>((set) => ({
  isVisible: false,
  toggle: () => set((state) => ({ isVisible: !state.isVisible })),
  setVisible: (visible) => set({ isVisible: visible }),
}));
