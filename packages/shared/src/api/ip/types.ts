import { enum as zodEnum, object, string, z } from 'zod/v4-mini';

export const ipResponse = object({
  status: zodEnum(['success', 'fail']),
  query: string(),
  country: string(),
  regionName: string(),
  city: string(),
});

export type IpResponse = z.infer<typeof ipResponse>;
