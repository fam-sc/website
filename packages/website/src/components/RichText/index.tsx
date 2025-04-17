import React, { Key, ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Typography } from '../Typography';

import styles from './index.module.scss';

import { getMediaFileUrl } from '@/api/media';
import {
  RichTextElementNode,
  RichTextNode,
  RichTextString,
} from '@/richText/types';

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

  if (typeof node === 'string') {
    return node;
  }

  if (node.name === '#image') {
    return (
      <Image
        src={getMediaFileUrl(node.filePath)}
        alt=""
        width={node.width}
        height={node.height}
      />
    );
  }

  return renderElementNode(node);
}

export function RichText(props: RichTextProps) {
  return (
    <Typography as="div" className={styles.root}>
      {renderNode(props.text)}
    </Typography>
  );
}
