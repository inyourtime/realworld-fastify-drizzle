import Exception from '..';
import { STATUS_CODE } from '../../http/status';

export const Err401MissingAuth = Exception.new(
  'Missing authentication',
  STATUS_CODE.UNAUTHORIZED,
);

export const Err403TokenExpired = Exception.new(
  'Token is expired',
  STATUS_CODE.FORBIDDEN,
);

export const Err403TokenInvalid = Exception.new(
  'Token is invalid',
  STATUS_CODE.FORBIDDEN,
);
