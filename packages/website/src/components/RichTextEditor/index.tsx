'use client';

import { FC, ReactNode, useCallback, useEffect, useState } from 'react';
import Blockquote from '@tiptap/extension-blockquote';
import Bold from '@tiptap/extension-bold';
import Document from '@tiptap/extension-document';
import Heading from '@tiptap/extension-heading';
import ImageExtension from '@tiptap/extension-image';
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

import { FileUploadDialog } from '../FileUploadDialog';
import { IconButton } from '../IconButton';
import { SelectLinkDialog } from '../SelectLinkDialog';

import richTextStyles from '../RichText/index.module.scss';
import typographyStyles from '../Typography/index.module.scss';
import styles from './index.module.scss';

import { AlignCenterIcon } from '@/icons/AlignCenterIcon';
import { AlignJustifyIcon } from '@/icons/AlignJustifyIcon';
import { AlignLeftIcon } from '@/icons/AlignLeftIcon';
import { AlignRightIcon } from '@/icons/AlignRightIcon';
import { BlockQuoteIcon } from '@/icons/BlockQuoteIcon';
import { BoldIcon } from '@/icons/BoldIcon';
import { CheckIcon } from '@/icons/CheckIcon';
import { ImageIcon } from '@/icons/ImageIcon';
import { ItalicIcon } from '@/icons/ItalicIcon';
import { LinkIcon } from '@/icons/LinkIcon';
import { StrikeIcon } from '@/icons/StrikeIcon';
import { SubscriptIcon } from '@/icons/SubscriptIcon';
import { SvgProps } from '@/icons/types';
import { UnderlineIcon } from '@/icons/UnderlineIcon';
import { classNames } from '@/utils/classNames';
import { fileToDataUrl } from '@/utils/fileTransformations';
import { mapObjectToArray } from '@/utils/mapObject';
import { useNotification } from '../Notification';

const headerLevels = [1, 2, 3, 4, 5, 6] as const;

type Alignment = 'left' | 'center' | 'right' | 'justify';

const alignmentInfo: Record<Alignment, { icon: FC<SvgProps>; title: string }> =
  {
    left: { icon: AlignLeftIcon, title: 'Вирівнювання по лівому краю' },
    center: { icon: AlignCenterIcon, title: 'Вирівнювання по центру' },
    right: { icon: AlignRightIcon, title: 'Вирівнювання по правому краю' },
    justify: { icon: AlignJustifyIcon, title: 'Вирівнювання по ширині' },
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
  ImageExtension.configure({
    allowBase64: true,
  }),
];

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type Toggle = string | {};

type ToggleButtonProps = {
  toggle: Toggle;
  title: string;
  children: ReactNode;
} & (
  | {
      onToggle: (commands: ChainedCommands) => ChainedCommands;
    }
  | { onClick: (editor: Editor) => void }
);

function ToggleButton({ toggle, children, title, ...rest }: ToggleButtonProps) {
  const { editor } = useCurrentEditor();
  const isActive = editor?.isActive(toggle);

  return (
    <IconButton
      role="checkbox"
      aria-checked={isActive}
      className={styles['toggle-button']}
      title={title}
      onClick={() => {
        if (editor !== null) {
          if ('onToggle' in rest) {
            rest.onToggle(editor.chain().focus()).run();
          } else {
            rest.onClick(editor);
          }
        }
      }}
      data-active={isActive}
    >
      {children}
    </IconButton>
  );
}

type AlignButtonProps = {
  children: ReactNode;
  title: string;
  type: Alignment;
};

