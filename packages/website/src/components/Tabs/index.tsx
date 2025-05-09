'use client';

import { ReactElement, ReactNode, useState } from "react";
import { List } from "../List";
import { SeePasswordIcon } from "@/icons/SeePasswordIcon";
import React from "react";

import styles from './index.module.scss';
import { classNames } from "@/utils/classNames";
import { Button } from "../Button";

type MaybeArray<T> = T | T[];

export type TabsProps<K extends string> = {
  className?: string;
  children: MaybeArray<ReactElement<{ tabId: K; isSelected?: boolean; title: string }>>;
};

export function Tabs<K extends string>({ className, children }: TabsProps<K>) {
  const childrenArray = Array.isArray(children) ? children : [children];

  const [selected, setSelected] = useState<K>(childrenArray[0].props.tabId);
  const selectedChild = childrenArray.find(({ props }) => props.tabId === selected);

  if (selectedChild === undefined) {
    throw new Error('Invalid state: selected child is undefined');
  }
  
  return (
    <div className={classNames(styles.root, className)} >
      <List className={styles.tablist} role="tablist">
        {childrenArray.map(({ props }) => (
          <Button 
            key={props.tabId} 
            role="tab" 
            aria-selected={props.tabId === selected}
            onClick={() => {
              setSelected(props.tabId);
            }}
          >
            {props.title}
          </Button>
        ))}
      </List>
      
      {React.cloneElement(selectedChild, { isSelected: true })}
    </div>
  )
}