import { nullable, number, object, string } from 'zod/v4-mini';

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
