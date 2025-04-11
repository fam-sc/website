type FileType = 'plain' | 'image';

type FileSectionMap = Record<string, FileType>;

const fileSectionMap = {
  'rich-text-image': 'image',
} satisfies FileSectionMap;

const fileTypes = Object.keys(fileSectionMap);

export type MediaFileSection = keyof typeof fileSectionMap;

export function isValidFileSection(value: unknown): value is MediaFileSection {
  return fileTypes.includes(value);
}

export function getFileType(section: MediaFileSection): FileType {
  return fileSectionMap[section];
}
