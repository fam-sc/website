import { isValidImageUrlForBrowser } from '@shared/image/browserValidation';

export type FileGate = {
  acceptTypes: string;
  accept: (file: File) => Promise<boolean>;
};

export const imageFileGate: FileGate = {
  acceptTypes: '.png, .jpeg, .jpg, .webp',
  accept: async (file) => {
    const url = URL.createObjectURL(file);

    try {
      return await isValidImageUrlForBrowser(url);
    } finally {
      URL.revokeObjectURL(url);
    }
  },
};

export async function isAllFilesValid(
  gate: FileGate,
  files: FileList
): Promise<boolean> {
  const result = await Promise.all([...files].map((file) => gate.accept(file)));

  return !result.includes(false);
}
