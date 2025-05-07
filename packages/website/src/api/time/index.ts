import { fetchObject } from '@shared/fetch';

type ResponseContent = {
  dateTime: string;
};

// Returns current time in specified timezone without the reliance on client's time (it can be incorrectly set).
export async function getTrueCurrentTime(timeZone: string): Promise<Date> {
  const response = await fetchObject<ResponseContent>(
    `https://timeapi.io/api/time/current/zone?timeZone=${timeZone}`
  );

  const result = new Date(response.dateTime);
  if (Number.isNaN(result.getTime())) {
    throw new TypeError('Invalid date format');
  }

  return result;
}
