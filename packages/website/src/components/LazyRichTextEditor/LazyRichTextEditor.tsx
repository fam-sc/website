import { useDataLoader } from '@/hooks/useDataLoader';

import { DataLoadingContainer } from '../DataLoadingContainer';
import type { RichTextEditorProps } from '../RichTextEditor';

export type LazyRichTextEditorProps = RichTextEditorProps;

export function LazyRichTextEditor(props: LazyRichTextEditorProps) {
  const [component, retry] = useDataLoader(async () => {
    const { RichTextEditor } = await import('../RichTextEditor');

    return RichTextEditor;
  });

  return (
    <DataLoadingContainer value={component} onRetry={retry}>
      {(Editor) => <Editor {...props} />}
    </DataLoadingContainer>
  );
}
