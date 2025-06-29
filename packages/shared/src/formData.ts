export function getAllFiles(formData: FormData, key: string): File[] {
  const result = formData.getAll(key);

  for (const file of result) {
    if (!(file instanceof File)) {
      throw new TypeError(`Value in ${key} is not file`);
    }
  }

  return result as File[];
}
