import { PropsMap } from '@/types/react';
import { classNames } from '@/utils/classNames';

export type ArticleProps = PropsMap['article'];

export function Article({ className, children, ...rest }: ArticleProps) {
  // Telegram IV requires this layout with <div class="article"> and <article class="article__content">
  return (
    <div className="article">
      <article className={classNames(className, 'article__content')} {...rest}>
        {children}
      </article>
    </div>
  );
}
