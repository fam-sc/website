import {
  ChangeEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { classNames } from '@/utils/classNames';

import { SelectProps } from '../Select';
import { SelectBase } from '../SelectBase';
import { Typography } from '../Typography';
import styles from './SearchableSelect.module.scss';

export interface SearchableSelectProps<K extends string>
  extends SelectProps<K> {
  search: (item: { key: K; title: string }, query: string) => boolean;
}

export function SearchableSelect<K extends string>({
  items,
  selectedItem,
  placeholder,
  search,
  disabled,
  ...rest
}: SearchableSelectProps<K>) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');

  const filteredItems = useMemo(() => {
    return query.length === 0
      ? items
      : items.filter((item) => search(item, query));
  }, [items, query, search]);

  const title =
    items.find((item) => item.key === selectedItem)?.title ?? placeholder;

  const switchOpen = useCallback((event: MouseEvent) => {
    setIsOpen((state) => {
      if ((event.target as HTMLElement).tagName === 'INPUT' && state) {
        return state;
      }

      return !state;
    });
  }, []);

  const onQueryChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setIsOpen(true);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
    }
  }, [isOpen]);

  return (
    <SelectBase
      items={filteredItems}
      isOpen={isOpen}
      onOpenChanged={setIsOpen}
      switchOpen={switchOpen}
      headerClassName={classNames(
        styles.header,
        query.length > 0 && styles['header-active']
      )}
      disabled={disabled}
      {...rest}
    >
      <Typography
        as="input"
        type="search"
        value={query}
        onChange={onQueryChange}
        disabled={disabled}
      />

      <Typography>{title}</Typography>
    </SelectBase>
  );
}
