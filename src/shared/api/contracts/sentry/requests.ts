import {ResponseBaseEntity} from "@/shared/api/schemas";
import {BaseSentryError, BaseSentryException} from "@/shared/api/contracts/sentry/schemas";


export type TGetSentryErrorsRequest = {}
export type TGetSentryErrorsResponse = ResponseBaseEntity & {
  data: BaseSentryError
}

export type TGetSentryExceptionRequest = {}
export type TGetSentryExceptionResponse = ResponseBaseEntity & {
  data: BaseSentryException
}
