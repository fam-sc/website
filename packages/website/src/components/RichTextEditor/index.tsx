import { FC, ReactNode, useState } from 'react';
import Blockquote from '@tiptap/extension-blockquote';
import Bold from '@tiptap/extension-bold';
import Document from '@tiptap/extension-document';
import Heading from '@tiptap/extension-heading';
import Italic from '@tiptap/extension-italic';
import Link from '@tiptap/extension-link';
import Paragraph from '@tiptap/extension-paragraph';
import Strike from '@tiptap/extension-strike';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import Text from '@tiptap/extension-text';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import {
  ChainedCommands,
  Editor,
  EditorContent,
  EditorContext,
  Extensions,
  useCurrentEditor,
  useEditor,
} from '@tiptap/react';

import { IconButton } from '../IconButton';
import { SelectLinkDialog } from '../SelectLinkDialog';

import richTextStyles from '../RichText/index.module.scss';
import styles from './index.module.scss';

import { AlignCenterIcon } from '@/icons/AlignCenterIcon';
import { AlignJustifyIcon } from '@/icons/AlignJustifyIcon';
import { AlignLeftIcon } from '@/icons/AlignLeftIcon';
import { AlignRightIcon } from '@/icons/AlignRightIcon';
import { BlockQuoteIcon } from '@/icons/BlockQuoteIcon';
import { BoldIcon } from '@/icons/BoldIcon';
import { ItalicIcon } from '@/icons/ItalicIcon';
import { LinkIcon } from '@/icons/LinkIcon';
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

const extensions: Extensions = [
  Document,
  Text,
  Paragraph,
  Bold,
  Italic,
  Strike,
  Blockquote,
  Heading,
  Underline,
  Subscript,
  Superscript,
  TextAlign.configure({
    types: ['heading', 'paragraph'],
  }),
  Link,
];

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type Toggle = string | {};

type ToggleButtonProps = {
  toggle: Toggle;
  children: ReactNode;
} & (
  | {
      onToggle: (commands: ChainedCommands) => ChainedCommands;
    }
  | { onClick: (editor: Editor) => void }
);

function ToggleButton({ toggle, children, ...rest }: ToggleButtonProps) {
  const { editor } = useCurrentEditor();

  return (
    <IconButton
      className={styles['toggle-button']}
      onClick={() => {
        if (editor !== null) {
          if ('onToggle' in rest) {
            rest.onToggle(editor.chain().focus()).run();
          } else {
            rest.onClick(editor);
          }
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

function LinkButton() {
  const { editor } = useCurrentEditor();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <ToggleButton
        toggle="link"
        onClick={(editor) => {
          const isActive = editor.isActive('link');

          if (isActive) {
            editor.chain().focus().unsetLink().run();
          } else {
            setIsOpen(true);
          }
        }}
      >
        <LinkIcon />
      </ToggleButton>

      {isOpen && (
        <SelectLinkDialog
          onClose={() => {
            setIsOpen(false);
          }}
          onConfirmed={({ link }) => {
            setIsOpen(false);

            editor?.chain().focus().setLink({ href: link }).run();
          }}
        />
      )}
    </>
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
        <AlignButton key={`align-${alignment}`} type={alignment}>
          <Icon />
        </AlignButton>
      ))}

      <ToggleButton toggle="blockquote" onToggle={(c) => c.toggleBlockquote()}>
        <BlockQuoteIcon />
      </ToggleButton>

      <LinkButton />
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
    extensions,
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
