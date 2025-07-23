import { useState } from 'react';

import { Lesson } from '@/api/schedule/types';
import { LinkIcon } from '@/icons/LinkIcon';
import { PlaceIcon } from '@/icons/PlaceIcon';
import { TimeIcon } from '@/icons/TimeIcon';
import { UpDownIcon } from '@/icons/UpDownIcon';
import { PropsMap } from '@/types/react';
import { classNames } from '@/utils/classNames';

import { IconButton } from '../IconButton';
import { Link } from '../Link';
import { OptionalLink } from '../OptionalLink';
import { Typography } from '../Typography';
import styles from './ScheduleTile.module.scss';

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
        <Typography
          className={classNames(styles.type, styles[`type-${lesson.type}`])}
        >
          {lessonTypeTextMap[lesson.type]}
        </Typography>

        {isNow && (
          <Typography className={styles['now-indicator']}>Зараз</Typography>
        )}

        {canExpand && (
          <IconButton
            title={isExpanded ? 'Показати менше' : 'Показати більше'}
            onClick={() => {
              setIsExpanded((state) => !state);
            }}
          >
            <UpDownIcon isUp={isExpanded} />
          </IconButton>
        )}

        {isEditable && !canExpand && (
          <IconButton
            title="Додати посилання"
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

      <OptionalLink to={lesson.teacher.link} linkVariant="clean">
        {lesson.teacher.name}
      </OptionalLink>

      {lesson.place.length > 0 ? (
        <Typography hasIcon>
          <PlaceIcon aria-hidden />
          {lesson.place}
        </Typography>
      ) : null}

      <Typography hasIcon className={styles.time}>
        <TimeIcon aria-hidden />
        {lesson.time}
      </Typography>

      {isExpanded && lesson.link !== undefined && (
        <div className={styles['link']}>
          {isEditable ? (
            <input
              type="text"
              value={lesson.link}
              placeholder="Посилання на пару"
              onInput={(event) => {
                const { value } = event.target as HTMLInputElement;

                onLinkChanged?.(value);
              }}
            />
          ) : (
            <Link to={lesson.link} aria-label="Посилання на пару">
              {lesson.link}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
