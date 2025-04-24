export type UpdateTimeType = 'groups' | 'schedule' | 'schedule-teachers';

export type UpdateTime = {
  type: UpdateTimeType;
  time: number;
};
