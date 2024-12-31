'use client';

import { TooltipProvider as TooltipProviderBase } from '@/shared/ui/tooltip';

interface TooltipProviderProps {
  children: React.ReactNode;
}

export function TooltipProvider({ children }: TooltipProviderProps) {
  return <TooltipProviderBase>{children}</TooltipProviderBase>;
}
