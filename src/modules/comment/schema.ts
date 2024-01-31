import z from 'zod';

export const commentCreateSchema = z.object({
  comment: z.object({
    body: z.string().min(1),
  }),
});

export type TCommentCreateSchema = z.infer<typeof commentCreateSchema>;
