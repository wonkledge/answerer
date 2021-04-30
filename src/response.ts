import { HTTPCode } from '@wonkledge/httpcode';
import { Response } from 'express';
import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';
import { flow } from 'fp-ts/function';
import FunctionalError from './FunctionalError';

export interface JSONResponse<T> {
  httpCode: HTTPCode
  packet: {
    status: 'success',
    data: T,
    tracking_id: string
  }
}

export interface JSONErrorResponse {
  httpCode: HTTPCode
  packet: {
    status: 'error',
    message: string,
    data?: unknown,
    tracking_id: string
  }
}

const createSuccessResponse = (httpCode: HTTPCode, tracking_id: string) => <K>(data: K): JSONResponse<K> => ({
  httpCode,
  packet: {
    status: 'success',
    data,
    tracking_id,
  },
});

const createErrorResponse = (tracking_id: string) => <K extends string>(error: FunctionalError<K>): JSONErrorResponse => ({
  httpCode: error.httpCode,
  packet: {
    status: 'error',
    message: error.message,
    tracking_id,
    data: error.specific ? error.specific : undefined,
  },
});

const sendResponse = (res: Response) => <K>(response: JSONResponse<K> | JSONErrorResponse): T.Task<JSONResponse<any> | JSONErrorResponse> => {
  res.status(response.httpCode);
  res.send(response.packet);

  return T.of(response);
};

export const send = (res: Response, httpCode: HTTPCode, tracking_id: string):
(fa: TE.TaskEither<FunctionalError<any>, any>) => T.Task<JSONResponse<unknown> | JSONErrorResponse> => flow(
  TE.bimap(createErrorResponse(tracking_id), createSuccessResponse(httpCode, tracking_id)),
  TE.fold(sendResponse(res), sendResponse(res)),
);
