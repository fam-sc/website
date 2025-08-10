import { VSCodeFile, VSCodeFileType } from '../types';

export type SimpleFileItem = {
  name: string;
  fullPath: string;
  type: VSCodeFileType;
};

export type FolderItem = {
  name: string;
  fullPath: string;
  type: 'folder';
  children: FileItem[];
};

export type FileItem = SimpleFileItem | FolderItem;

export function parseFileTree(files: VSCodeFile[]): FileItem[] {
  const folders: Record<string, VSCodeFile[]> = {};
  const simpleFiles: FileItem[] = [];

  for (const { path, ...restFile } of files) {
    const slashIndex = path.indexOf('/');

    if (slashIndex !== -1) {
      const folderName = path.slice(0, slashIndex);
      const rest = path.slice(slashIndex + 1);

      let folderContent = folders[folderName];

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (folderContent === undefined) {
        folderContent = [];
        folders[folderName] = folderContent;
      }

      folderContent.push({ path: rest, ...restFile });
    } else {
      simpleFiles.push({ name: path, fullPath: path, ...restFile });
    }
  }

  return [
    ...Object.entries(folders).map(
      ([name, children]): FolderItem => ({
        name,
        type: 'folder',
        fullPath: name,
        children: parseFileTree(children).map(
          ({ name: fileName, fullPath, ...rest }) => ({
            name: fileName,
            fullPath: `${name}/${fullPath}`,
            ...rest,
          })
        ),
      })
    ),
    ...simpleFiles,
  ];
}
