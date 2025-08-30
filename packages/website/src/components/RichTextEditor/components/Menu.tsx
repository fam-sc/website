import { classNames } from '@sc-fam/shared';
import { Editor } from '@tiptap/core';
import { useEditorState } from '@tiptap/react';

import { BlockQuoteIcon } from '@/icons/BlockQuoteIcon';
import { BoldIcon } from '@/icons/BoldIcon';
import { BulletListIcon } from '@/icons/BulletListIcon';
import { ItalicIcon } from '@/icons/ItalicIcon';
import { StrikeIcon } from '@/icons/StrikeIcon';
import { SubscriptIcon } from '@/icons/SubscriptIcon';
import { UnderlineIcon } from '@/icons/UnderlineIcon';
import { ObjectUrlManager } from '@/utils/objectUrlManager';

import { alignments, headerLevels } from '../types';
import { HeaderButton } from './HeaderButton';
import { InsertImageButton } from './InsertImageButton';
import { LinkButton } from './LinkButton';
import styles from './Menu.module.scss';
import { TextAlignButton } from './TextAlignButton';
import { ToggleButton } from './ToggleButton';

export type MenuOptions = ReturnType<typeof createMenuOptions>;

function createMenuOptions(isActive: Editor['isActive']) {
  return {
    bold: isActive('bold'),
    italic: isActive('italic'),
    underline: isActive('underline'),
    strike: isActive('strike'),
    subscript: isActive('subscript'),
    superscript: isActive('superscript'),
    blockquote: isActive('blockquote'),
    link: isActive('link'),
    bulletList: isActive('bulletList'),
    h1: isActive('heading', { level: 1 }),
    h2: isActive('heading', { level: 2 }),
    h3: isActive('heading', { level: 3 }),
    h4: isActive('heading', { level: 4 }),
    h5: isActive('heading', { level: 5 }),
    h6: isActive('heading', { level: 6 }),
    'align-left': isActive({ textAlign: 'left' }),
    'align-center': isActive({ textAlign: 'center' }),
    'align-right': isActive({ textAlign: 'rigth' }),
    'align-justify': isActive({ textAlign: 'justify' }),
  };
}

export function useMenuOptions(editor: Editor | null): MenuOptions {
  return (
    useEditorState({
      editor,
      selector: ({ editor }) => {
        return editor ? createMenuOptions(editor.isActive.bind(editor)) : null;
      },
    }) ?? createMenuOptions(() => false)
  );
}

export type MenuProps = {
  options: MenuOptions;
  urlManager: ObjectUrlManager;
  zeroScroll: boolean;
};

export function Menu({ options, urlManager, zeroScroll }: MenuProps) {
  return (
    <div
      className={classNames(
        styles.root,
        zeroScroll && styles['root-zero-scroll']
      )}
    >
      <ToggleButton
        isActive={options.bold}
        toggle="toggleBold"
        title="Жирний текст"
      >
        <BoldIcon />
      </ToggleButton>

      <ToggleButton
        isActive={options.italic}
        toggle="toggleItalic"
        title="Курсив"
      >
        <ItalicIcon />
      </ToggleButton>

      <ToggleButton
        isActive={options.underline}
        toggle="toggleUnderline"
        title="Нижнє підкреслення"
      >
        <UnderlineIcon />
      </ToggleButton>

      <ToggleButton
        isActive={options.strike}
        toggle="toggleStrike"
        title="Перекреслений текст"
      >
        <StrikeIcon />
      </ToggleButton>

      <ToggleButton
        isActive={options.subscript}
        toggle="toggleSubscript"
        title="Нижній індекс"
      >
        <SubscriptIcon />
      </ToggleButton>

      <ToggleButton
        isActive={options.superscript}
        toggle="toggleSuperscript"
        title="Верхній індекс"
      >
        <SubscriptIcon />
      </ToggleButton>

      {headerLevels.map((level) => (
        <HeaderButton
          key={`h${level}`}
          level={level}
          isActive={options[`h${level}`]}
        />
      ))}

      {alignments.map((alignment) => (
        <TextAlignButton
          key={`align-${alignment}`}
          alignment={alignment}
          isActive={options[`align-${alignment}`]}
        />
      ))}

      <ToggleButton
        isActive={options.bulletList}
        toggle="toggleBulletList"
        title="Список"
      >
        <BulletListIcon />
      </ToggleButton>

      <ToggleButton
        isActive={options.blockquote}
        toggle="toggleBlockquote"
        title="Цитата"
      >
        <BlockQuoteIcon />
      </ToggleButton>

      <LinkButton isActive={options.link} />

      <InsertImageButton urlManager={urlManager} />
    </div>
  );
}
