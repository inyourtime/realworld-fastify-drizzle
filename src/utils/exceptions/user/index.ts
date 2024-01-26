import Exception from '..';
import { STATUS_CODE } from '../../http/status';

export const Err422UserExist = Exception.new(
  'Email or username are already exist',
  STATUS_CODE.UNPROCESSABLE_CONTENT,
);

export const Err401LoginFail = Exception.new(
  'Email or password are incorrect',
  STATUS_CODE.UNAUTHORIZED,
);

export const Err404UserNotFound = Exception.new(
  'User Not Found',
  STATUS_CODE.NOT_FOUND,
);
