'use client';

import { EntityState, EntityStateOption } from '@/shared/enums';

interface ClientStateProps {
  state: EntityState;
}

const stateColorMap: Record<EntityState, string> = {
  [EntityState.ENTITY_STATE_CREATED]: 'bg-gray-600',
  [EntityState.ENTITY_STATE_LOADING]: 'bg-orange-500',
  [EntityState.ENTITY_STATE_ACTIVE]: 'bg-green-600',
  [EntityState.ENTITY_STATE_DISABLED]: 'bg-red-500',
  [EntityState.ENTITY_STATE_INITIALIZE]: 'bg-orange-500',
  [EntityState.ENTITY_STATE_ERROR]: 'bg-red-500',
  [EntityState.ENTITY_STATE_NEED_COMPILE]: 'bg-blue-500',
  [EntityState.ENTITY_STATE_PACKING]: 'bg-orange-500',
};

export function ClientState({ state }: ClientStateProps) {
  return (
    <>
      <div className="flex gap-x-3 items-center">
        <span
          className={`flex items-center justify-center min-w-3 min-h-3 max-w-3 max-h-3 rounded-full after:flex after:rounded-full after:min-w-5 after:min-h-5 ${stateColorMap[state]} after:opacity-30 after:${stateColorMap[state]}`}
        ></span>
        <span
          className={`absolute items-center justify-center min-w-3 min-h-3 max-w-3 max-h-3 rounded-full after:flex after:rounded-full after:min-w-5 after:min-h-5 ${stateColorMap[state]} animate-ping after:opacity-30 after:${stateColorMap[state]}`}
        ></span>
        <span className="font-medium">
          {EntityStateOption[`OPTION_${state}` as keyof typeof EntityStateOption]}
        </span>
      </div>
    </>
  );
}
