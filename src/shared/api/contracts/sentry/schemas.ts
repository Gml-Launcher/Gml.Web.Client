export type BaseSentryError = {
  bugs: SentryError[];
  countUsers: number;
  count: number;
}

export type BaseSentryException = {
  exception: string;
  countUsers: number;
  count: number;
  operationSystems: SentryOperationSystem[];
  bugInfo: BugInfo;
}

// Sentry

type SentryError = {
  exception: string;
  countUsers: number;
  count: number;
  graphics: SentryGraphic[]
}

type SentryGraphic = {
  count: number;
  date: string;
}

type SentryOperationSystem = {
  count: number;
  osType: string;
}

// Sentry BUG INFO
interface BugInfo {
  id: string;
  pcName: string;
  username: string;
  memoryInfo: MemoryInfo;
  exceptions: Exception[];
  sendAt: string;
  ipAddress: string;
  osVeriosn: string;
  osIdentifier: string;
}

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
