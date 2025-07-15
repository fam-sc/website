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
