import {
  verify,
  sign,
  VerifyErrors,
  JwtPayload,
  SignOptions,
} from 'jsonwebtoken';
import { IUserClaims } from '../declarations/user';
import env from '../config/env';

export const generateAccessToken = (
  payload: IUserClaims,
  secret: string = env.ACCESS_TOKEN_SECRET,
  options: SignOptions = { expiresIn: '1d' },
): string => {
  return sign(payload, secret, options);
};

export const verifyToken = <T extends JwtPayload>(
  token: string,
  secret: string = env.ACCESS_TOKEN_SECRET,
) => {
  const res: unknown = verify(token, secret, (err, decoded) => ({
    error: err,
    result: decoded,
  }));
  return res as {
    error: VerifyErrors | null;
    result: T | undefined;
  };
};
