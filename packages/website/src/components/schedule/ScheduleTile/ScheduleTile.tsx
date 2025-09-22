import { classNames } from '@sc-fam/shared';
import { IconButton } from '@sc-fam/shared-ui';
import { ComponentProps, useState } from 'react';

import { Lesson, LessonType } from '@/api/schedule/types';
import { LinkIcon } from '@/icons/LinkIcon';
import { PlaceIcon } from '@/icons/PlaceIcon';
import { TimeIcon } from '@/icons/TimeIcon';
import { UpDownIcon } from '@/icons/UpDownIcon';

import { Link } from '../../Link';
import { OptionalLink } from '../../OptionalLink';
import { Typography } from '../../Typography';
import styles from './ScheduleTile.module.scss';

export interface ScheduleTileProps extends ComponentProps<'div'> {
  lesson: Lesson;
  isEditable?: boolean;
  isNow?: boolean;

  onLinkChanged?: (text: string) => void;
}

const lessonTypeTextMap: Record<LessonType, string> = {
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
    <div
      className={classNames(
        styles.root,
        isNow && styles['root-now'],
        className
      )}
      {...rest}
    >
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

      <OptionalLink className={styles.name} to={lesson.disciplineLink}>
        {lesson.name}
      </OptionalLink>

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
