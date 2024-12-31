import { create } from 'zustand';

import { EntityState, EntityStateOption } from '@/shared/enums';

interface State {
  state: Nullable<EntityState>;
  setState: (state: EntityState) => void;
}

export const useProfileCardStore = create<State>((set) => ({
  state: null,
  setState: (state) => set(() => ({ state })),
}));
