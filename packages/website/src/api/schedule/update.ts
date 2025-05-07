import { Repository } from '@data/repo';

// Key is lesson ID (type-name-teacher.name), value is new link.
export type UpdateScheduleLinksPayload = Record<
  string,
  string | null | undefined
>;

export class ScheduleNotFoundError extends Error {}

export async function updateScheduleLinks(
  groupId: string,
  payload: UpdateScheduleLinksPayload
) {
  await using repo = await Repository.openConnection();

  await repo.transaction(async (trepo) => {
    const schedule = await trepo.schedule().findByGroup(groupId);
    console.log(schedule);
    if (schedule === null) {
      throw new ScheduleNotFoundError();
    }

    for (const week of [schedule.firstWeek, schedule.secondWeek]) {
      for (const { lessons } of week) {
        for (const lesson of lessons) {
          const id = `${lesson.type}-${lesson.name}-${lesson.teacher}`;
          const newLink = payload[id];

          if (newLink !== undefined) {
            lesson.link = newLink;
          }
        }
      }
    }

    await trepo.schedule().update(schedule);
  });
}
