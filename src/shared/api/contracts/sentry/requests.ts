import { ResponseBaseEntity } from "@/shared/api/schemas";
import {
  BaseSentryError,
  BaseSentryException,
  BaseSentryStats,
  BaseSentrySummary,
} from "@/shared/api/contracts/sentry/schemas";
import { ProjectTypeEnum } from "@/shared/enums/projectType";

export type TPostSentryErrorsRequest = {
  projectType: ProjectTypeEnum;
  dataFrom: string;
  dataTo: string;
};
export type TPostSentryErrorsResponse = ResponseBaseEntity & {
  data: BaseSentryError;
};

export type TPostSentryFilterErrorsListRequest = {
  projectType: ProjectTypeEnum;
  dataFrom: string;
  dataTo: string;
};
export type TPostSentryFilterErrorsListResponse = ResponseBaseEntity & {
  data: BaseSentryError;
};

export type TPostSentryFilterErrorsRequest = {
  projectType: ProjectTypeEnum;
  dataFrom: string;
  dataTo: string;
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
