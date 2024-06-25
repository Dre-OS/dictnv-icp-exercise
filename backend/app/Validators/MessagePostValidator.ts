import { z } from 'zod';

export default class MessagePostValidator {
  static schema = z.object({
    message: z.string().optional(),
  });

  static validate = this.schema.safeParse;
}