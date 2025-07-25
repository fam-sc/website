import { cloneElement, ReactElement, useEffect, useRef, useState } from 'react';

import { addNativeEventListener } from '@/hooks/nativeEventListener';
import { PropsMap } from '@/types/react';
import { classNames } from '@/utils/classNames';

import { Button } from '../Button';
import { Typography } from '../Typography';
import styles from './InlineQuestion.module.scss';

type DivProps = PropsMap['div'];

type Position = 'left' | 'right';

export interface InlineQuestionProps extends DivProps {
  questionText: string;
  position?: Position;
  onAction?: (type: 'yes' | 'no') => void;

  children: ReactElement<{
    'aria-haspopup'?: string;
    onClick: (event: MouseEvent) => void;
  }>;
}

export function InlineQuestion({
  className,
  position,
  onAction,
  questionText,
  children,
  ...rest
}: InlineQuestionProps) {
  const [isShown, setIsShown] = useState(false);

  const questionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return addNativeEventListener(document.body, 'click', () => {
      setIsShown(false);
    });
  });

  return (
    <div className={classNames(styles.root, className)} {...rest}>
      {cloneElement(children, {
        'aria-haspopup': 'dialog',
        onClick: (e) => {
          e.stopPropagation();

          setIsShown(true);
        },
      })}
      {isShown && (
        <div
          className={classNames(
            styles.question,
            styles[`question-${position}`]
          )}
          ref={questionRef}
          onClickCapture={(e) => {
            if ((e.target as HTMLElement).nodeName.toLowerCase() !== 'button') {
              e.stopPropagation();
            }
          }}
        >
          <Typography>{questionText}</Typography>

          <div className={styles.buttons} aria-label="Відповіді">
            <Button
              onClick={() => {
                onAction?.('no');
              }}
            >
              Ні
            </Button>
            <Button
              buttonVariant="solid"
              onClick={() => {
                onAction?.('yes');
              }}
            >
              Так
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
