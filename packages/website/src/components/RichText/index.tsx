import React, { Key, ReactNode } from 'react';
import { Typography } from '../Typography';

import styles from './index.module.scss';

import { getMediaFileUrl } from '@/api/media';
import {
  RichTextElementNode,
  RichTextNode,
  RichTextString,
} from '@shared/richText/types';
import { classNames } from '@/utils/classNames';
import { Link } from 'react-router';
import { MediaPath } from '@/api/media';

export type RichTextProps = {
  className?: string;
  text: RichTextString;
};

function renderElementNode(node: RichTextElementNode, key?: Key): ReactNode {
  const { attrs } = node;

  const childrenTree =
    node.children?.map((element, index) => renderNode(element, index)) ?? [];

  if (node.name === 'a') {
    return (
      <Link {...attrs} to={attrs?.href ?? '/'} key={key}>
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
      <img
        src={getMediaFileUrl(node.filePath as MediaPath)}
        width={node.width}
        height={node.height}
      />
    );
  }

  return renderElementNode(node);
}

export function RichText({ className, text }: RichTextProps) {
  return (
    <Typography as="div" className={classNames(styles.root, className)}>
      {renderNode(text)}
    </Typography>
  );
}
