import { Thing, WithContext } from 'schema-dts';

export interface SchemaScriptProps<T extends Thing> {
  data: WithContext<T>;
}

export function SchemaScript<T extends Thing>({ data }: SchemaScriptProps<T>) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
