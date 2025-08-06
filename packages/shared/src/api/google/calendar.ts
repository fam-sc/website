import { fetchGoogleApi, fetchGoogleApiObject } from './base';

export type Calendar = {
  kind: 'calendar#calendar';
  id: string;
  description: string;
  summary: string;
  timeZone: string;
};

export type Date = (
  | {
      date: string;
    }
  | {
      dateTime: string;
    }
) & {
  timeZone: string;
};

export type Event = {
  start: Date;
  end: Date;
  eventType?:
    | 'birthday'
    | 'default'
    | 'focusTime'
    | 'fromGmail'
    | 'outOfOffice'
    | 'workingLocation';
  summary?: string;
  description?: string;
  location?: string;
  recurrence?: string[];
  visibility?: 'default' | 'public' | 'private' | 'confidential';
};

export type AddEventArgs = {
  calendarId: string;
  sendUpdates?: 'all' | 'externalOnly' | 'none';
};

export type AddCalendarBody = {
  summary: string;
};

export type AddCalendarListBody = {
  id: string;
  backgroundColor?: string;
  foregroundColor?: string;
  colorId?: string;
  defaultReminders?: {
    type: 'email' | 'popup';
    minutes: number;
  }[];
  hidden?: boolean;
  notificationSettings?: {
    notifications?: {
      method: 'email';
      type:
        | 'eventCreation'
        | 'eventChange'
        | 'eventCancellation'
        | 'eventResponse'
        | 'agenda';
    }[];
  };
  selected?: boolean;
  summaryOverride?: string;
};

export type Color = { background: string; foreground: string };

export type ColorsResponse = {
  kind: 'calendar#colors';
  calendar: Record<string, Color>;
};

export function addCalendar(access: string, body: AddCalendarBody) {
  return fetchGoogleApiObject<Calendar>(
    'POST',
    '/calendar/v3/calendars',
    access,
    body
  );
}

export function deleteCalendar(access: string, calendarId: string) {
  return fetchGoogleApi(
    'DELETE',
    `/calendar/v3/calendars/${calendarId}`,
    access
  );
}

export function addCalendarList(access: string, body: AddCalendarListBody) {
  return fetchGoogleApiObject<Calendar>(
    'POST',
    '/calendar/v3/users/me/calendarList',
    access,
    body
  );
}

export function patchCalendar(access: string, body: Partial<Calendar>) {
  return fetchGoogleApiObject<Calendar>(
    'PATCH',
    '/calendar/v3/users/me/calendar',
    access,
    body
  );
}

export function addEvent(access: string, args: AddEventArgs, body: Event) {
  let url = `/calendar/v3/calendars/${args.calendarId}/events`;
  if (args.sendUpdates !== undefined) {
    url += `?sendUpdates=${args.sendUpdates}`;
  }

  return fetchGoogleApiObject<Event>('POST', url, access, body);
}

export function getColors(access: string) {
  return fetchGoogleApiObject<ColorsResponse>(
    'GET',
    '/calendar/v3/colors',
    access
  );
}
