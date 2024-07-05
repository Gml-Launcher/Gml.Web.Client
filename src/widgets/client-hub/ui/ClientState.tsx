"use client";

import { ProfileStateOption } from "@/shared/enums";

interface ClientStateProps {
  state: number;
}

const stateColorMap: Record<ClientStateProps["state"], string> = {
  0: "bg-gray-600",
  1: "bg-orange-500",
  2: "bg-green-600",
};

export function ClientState({ state }: ClientStateProps) {
  return (
    <>
      <div className="flex gap-x-3 items-center">
        <span
          className={`flex items-center justify-center w-3 h-3 rounded-full after:flex after:rounded-full after:min-w-5 after:min-h-5 ${stateColorMap[state]} after:opacity-30 after:${stateColorMap[state]}`}
        ></span>
        <span className="font-medium">
          {ProfileStateOption[`OPTION_${state}` as keyof typeof ProfileStateOption]}
        </span>
      </div>
    </>
  );
}
