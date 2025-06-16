import { ZodMiniType } from 'zod/v4-mini';

type MaybeArray<T> = T | T[];
type FormDataAtom = string | number | Date | Blob;
export type FormDataObject = Record<
  string,
  MaybeArray<FormDataAtom> | undefined
>;

export function parseFormDataToRawObject(
  data: FormData
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const key of data.keys()) {
    result[key] = data.get(key);
  }

  return result;
}

export function parseFormDataToObject<T>(
  data: FormData,
  schema: ZodMiniType<T>
): T {
  return schema.parse(parseFormDataToRawObject(data));
}

function formDataValueToStringOrFile(value: FormDataAtom): string | Blob {
  if (typeof value === 'number') {
    return value.toString();
  } else if (value instanceof Date) {
    return value.toISOString();
  }

  return value;
}

export function objectToFormData(value: FormDataObject): FormData {
  const result = new FormData();

  for (const key in value) {
    const property = value[key];

    if (property !== undefined) {
      if (Array.isArray(property)) {
        for (const item of property) {
          result.append(key, formDataValueToStringOrFile(item));
        }
      } else {
        result.set(key, formDataValueToStringOrFile(property));
      }
    }
  }

  return result;
}

export function getAllFiles(formData: FormData, key: string): File[] {
  const result = formData.getAll(key);

  for (const file of result) {
    if (!(file instanceof File)) {
      throw new TypeError(`Value in ${key} is not file`);
    }
  }

  return result as File[];
}
