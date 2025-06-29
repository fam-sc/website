import {
  RichTextElementNode,
  RichTextNode,
  RichTextString,
} from '@shared/richText/types';
import React, { Key, ReactNode } from 'react';
import { Link } from 'react-router';

import { getMediaFileUrl } from '@/api/media';
import { MediaFilePath } from '@/api/media';
import { classNames } from '@/utils/classNames';

import { Image } from '../Image';
import { Typography } from '../Typography';
import styles from './index.module.scss';

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
      return (
        <Image
          multiple={node.sizes.map(({ width, height }) => ({
            src: getMediaFileUrl(`${node.filePath}/${width}` as MediaFilePath),
            width,
            height,
          }))}
        />
      );
    }
    case '#placeholder-image':
    case '#unsized-image': {
      throw new Error('Unexpected node type');
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