function AlignButton({ type, title, children }: AlignButtonProps) {
  return (
    <ToggleButton
      toggle={{ textAlign: type }}
      title={title}
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
        title="Додати посилання"
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

function InsertImageButton() {
  const notification = useNotification();
  const { editor } = useCurrentEditor();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <IconButton
        className={styles['toggle-button']}
        title="Додати зображення"
        onClick={() => {
          setIsOpen(true);
        }}
      >
        <ImageIcon />
      </IconButton>

      {isOpen && (
        <FileUploadDialog
          accept=".png, .jpeg, .jpg, .webp"
          onClose={() => {
            setIsOpen(false);
          }}
          onSubmit={(file) => {
            setIsOpen(false);

            fileToDataUrl(file)
              .then((src) => {
                editor?.chain().focus().setImage({ src }).run();
              })
              .catch((error: unknown) => {
                console.error(error);

                notification.show('Сталася помилка', 'error');
              });
          }}
        />
      )}
    </>
  );
}

type MenuProps = {
  isChanged: boolean;

  onSave: () => void;
};

function Menu({ isChanged, onSave }: MenuProps) {
  return (
    <div className={styles.menu}>
      <ToggleButton
        onToggle={(c) => c.toggleBold()}
        toggle="bold"
        title="Жирний текст"
      >
        <BoldIcon />
      </ToggleButton>

      <ToggleButton
        onToggle={(c) => c.toggleItalic()}
        toggle="italic"
        title="Курсив"
      >
        <ItalicIcon />
      </ToggleButton>

      <ToggleButton
        onToggle={(c) => c.toggleUnderline()}
        toggle="underline"
        title="Нижнє підкреслення"
      >
        <UnderlineIcon />
      </ToggleButton>

      <ToggleButton
        onToggle={(c) => c.toggleStrike()}
        toggle="strike"
        title="Перекреслений текст"
      >
        <StrikeIcon />
      </ToggleButton>

      <ToggleButton
        onToggle={(c) => c.toggleSubscript()}
        toggle="subscript"
        title="Нижній індекс"
      >
        <SubscriptIcon />
      </ToggleButton>

      <ToggleButton
        onToggle={(c) => c.toggleSuperscript()}
        toggle="superscript"
        title="Верхній індекс"
      >
        <SubscriptIcon />
      </ToggleButton>

      {headerLevels.map((level) => (
        <ToggleButton
          key={`h${level}`}
          title={`Заголовок рівня ${level}`}
          onToggle={(c) => c.toggleHeading({ level })}
          toggle={{ heading: { level } }}
        >
          {`H${level}`}
        </ToggleButton>
      ))}

      {mapObjectToArray(alignmentInfo, (alignment, { icon: Icon, title }) => (
        <AlignButton key={`align-${alignment}`} type={alignment} title={title}>
          <Icon />
        </AlignButton>
      ))}

      <ToggleButton
        toggle="blockquote"
        onToggle={(c) => c.toggleBlockquote()}
        title="Цитата"
      >
        <BlockQuoteIcon />
      </ToggleButton>

      <LinkButton />

      <InsertImageButton />

      <IconButton
        className={styles['save-button']}
        data-active={isChanged}
        disabled={!isChanged}
        title="Зберегти текст"
        onClick={() => {
          onSave();
        }}
      >
        <CheckIcon />
      </IconButton>
    </div>
  );
}

type RichTextEditorProps = {
  /**
   * Rich text in HTML.
   */
  text: string;

  className?: string;
  disabled?: boolean;

  onIsSavedChanged: (value: boolean) => void;

  onSaveText?: (text: string) => Promise<string>;
};

export function RichTextEditor({
  className,
  text,
  disabled: propsDisabled,
  onIsSavedChanged,
  onSaveText,
}: RichTextEditorProps) {
  const [isChanged, setIsChanged] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const editor = useEditor({
    extensions,
    content: text,
    immediatelyRender: false,
    onUpdate: () => {
      setIsChanged(true);
      onIsSavedChanged(true);
    },
  });

  const onSave = useCallback(() => {
    if (editor !== null) {
      setIsChanged(false);
      onIsSavedChanged(false);

      // Disallow changing the text if we're updating it -
      // the update might return a different text (if we have an image in it).
      setDisabled(true);

      onSaveText?.(editor.getHTML())
        .then((newText) => {
          editor.commands.setContent(newText, false);

          setDisabled(propsDisabled ?? false);
        })
        .catch((error: unknown) => {
          console.error(error);

          setDisabled(propsDisabled ?? false);
        });
    }
  }, [editor, onIsSavedChanged, onSaveText, propsDisabled]);

  useEffect(() => {
    editor?.setEditable(!disabled, false);
  }, [editor, disabled]);

  useEffect(() => {
    setDisabled(propsDisabled ?? false);
  }, [propsDisabled]);

  return (
    <div
      className={classNames(styles.root, className)}
      aria-disabled={disabled}
    >
      <EditorContext.Provider value={{ editor }}>
        <Menu isChanged={isChanged} onSave={onSave} />
        <EditorContent
          data-variant="body"
          className={classNames(typographyStyles.root, richTextStyles.root)}
          editor={editor}
        />
      </EditorContext.Provider>
    </div>
  );
}
