import { ResponseBaseEntity } from '@/shared/api/schemas';
import {
  BaseSentryError,
  BaseSentryException,
  BaseSentryStats,
  BaseSentrySummary,
} from '@/shared/api/contracts/sentry/schemas';
import { ProjectTypeEnum } from '@/shared/enums';

export type TPostSentryErrorsRequest = {
  projectType: ProjectTypeEnum;
  dateFrom: string;
  dateTo: string;
};
export type TPostSentryErrorsResponse = ResponseBaseEntity & {
  data: BaseSentryError;
};

export type TPostSentryFilterErrorsListRequest = {
  projectType: ProjectTypeEnum;
  dateFrom: string;
  dateTo: string;
};
export type TPostSentryFilterErrorsListResponse = ResponseBaseEntity & {
  data: BaseSentryError[];
};

export type TPostSentryFilterErrorsRequest = {
  projectType: ProjectTypeEnum;
  dateFrom: string;
  dateTo: string;
};
export type TPostSentryFilterErrorsResponse = ResponseBaseEntity & {
  data: BaseSentryError;
};

export type TGetSentryExceptionRequest = {};
export type TGetSentryExceptionResponse = ResponseBaseEntity & {
  data: BaseSentryException;
};

export type TGetSentryStatsRequest = {};
export type TGetSentryStatsResponse = ResponseBaseEntity & {
  data: BaseSentryStats[];
};

export type TGetSentrySummaryRequest = {};
export type TGetSentrySummaryResponse = ResponseBaseEntity & {
  data: BaseSentrySummary;
};
