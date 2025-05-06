'use client';

import { OptionalLink } from '../OptionalLink';
import { Typography } from '../Typography';

import styles from './index.module.scss';

import { Lesson } from '@/api/schedule/types';
import { PlaceIcon } from '@/icons/PlaceIcon';
import { TimeIcon } from '@/icons/TimeIcon';
import { PropsMap } from '@/types/react';
import { classNames } from '@/utils/classNames';
import { useState } from 'react';
import { IconButton } from '../IconButton';
import { UpDownIcon } from '@/icons/UpDownIcon';
import { Link } from '../Link';
import { LinkIcon } from '@/icons/LinkIcon';

export type DivProps = PropsMap['div'];

export interface ScheduleTileProps extends DivProps {
  lesson: Lesson;
  isEditable?: boolean;
  isNow?: boolean;

  onLinkChanged?: (text: string) => void;
}

const lessonTypeTextMap: Record<Lesson['type'], string> = {
  lec: 'Лекція',
  lab: 'Лаба',
  prac: 'Практика',
};

export function ScheduleTile({
  lesson,
  className,
  isNow,
  isEditable,
  onLinkChanged,
  ...rest
}: ScheduleTileProps) {
  const canExpand = lesson.link !== undefined;
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={classNames(styles.root, className)} {...rest}>
      <div className={styles.header}>
        <Typography className={styles.type} data-type={lesson.type}>
          {lessonTypeTextMap[lesson.type]}
        </Typography>

        {isNow && (
          <Typography className={styles['now-indicator']}>Зараз</Typography>
        )}

        {canExpand && (
          <IconButton
            onClick={() => {
              setIsExpanded((state) => !state);
            }}
          >
            <UpDownIcon isUp={isExpanded} />
          </IconButton>
        )}

        {isEditable && !canExpand && (
          <IconButton
            onClick={() => {
              onLinkChanged?.('');
              setIsExpanded(true);
            }}
          >
            <LinkIcon />
          </IconButton>
        )}
      </div>

      <Typography className={styles.name}>{lesson.name}</Typography>
      <OptionalLink href={lesson.teacher.link} linkVariant="clean">
        {lesson.teacher.name}
      </OptionalLink>

      {lesson.place.length > 0 ? (
        <Typography hasIcon>
          <PlaceIcon />
          {lesson.place}
        </Typography>
      ) : null}

      <Typography hasIcon className={styles.time}>
        <TimeIcon />
        {lesson.time}
      </Typography>

      {isExpanded && lesson.link !== undefined && (
        <div className={styles['link']}>
          {isEditable ? (
            <input
              type="text"
              value={lesson.link}
              onInput={(event) => {
                const { value } = event.target as HTMLInputElement;

                onLinkChanged?.(value);
              }}
            />
          ) : (
            <Link href={lesson.link}>{lesson.link}</Link>
          )}
        </div>
      )}
    </div>
  );
}
