import { describe, expect, test } from 'vitest';
import { getAllFiles } from './formData';

function createFile(content: string): File {
  return new File([content], 'some-file');
}

describe('getAllFiles', () => {
  test('ok', () => {
    const file1 = createFile('123');
    const file2 = createFile('321');

    const formData = new FormData();
    formData.append('files', file1);
    formData.append('files', file2);

    const actual = getAllFiles(formData, 'files');
    expect(actual).toEqual([file1, file2]);
  });

  test('not file', () => {
    const file = createFile('123');

    const formData = new FormData();
    formData.append('files', '123');
    formData.append('files', file);

    expect(() => getAllFiles(formData, 'files')).toThrowError();
  });
});
