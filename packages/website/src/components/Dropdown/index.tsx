import React, {
  CSSProperties,
  Key,
  ReactElement,
  ReactNode,
  RefObject,
  useEffect,
  useRef,
  useState,
} from 'react';

import { Typography } from '../Typography';

import styles from './index.module.scss';

import { addNativeEventListener } from '@/hooks/nativeEventListener';
import { classNames } from '@/utils/classNames';

type Position = 'top' | 'right' | 'bottom' | 'left';

export type DropdownProps<T extends { id: Key }> = {
  style?: CSSProperties;
  className?: string;

  items: T[];
  renderItem: (value: T) => ReactNode;
  onAction?: (id: T['id']) => void;
  position?: Position;
  children: ReactElement<{
    onClick: () => void;
    'aria-haspopup'?: string;
    ref: RefObject<HTMLElement | null>;
  }>;
};

export function Dropdown<T extends { id: Key }>({
  items,
  position = 'bottom',
  className,
  style,
  renderItem,
  onAction,
  children,
}: DropdownProps<T>) {
  const triggerRef = useRef<HTMLElement>(null);
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      return addNativeEventListener(document.body, 'click', (event) => {
        // Hide menu on a click anywhere on the body unless the click is on trigger component.
        // This is to prevent the situation when the menu is imediately hidden
        // when it's shown, because this listener intecepts a click event on the trigger.
        if (event.target !== triggerRef.current) {
          setOpen(false);
        }
      });
    }
  }, [isOpen]);

  return (
    <div className={classNames(styles.root, className)} style={style}>
      {React.cloneElement(children, {
        ref: triggerRef,
        'aria-haspopup': 'menu',
        onClick: () => {
          setOpen((state) => !state);
        },
      })}

      {isOpen && (
        <ul
          role="menu"
          className={classNames(
            styles.menu,
            styles[`menu-position-${position}`]
          )}
        >
          {items.map((item) => (
            <Typography
              as="li"
              role="option"
              tabindex="0"
              key={item.id}
              onClick={() => {
                onAction?.(item.id);
              }}
            >
              {renderItem(item)}
            </Typography>
          ))}
        </ul>
      )}
    </div>
  );
}
