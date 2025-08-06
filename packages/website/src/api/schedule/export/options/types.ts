import { Color } from '@sc-fam/shared/api/google';

export { Color } from '@sc-fam/shared/api/google';

export type ExportScheduleOptions = {
  groupName: string;
  colors: Record<string, Color>;
  initialStartDate: string;
  initialEndDate: string;
};
