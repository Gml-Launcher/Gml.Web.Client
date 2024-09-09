import { ResponseBaseEntity } from "@/shared/api/schemas";
import {
  BaseSentryError,
  BaseSentryException,
  BaseSentryStats,
  BaseSentrySummary,
} from "@/shared/api/contracts/sentry/schemas";

export type TGetSentryErrorsRequest = {};
export type TGetSentryErrorsResponse = ResponseBaseEntity & {
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
