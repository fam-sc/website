import { Time, timeBreakpoints } from '@sc-fam/shared-schedule';

import { Day } from '@/api/schedule/types';
import { classNames } from '@/utils/classNames';

import { ScheduleTile } from '../ScheduleTile';
import styles from './TileGroup.module.scss';
import { IndexedLesson } from './transform';

export type TileGroupProps = {
  day: Day;
  time: Time;
  isNow: boolean;
  isEditable?: boolean;
  lessons: IndexedLesson[];

  onLessonChanged: (value: IndexedLesson) => void;
};

export function TileGroup({
  day,
  time,
  isNow,
  lessons,
  isEditable,
  onLessonChanged,
}: TileGroupProps) {
  const timeBreakpoint = timeBreakpoints.indexOf(time) + 1;

  const style = {
    '--day': day,
    '--time': timeBreakpoint,
  };

  const baseTile = styles['base-tile'];
  const tileClassName = classNames(baseTile, styles.tile);

  const tiles = lessons.map(({ index, value: lesson }) => (
    <ScheduleTile
      key={`${day}-${lesson.time}-${index}`}
      className={tileClassName}
      lesson={lesson}
      isNow={isNow}
      isEditable={isEditable}
      style={style}
      onLinkChanged={(link) => {
        onLessonChanged({ index, value: { ...lesson, link } });
      }}
    />
  ));

  return tiles.length === 1 ? (
    tiles[0]
  ) : (
    <div className={baseTile} style={style}>
      {tiles}
    </div>
  );
}
