import { BlockQuoteIcon } from '@/icons/BlockQuoteIcon';
import { BoldIcon } from '@/icons/BoldIcon';
import { ItalicIcon } from '@/icons/ItalicIcon';
import { StrikeIcon } from '@/icons/StrikeIcon';
import { SubscriptIcon } from '@/icons/SubscriptIcon';
import { UnderlineIcon } from '@/icons/UnderlineIcon';
import { mapObjectToArray } from '@shared/collections/mapObject';
import { FC } from 'react';
import { AlignCenterIcon } from '@/icons/AlignCenterIcon';
import { AlignJustifyIcon } from '@/icons/AlignJustifyIcon';
import { AlignLeftIcon } from '@/icons/AlignLeftIcon';
import { AlignRightIcon } from '@/icons/AlignRightIcon';
import { SvgProps } from '@/icons/types';
import styles from './Menu.module.scss';
import { ToggleButton } from './ToggleButton';
import { InsertImageButton } from './InsertImageButton';
import { LinkButton } from './LinkButton';
import { Editor } from '@tiptap/core';
import { useEditorState } from '@tiptap/react';
import { ObjectUrlManager } from '@/utils/objectUrlManager';

type Alignment = 'left' | 'center' | 'right' | 'justify';

const headerLevels = [1, 2, 3, 4, 5, 6] as const;
type HeaderLevel = (typeof headerLevels)[number];

const alignmentInfo: Record<Alignment, { icon: FC<SvgProps>; title: string }> =
  {
    left: { icon: AlignLeftIcon, title: 'Вирівнювання по лівому краю' },
    center: { icon: AlignCenterIcon, title: 'Вирівнювання по центру' },
    right: { icon: AlignRightIcon, title: 'Вирівнювання по правому краю' },
    justify: { icon: AlignJustifyIcon, title: 'Вирівнювання по ширині' },
  };

type MenuOptionsKey =
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strike'
  | 'subscript'
  | 'superscript'
  | 'blockquote'
  | 'link'
  | `h${HeaderLevel}`
  | `align-${Alignment}`;

export type MenuOptions = Record<MenuOptionsKey, boolean>;

const defaultMenuOptions: MenuOptions = {
  bold: false,
  italic: false,
  underline: false,
  strike: false,
  subscript: false,
  superscript: false,
  blockquote: false,
  h1: false,
  h2: false,
  h3: false,
  h4: false,
  h5: false,
  h6: false,
  'align-left': false,
  'align-center': false,
  'align-right': false,
  'align-justify': false,
  link: false,
};

function createMenuOptions(editor: Editor): MenuOptions {
  return {
    bold: editor.isActive('bold'),
    italic: editor.isActive('italic'),
    underline: editor.isActive('underline'),
    strike: editor.isActive('strike'),
    subscript: editor.isActive('subscript'),
    superscript: editor.isActive('superscript'),
    blockquote: editor.isActive('blockquote'),
    link: editor.isActive('link'),
    h1: editor.isActive('heading', { level: 1 }),
    h2: editor.isActive('heading', { level: 2 }),
    h3: editor.isActive('heading', { level: 3 }),
    h4: editor.isActive('heading', { level: 4 }),
    h5: editor.isActive('heading', { level: 5 }),
    h6: editor.isActive('heading', { level: 6 }),
    'align-left': editor.isActive({ textAlign: 'left' }),
    'align-center': editor.isActive({ textAlign: 'center' }),
    'align-right': editor.isActive({ textAlign: 'rigth' }),
    'align-justify': editor.isActive({ textAlign: 'justify' }),
  };
}

export function useMenuOptions(editor: Editor | null): MenuOptions {
  return (
    useEditorState({
      editor,
      selector: ({ editor }) =>
        editor !== null ? createMenuOptions(editor) : null,
    }) ?? defaultMenuOptions
  );
}

export type MenuProps = {
  options: MenuOptions;
  urlManager: ObjectUrlManager;
};

export function Menu({ options, urlManager }: MenuProps) {
  return (
    <div className={styles.root}>
      <ToggleButton
        isActive={options.bold}
        onToggle={(c) => c.toggleBold()}
        title="Жирний текст"
      >
        <BoldIcon />
      </ToggleButton>

      <ToggleButton
        isActive={options.italic}
        onToggle={(c) => c.toggleItalic()}
        title="Курсив"
      >
        <ItalicIcon />
      </ToggleButton>

      <ToggleButton
        isActive={options.underline}
        onToggle={(c) => c.toggleUnderline()}
        title="Нижнє підкреслення"
      >
        <UnderlineIcon />
      </ToggleButton>

      <ToggleButton
        isActive={options.strike}
        onToggle={(c) => c.toggleStrike()}
        title="Перекреслений текст"
      >
        <StrikeIcon />
      </ToggleButton>

      <ToggleButton
        isActive={options.subscript}
        onToggle={(c) => c.toggleSubscript()}
        title="Нижній індекс"
      >
        <SubscriptIcon />
      </ToggleButton>

      <ToggleButton
        isActive={options.superscript}
        onToggle={(c) => c.toggleSuperscript()}
        title="Верхній індекс"
      >
        <SubscriptIcon />
      </ToggleButton>

      {headerLevels.map((level) => (
        <ToggleButton
          key={`h${level}`}
          isActive={options[`h${level}`]}
          title={`Заголовок рівня ${level}`}
          onToggle={(c) => c.toggleHeading({ level })}
        >
          {`H${level}`}
        </ToggleButton>
      ))}

      {mapObjectToArray(alignmentInfo, (alignment, { icon: Icon, title }) => (
        <ToggleButton
          key={`align-${alignment}`}
          isActive={options[`align-${alignment}`]}
          title={title}
          onToggle={(c) => c.setTextAlign(alignment)}
        >
          <Icon />
        </ToggleButton>
      ))}

      <ToggleButton
        isActive={options.blockquote}
        onToggle={(c) => c.toggleBlockquote()}
        title="Цитата"
      >
        <BlockQuoteIcon />
      </ToggleButton>

      <LinkButton isActive={options.link} />

      <InsertImageButton urlManager={urlManager} />
    </div>
  );
}
