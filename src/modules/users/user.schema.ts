import { MultipartFile } from '@fastify/multipart';
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

const MAX_FILE_SIZE: number = 500000;
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

export const userUpdateSchema = z.object({
  user: z.object({
    email: z.string().email().optional(),
    username: z.string().optional(),
    password: z.string().optional(),
    bio: z.string().optional(),
  }),
  image: z
    .custom<MultipartFile>(
      (value: any) =>
        value &&
        typeof value === 'object' &&
        value.type === 'file' &&
        value.toBuffer instanceof Function,
      { message: 'Please upload a file' },
    )
    .refine((file) => file.file.bytesRead <= MAX_FILE_SIZE, {
      message: 'Max file size is 5MB.',
    })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.mimetype), {
      message: '.jpg, .jpeg, .png and .webp files are accepted.',
    })
    .optional(),
});

export type TUserUpdateSchema = z.infer<typeof userUpdateSchema>;
