import { redirectToLogin } from '@app/login/actions/loginActions';
import { Option, none, fromNullable } from 'fp-ts/lib/Option';
import { TaskEither, tryCatch, fromLeft, taskEither, fromEither } from 'fp-ts/lib/TaskEither';
import { Errors, Decoder } from 'io-ts';
import { getCookie } from './utils';

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

export interface HttpError {
  reason: string;
  errors?: Errors;
}

interface PreError {
  kind: "pre";
  error: string;
}
const createPreError = (error: string): PreError => ({kind: "pre", error: error});

interface FetchError {
  kind: "fetch";
  error: any;
}
const createFetchError = (error: any): FetchError => ({kind: "fetch", error: error});

interface InvalidResponseCodeError {
  kind: "code";
  response: Response;
}
const createInvalidResponseCodeError = (response: Response): InvalidResponseCodeError =>
  ({kind: "code", response: response});


interface DecoderError {
  kind: "decode";
  errors: Errors;
}
const createDecoderError = (errors: Errors): DecoderError => ({kind: "decode", errors: errors});

export type HttpError2 = PreError | FetchError | InvalidResponseCodeError | DecoderError;

export class Http2 {
  public static get = (uri: string) => {
    return tryCatch(() => fetch(uri), createFetchError);
  }

  public static post = (uri: string, body: any): TaskEither<HttpError2, Response> => {
    return tryCatch(() => {
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

  public static filterCodes = (codes: number[], resp: TaskEither<HttpError2, Response>) => (
    resp.chain(r => codes.indexOf(r.status) > -1
      ? taskEither.of(r)
      : fromLeft<HttpError2, Response>(createInvalidResponseCodeError(r))
    )
  )

  public static decodeJson = <T>(decoder: Decoder<unknown, T>, resp: TaskEither<HttpError2, Response>) => (
    resp.chain(r => {
      return tryCatch(async () => {
        return await r.json();
      }, createFetchError);
    }).chain(json => {
      const decoded = decoder.decode(json);
      return fromEither(decoded.mapLeft(createDecoderError));
    })
  )
}
