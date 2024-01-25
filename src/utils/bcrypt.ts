import { compare, genSaltSync, hash } from 'bcrypt';

export const hashPassword = (plain: string) =>
  new Promise<string>(async (resolve, reject) => {
    try {
      const result = await hash(plain, genSaltSync(10));
      return resolve(result);
    } catch (err) {
      return reject(err);
    }
  });

export const checkPassword = (plain: string, hsh: string) =>
  new Promise<boolean>(async (resolve, reject) => {
    try {
      const result = await compare(plain, hsh);
      return resolve(result);
    } catch (err) {
      return reject(err);
    }
  });
