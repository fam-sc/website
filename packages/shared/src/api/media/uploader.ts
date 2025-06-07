// File uploader API for client-side

import { MediaFileSection } from './fileTypes';

export type MediaFileUploaderOptions = {
  file: File;
  section: MediaFileSection;
  onProgress?: (value: number) => void;
};

// Returns a promise that resolves if the file is successfully uploaded, rejects if not.
// The progress can be tracked via 'onProgress' callback.
export function mediaFileUploader({
  file,
  section,
  onProgress,
}: MediaFileUploaderOptions): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.addEventListener('progress', (event) => {
      const progress = event.loaded / file.size;

      onProgress?.(progress);
    });

    xhr.addEventListener('load', () => {
      onProgress?.(1);
      resolve();
    });

    xhr.addEventListener('error', () => {
      reject(new Error(xhr.statusText));
    });

    xhr.addEventListener('timeout', () => {
      reject(new Error('Timeout'));
    });

    xhr.open('POST', `/api/uploadFile?section=${section}`, true);
    xhr.send(file);

    onProgress?.(0);
  });
}
