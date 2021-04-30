import { HTTP_CODE } from '@wonkledge/httpcode';
import { FunctionalError } from '../src';

describe('FunctionalError constructor', () => {
  const error = new FunctionalError('my message', HTTP_CODE.INTERNAL_SERVER_ERROR);
  test('should extends Error', () => {
    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('FunctionalError');
  });

  test('should have property message', () => {
    expect('message' in error).toBeTruthy();
  });

  test('should have property specific', () => {
    expect('specific' in error).toBeTruthy();
  });

  test('should have property httpCode', () => {
    expect('httpCode' in error).toBeTruthy();
  });
});
