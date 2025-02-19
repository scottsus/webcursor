import { z } from "zod";

export const getGreetingResponseSchema = z.object({
  greeting: z.string(),
});
