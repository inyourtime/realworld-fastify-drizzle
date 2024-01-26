import { FastifyValidationResult } from 'fastify/types/schema';
import z from 'zod';
import { fromZodError } from 'zod-validation-error';

export const validate = (schema: unknown): FastifyValidationResult => {
  return (data: any) => {
    const zodParsedPayload = (<z.Schema>schema).safeParse(data);

    if (zodParsedPayload.success) return zodParsedPayload.data;

    const validationError = fromZodError(zodParsedPayload.error);
    return {
      error: validationError,
    };
  };
};

export default {
  validate,
};
