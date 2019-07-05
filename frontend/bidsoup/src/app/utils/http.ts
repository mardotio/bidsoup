import { redirectToLogin } from '@app/login/actions/loginActions';
import { Option, none, fromNullable } from 'fp-ts/lib/Option';
import { TaskEither, tryCatch, fromLeft, taskEither, fromEither } from 'fp-ts/lib/TaskEither';
import { Errors, Decoder } from 'io-ts';
import { getCookie } from './utils';
import { pipe, curry } from 'fp-ts/lib/function';

export class Http {
  // tslint:disable-next-line:no-any
  public static getJson = async <T>(uri: string, func: (json: any) => Option<T>) => {
    const response = await fetch(uri);
    if (response.status !== 401 && response.status !== 403) {
      return func(await response.json());
    }
    const next = window.location.pathname;
    redirectToLogin(next);
    return none;
  }
}

export interface ResponseCodeMap {
  codes: number[];
  handler: (response: unknown) => void;
}

interface PreError {
  kind: 'pre';
  error: string;
}
const createPreError = (error: string): PreError => ({kind: 'pre', error: error});

interface FetchError {
  kind: 'fetch';
  error: unknown;
}
const createFetchError = (error: unknown): FetchError => ({kind: 'fetch', error: error});

interface InvalidResponseCodeError {
  kind: 'code';
  response: Response;
}
const createInvalidResponseCodeError = (response: Response): InvalidResponseCodeError =>
  ({kind: 'code', response: response});

interface DecoderError {
  kind: 'decode';
  errors: Errors;
}
const createDecoderError = (errors: Errors): DecoderError => ({kind: 'decode', errors: errors});

export type HttpError = PreError | FetchError | InvalidResponseCodeError | DecoderError;

export class Http2 {
  public static get = (uri: string) => {
    return tryCatch(() => fetch(uri), createFetchError);
  }

  public static post = (uri: string, body: unknown): TaskEither<HttpError, Response> => {
    return tryCatch(
      () => {
        return fromNullable(getCookie('csrftoken')).map(c =>
          fetch(uri, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-CsrfToken': c
            },
            body: JSON.stringify(body)
          })
        ).getOrElseL(() => Promise.reject('Token missing from cookie'));
      },
      createPreError);
  }

  public static filterCodes = (codes: number[], resp: TaskEither<HttpError, Response>) => (
    resp.chain(r => codes.indexOf(r.status) > -1
      ? taskEither.of(r)
      : fromLeft<HttpError, Response>(createInvalidResponseCodeError(r))
    )
  )

  public static decodeJson = <T>(decoder: Decoder<unknown, T>, resp: TaskEither<HttpError, Response>) => (
    resp.chain(r => tryCatch(async () => await r.json(), createFetchError))
      .chain(json => fromEither(decoder.decode(json).mapLeft(createDecoderError)))
  )

  public static mapCodes = (codeMap: ResponseCodeMap[], resp: TaskEither<HttpError, Response>) => (
    resp.map(async r => {
      const mappers = codeMap.reduce(
        (arr, m) => m.codes.indexOf(r.status) > -1 ? [...arr, m] : arr,
        []);
      if (mappers.length > 0) {
        const json = await r.json();
        mappers.forEach(m => m.handler(json));
      }
    })
  )

  public static handleAuthError = (err: HttpError) => {
    if (err.kind === 'code' && [401, 403].indexOf(err.response.status) > -1) {
      redirectToLogin(window.location.pathname);
    }
    return err;
  }

}

export namespace Http2 {
  export class Defaults {
    public static get = <T>(url: string, decoder: Decoder<unknown, T>) => (
      pipe(
        Http2.get,
        curry(Http2.filterCodes)([200]),
        curry(Http2.decodeJson)(decoder)
      )(url)
      .mapLeft(Http2.handleAuthError)
    )

    public static post = <T, U>(url: string, body: T, decoder: Decoder<unknown, U>) => (
      pipe(
        curry(Http2.post)(url),
        curry(Http2.filterCodes)([200, 201]),
        curry(Http2.decodeJson)(decoder)
      )(body)
      .mapLeft(Http2.handleAuthError)
    )
  }
}
