import { create } from 'zustand';

import { PlayerBaseEntity } from '@/shared/api/contracts';

interface State {
  players: PlayerBaseEntity[];
  setPlayers: (player: PlayerBaseEntity[]) => void;
  addPlayer: (player: PlayerBaseEntity) => void;
  removePlayer: (uuid: string) => void;
}

export const useGamePlayerStore = create<State>((set) => ({
  players: [],
  setPlayers: (players: PlayerBaseEntity[]) =>
    set(() => ({
      players: players,
    })),
  addPlayer: (player: PlayerBaseEntity) =>
    set((state) => ({
      players: [...state.players, player],
    })),
  removePlayer: (uuid: string) =>
    set((state) => ({
      players: state.players.filter((p) => p.uuid !== uuid),
    })),
}));
