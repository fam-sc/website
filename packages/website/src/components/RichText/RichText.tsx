import {
  RichTextElementNode,
  RichTextNode,
  RichTextString,
} from '@sc-fam/shared/richText';
import React, { Key, ReactNode } from 'react';
import { Link } from 'react-router';

import { classNames } from '@/utils/classNames';
import { sizesToImages } from '@/utils/image/transform';

import { Image } from '../Image';
import { Typography } from '../Typography';
import styles from './RichText.module.scss';

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

  switch (node.name) {
    case '#image': {
      return <Image multiple={sizesToImages(node.filePath, node.sizes)} />;
    }
    case '#placeholder-image':
    case '#unsized-image': {
      return null;
    }
    default: {
      return renderElementNode(node);
    }
  }
}

export function RichText({ className, text }: RichTextProps) {
  return (
    <Typography as="div" className={classNames(styles.root, className)}>
      {renderNode(text)}
    </Typography>
  );
}
