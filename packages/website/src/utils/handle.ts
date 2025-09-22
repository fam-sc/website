import { Thing, WithContext } from 'schema-dts';

export type PageHandle<T extends Thing = Thing> = {
  schema?: WithContext<T>;
};
