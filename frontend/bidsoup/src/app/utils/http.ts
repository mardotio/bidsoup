import { redirectToLogin } from '@app/login/actions/loginActions';
import { Option, none } from 'fp-ts/lib/Option';

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
