import z from 'zod';

export const userCreateSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string(),
});
export type TUserCreateSchema = z.infer<typeof userCreateSchema>;

export const userLoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
export type TUserLoginSchema = z.infer<typeof userLoginSchema>;
