import { HTTPCode } from '@wonkledge/httpcode';

class FunctionalError<K extends string> extends Error {
  public specific: string | Record<string, any>;

  public httpCode: HTTPCode;

  constructor(message: K, httpCode: HTTPCode, specific?: string | Record<string, any>) {
    super();
    this.message = message;
    this.specific = specific || '';
    this.httpCode = httpCode;
    this.name = 'FunctionalError';
  }
}

export default FunctionalError;
