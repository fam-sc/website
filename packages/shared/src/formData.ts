import { ZodMiniType } from 'zod/v4-mini';

type FormDataValue = string | number | Date | Blob;
type FormDataObject = Record<string, FormDataValue | undefined>;

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

function formDataValueToStringOrFile(value: FormDataValue): string | Blob {
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
      result.set(key, formDataValueToStringOrFile(property));
    }
  }

  return result;
}
