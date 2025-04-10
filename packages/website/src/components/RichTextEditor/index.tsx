import { FC, ReactNode } from 'react';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import {
  ChainedCommands,
  EditorContent,
  EditorContext,
  useCurrentEditor,
  useEditor,
} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import { IconButton } from '../IconButton';

import richTextStyles from '../RichText/index.module.scss';
import styles from './index.module.scss';

import { AlignCenterIcon } from '@/icons/AlignCenterIcon';
import { AlignJustifyIcon } from '@/icons/AlignJustifyIcon';
import { AlignLeftIcon } from '@/icons/AlignLeftIcon';
import { AlignRightIcon } from '@/icons/AlignRightIcon';
import { BlockQuoteIcon } from '@/icons/BlockQuoteIcon';
import { BoldIcon } from '@/icons/BoldIcon';
import { ItalicIcon } from '@/icons/ItalicIcon';
import { StrikeIcon } from '@/icons/StrikeIcon';
import { SubscriptIcon } from '@/icons/SubscriptIcon';
import { SvgProps } from '@/icons/types';
import { UnderlineIcon } from '@/icons/UnderlineIcon';
import { mapObjectToArray } from '@/utils/mapObject';

const headerLevels = [1, 2, 3, 4, 5, 6] as const;

type Alignment = 'left' | 'center' | 'right' | 'justify';

const alignmentIcons: Record<Alignment, FC<SvgProps>> = {
  left: AlignLeftIcon,
  center: AlignCenterIcon,
  right: AlignRightIcon,
  justify: AlignJustifyIcon,
};

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type Toggle = string | {};

type ToggleButtonProps = {
  toggle: Toggle;
  onToggle: (commands: ChainedCommands) => ChainedCommands;
  children: ReactNode;
};

function ToggleButton({ onToggle, toggle, children }: ToggleButtonProps) {
  const { editor } = useCurrentEditor();

  return (
    <IconButton
      className={styles['toggle-button']}
      onClick={() => {
        if (editor !== null) {
          onToggle(editor.chain().focus()).run();
        }
      }}
      data-active={editor?.isActive(toggle)}
    >
      {children}
    </IconButton>
  );
}

type AlignButtonProps = {
  children: ReactNode;
  type: Alignment;
};

function AlignButton({ type, children }: AlignButtonProps) {
  return (
    <ToggleButton
      toggle={{ textAlign: type }}
      onToggle={(c) => c.setTextAlign(type)}
    >
      {children}
    </ToggleButton>
  );
}

function Menu() {
  return (
    <div className={styles.menu}>
      <ToggleButton onToggle={(c) => c.toggleBold()} toggle="bold">
        <BoldIcon />
      </ToggleButton>

      <ToggleButton onToggle={(c) => c.toggleItalic()} toggle="italic">
        <ItalicIcon />
      </ToggleButton>

      <ToggleButton onToggle={(c) => c.toggleUnderline()} toggle="underline">
        <UnderlineIcon />
      </ToggleButton>

      <ToggleButton onToggle={(c) => c.toggleStrike()} toggle="strike">
        <StrikeIcon />
      </ToggleButton>

      <ToggleButton onToggle={(c) => c.toggleSubscript()} toggle="subscript">
        <SubscriptIcon />
      </ToggleButton>

      <ToggleButton
        onToggle={(c) => c.toggleSuperscript()}
        toggle="superscript"
      >
        <SubscriptIcon />
      </ToggleButton>

      {headerLevels.map((level) => (
        <ToggleButton
          key={`h${level}`}
          onToggle={(c) => c.toggleHeading({ level })}
          toggle={{ heading: { level } }}
        >
          H{level}
        </ToggleButton>
      ))}

      {mapObjectToArray(alignmentIcons, (alignment, Icon) => (
        <AlignButton type={alignment}>
          <Icon />
        </AlignButton>
      ))}

      <ToggleButton toggle="blockquote" onToggle={(c) => c.toggleBlockquote()}>
        <BlockQuoteIcon />
      </ToggleButton>
    </div>
  );
}

type RichTextEditorProps = {
  /**
   * Rich text in HTML.
   */
  text: string;

  onTextChanged: (text: string) => void;
};

export function RichTextEditor(props: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Subscript,
      Superscript,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: props.text,
  });

  return (
    <div className={styles.root}>
      <EditorContext.Provider value={{ editor }}>
        <Menu />
        <EditorContent className={richTextStyles.root} editor={editor} />
      </EditorContext.Provider>
    </div>
  );
}
