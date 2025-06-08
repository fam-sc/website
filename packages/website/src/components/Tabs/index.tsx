

import { ReactElement, useId, useState } from 'react';
import { List } from '../List';
import React from 'react';

import styles from './index.module.scss';
import { classNames } from '@/utils/classNames';
import { Button } from '../Button';

type MaybeArray<T> = T | T[];

export type TabsProps<K extends string> = {
  className?: string;
  children: MaybeArray<
    ReactElement<{
      id?: string;
      tabId: K;
      isSelected?: boolean;
      title: string;
      labelledBy?: string;
    }>
  >;
};

export function Tabs<K extends string>({ className, children }: TabsProps<K>) {
  const globalId = useId();
  const childrenArray = Array.isArray(children) ? children : [children];

  const [selected, setSelected] = useState<K>(childrenArray[0].props.tabId);
  const selectedChild = childrenArray.find(
    ({ props }) => props.tabId === selected
  );

  if (selectedChild === undefined) {
    throw new Error('Invalid state: selected child is undefined');
  }

  return (
    <div className={classNames(styles.root, className)}>
      <List className={styles.tablist} role="tablist">
        {childrenArray.map(({ props }) => (
          <Button
            id={`${globalId}-tab-${props.tabId}`}
            key={props.tabId}
            role="tab"
            aria-selected={props.tabId === selected}
            aria-controls={`${globalId}-panel-${props.tabId}`}
            onClick={() => {
              setSelected(props.tabId);
            }}
          >
            {props.title}
          </Button>
        ))}
      </List>

      {React.cloneElement(selectedChild, {
        isSelected: true,
        id: `${globalId}-panel-${selectedChild.props.tabId}`,
        labelledBy: `${globalId}-tab-${selectedChild.props.tabId}`,
      })}
    </div>
  );
}
