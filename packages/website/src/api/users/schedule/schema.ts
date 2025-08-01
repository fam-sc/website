import {
  boolean,
  int,
  maximum,
  minimum,
  nullable,
  number,
  object,
} from 'zod/v4-mini';

const time = nullable(number().check(int(), minimum(0), maximum(86_400)));

export const updateScheduleBotOptionsPayload = object({
  notificationEnabled: boolean(),
  startTime: time,
  endTime: time,
});
