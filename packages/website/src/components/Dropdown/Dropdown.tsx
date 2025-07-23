import React, {
  CSSProperties,
  Key,
  MouseEvent,
  ReactElement,
  ReactNode,
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { addNativeEventListener } from '@/hooks/nativeEventListener';
import { classNames } from '@/utils/classNames';

import { List } from '../List';
import { Typography } from '../Typography';
import styles from './Dropdown.module.scss';

export type Position = 'top' | 'right' | 'bottom' | 'left';
export type Alignment = 'low' | 'high';

export type DropdownProps<T extends { id: Key }> = {
  style?: CSSProperties;
  className?: string;

  items: T[];
  renderItem: (value: T) => ReactNode;
  onAction?: (id: T['id']) => void;
  position?: Position;
  alignment?: Alignment;
  children: ReactElement<{
    onClick: () => void;
    'aria-haspopup'?: string;
    ref: RefObject<HTMLElement | null>;
  }>;
};

export function Dropdown<T extends { id: Key }>({
  items,
  position = 'bottom',
  alignment = 'low',
  className,
  style,
  renderItem,
  onAction,
  children,
}: DropdownProps<T>) {
  const triggerRef = useRef<HTMLElement>(null);

  const [isOpen, setOpen] = useState(false);

  const onTrigger = useCallback(() => {
    setOpen((state) => !state);
  }, []);

  const onItemAction = useCallback(
    (event: MouseEvent) => {
      const { target } = event;
      const { key } = (target as HTMLElement).dataset;

      if (key !== undefined) {
        onAction?.(key as T['id']);
      }
    },
    [onAction]
  );

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
        onClick: onTrigger,
      })}

      {isOpen && (
        <List
          role="menu"
          className={classNames(
            styles.menu,
            styles[`menu-position-${position}`],
            styles[`menu-align-${alignment}`]
          )}
        >
          {items.map((item) => (
            <Typography
              as="li"
              role="option"
              tabindex="0"
              key={item.id}
              data-key={item.id}
              onClick={onItemAction}
            >
              {renderItem(item)}
            </Typography>
          ))}
        </List>
      )}
    </div>
  );
}
