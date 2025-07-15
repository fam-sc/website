import { nullable, number, object, string, z } from 'zod/v4-mini';

export const newUserEventPayload = object({
  user: object({
    id: number(),
    firstName: string(),
    lastName: string(),
    parentName: nullable(string()),
    academicGroup: string(),
    email: string(),
    telnum: nullable(string()),
    registrationIp: nullable(string()),
  }),
});

export const newUserApprovedExternallyEventPayload = object({
  userId: number(),
});

export type NewUserEventPayload = z.infer<typeof newUserEventPayload>;
export type NewUserApprovedExternallyEventPayload = z.infer<
  typeof newUserApprovedExternallyEventPayload
>;
