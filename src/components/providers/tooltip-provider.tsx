"use client";

import { TooltipProvider as TooltipProviderBase } from "@/components/ui/tooltip";
import React from "react";

interface TooltipProviderProps {
  children: React.ReactNode;
}

export function TooltipProvider({ children }: TooltipProviderProps) {
  return <TooltipProviderBase>{children}</TooltipProviderBase>;
}
