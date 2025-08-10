import { classNames } from '@/utils/classNames';
import {
  RawMarkdownNode,
  RawMarkdownNodeType,
  RawMarkdownString,
} from '@/utils/markdown/types';

import styles from './MarkdownContent.module.scss';

export interface MarkdownContentProps {
  className?: string;
  text: RawMarkdownString;
}

interface NodeProps {
  value: RawMarkdownNode;
}

function Node({ value }: NodeProps) {
  if (typeof value === 'string') {
    return value;
  } else if (Array.isArray(value)) {
    return <NodeFragment values={value} />;
  } else if (value.type === RawMarkdownNodeType.BREAK_LINE) {
    return <br />;
  }

  return (
    <span className={styles[`node-${value.type}`]}>
      <NodeFragment values={value.children} />
    </span>
  );
}

interface NodeFragmentProps {
  values: RawMarkdownNode[];
}

function NodeFragment({ values }: NodeFragmentProps) {
  return values.map((item, i) => <Node key={i} value={item} />);
}

export function MarkdownContent({ className, text }: MarkdownContentProps) {
  return (
    <div
      className={classNames(styles.root, className)}
      contentEditable
      onBeforeInput={(event) => {
        event.preventDefault();

        return false;
      }}
      onKeyDown={(event) => {
        event.preventDefault();

        return false;
      }}
    >
      <Node value={text} />
    </div>
  );
}
