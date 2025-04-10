import React, { Key, ReactNode } from 'react';
import Link from 'next/link';

import styles from './index.module.scss';

import {
  RichTextElementNode,
  RichTextNode,
  RichTextString,
} from '@/data/types/richText';

export type RichTextProps = {
  text: RichTextString;
};

function renderElementNode(node: RichTextElementNode, key?: Key): ReactNode {
  const { attrs } = node;

  const childrenTree =
    node.children?.map((element, index) => renderNode(element, index)) ?? [];

  if (node.name === 'a') {
    return (
      <Link {...attrs} href={attrs?.href ?? '/'} key={key}>
        {childrenTree}
      </Link>
    );
  }

  return React.createElement(node.name, { ...attrs, key }, ...childrenTree);
}

function renderNode(node: RichTextNode, key?: Key): ReactNode {
  if (Array.isArray(node)) {
    const children = node.map((element, index) => renderNode(element, index));

    return key === undefined ? children : <div key={key}>{children}</div>;
  }

  return typeof node === 'string' ? node : renderElementNode(node);
}

export function RichText(props: RichTextProps) {
  return <div className={styles['root']}>{renderNode(props.text)}</div>;
}
