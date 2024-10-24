export interface SentryBug {
  id: string;
  pcName: string;
  username: string;
  memoryInfo: MemoryInfo;
  exceptions: Exception[];
  sendAt: string;
  ipAddress: string;
  osVersion: string;
  osIdentifier: string;
}

export interface Graphic {
  month: string;
  count: number;
}

export interface OperationSystem {
  count: number;
  osType: string;
}

export type BaseSentryError = {
  countUsers: number;
  count: number;
  exception: string;
  stackTrace: string;
  graphic: Graphic[];
  operationSystems: OperationSystem[];
  bugInfo: SentryBug;
};

export type BaseSentryException = {
  exception: string;
  countUsers: number;
  count: number;
  operationSystems: SentryOperationSystem[];
  bugInfo: SentryBug;
};

export type BaseSentryStats = {
  date: string;
  launcher: number;
  backend: number;
};

export type BaseSentrySummary = {
  totalBugs: number;
  bugsThisMonth: number;
  percentageChangeMonth: number;
  bugsToday: number;
  percentageChangeDay: number;
  fixBugs: number;
  percentageChangeDayFixBugs: number;
};

// Sentry

export type SentryError = {
  exception: string;
  countUsers: number;
  count: number;
  graphics: SentryGraphic[];
};

export type SentryGraphic = {
  month: string;
  count: number;
};

export type SentryOperationSystem = {
  count: number;
  osType: string;
};

// Sentry BUG INFO

interface Exception {
  type: string;
  valueData: string;
  module: string;
  threadId: number;
  id: number;
  crashed: boolean;
  current: boolean;
  stackTrace: StackTrace[];
}

interface StackTrace {
  filename: string;
  function: string;
  lineno: number;
  colno: number;
  absPath: string;
  inApp: boolean;
  package: string;
  instructionAddr: string;
  addrMode: string;
  functionId: string;
}

interface MemoryInfo {
  allocatedBytes: number;
  highMemoryLoadThresholdBytes: number;
  totalAvailableMemoryBytes: number;
  finalizationPendingCount: number;
  compacted: boolean;
  concurrent: boolean;
  pauseDurations: number[];
}
