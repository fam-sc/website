export function searchParamsToObject(
  params: URLSearchParams
): Record<string, string | undefined> {
  const entries = params.entries();
  const result: Record<string, string | undefined> = {};

  for (const [key, value] of entries) {
    result[key] = value;
  }

  return result;
}

export function withSearchParams(
  url: string,
  values: Record<string, string | number | boolean | undefined>
) {
  const urlObject = new URL(url);

  for (const key in values) {
    const value = values[key];

    if (value !== undefined) {
      urlObject.searchParams.set(key, String(value));
    }
  }

  return urlObject;
}
