import { compare, genSaltSync, hash } from 'bcrypt';

export const makeHash = (plain: string) => hash(plain, genSaltSync(10));

export const checkHash = (plain: string, hsh: string) => compare(plain, hsh);
