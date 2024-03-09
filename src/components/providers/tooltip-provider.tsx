"use client";

import React from "react";

import { TooltipProvider as TooltipProviderBase } from "@/components/ui/tooltip";

interface TooltipProviderProps {
  children: React.ReactNode;
}

export function TooltipProvider({ children }: TooltipProviderProps) {
  return <TooltipProviderBase>{children}</TooltipProviderBase>;
}
