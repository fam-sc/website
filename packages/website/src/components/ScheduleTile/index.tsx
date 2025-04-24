import { ReactNode } from 'react';

import { OptionalLink } from '../OptionalLink';
import { Typography } from '../Typography';

import styles from './index.module.scss';

import { Lesson } from '@/api/schedule/types';
import { PlaceIcon } from '@/icons/PlaceIcon';
import { TimeIcon } from '@/icons/TimeIcon';
import { PropsMap } from '@/types/react';
import { classNames } from '@/utils/classNames';

export type DivProps = PropsMap['div'];

export interface ScheduleTileProps extends DivProps {
  lesson: Lesson;
  isNow?: boolean;
}

const lessonTypeTextMap: Record<Lesson['type'], string> = {
  lec: 'Лекція',
  lab: 'Лаба',
  prac: 'Практика',
};

function IconRow({
  icon,
  className,
  children,
}: {
  icon: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={classNames(styles['icon-row'], className)}>
      {icon}
      {children}
    </div>
  );
}

export function ScheduleTile({
  lesson,
  className,
  isNow,
  ...rest
}: ScheduleTileProps) {
  return (
    <div className={classNames(styles.root, className)} {...rest}>
      <div className={styles.header}>
        <Typography className={styles.type} data-type={lesson.type}>
          {lessonTypeTextMap[lesson.type]}
        </Typography>

        {isNow ? (
          <Typography className={styles['now-indicator']}>Зараз</Typography>
        ) : null}
      </div>

      <Typography className={styles.name}>{lesson.name}</Typography>
      <OptionalLink href={lesson.teacher.link} linkVariant="clean">
        {lesson.teacher.name}
      </OptionalLink>

      {lesson.place.length > 0 ? (
        <IconRow icon={<PlaceIcon />}>
          <Typography>{lesson.place}</Typography>
        </IconRow>
      ) : null}

      <IconRow icon={<TimeIcon />} className={styles.time}>
        <Typography>{lesson.time}</Typography>
      </IconRow>
    </div>
  );
}
