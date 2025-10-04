import { Color } from '@sc-fam/shared/api/google/calendar';

export { Color } from '@sc-fam/shared/api/google/calendar';

export type ExportScheduleOptions = {
  groupName: string;
  colors: Record<string, Color>;
  initialStartDate: string;
  initialEndDate: string;
};
