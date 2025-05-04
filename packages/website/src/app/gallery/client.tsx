import styles from './page.module.scss';

export type ClientComponentProps = {
  page: number;
};

export function ClientComponent({ page }: ClientComponentProps) {
  return <div></div>;
}