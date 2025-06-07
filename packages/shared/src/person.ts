export function formPersonName(
  firstName: string,
  lastName: string,
  parentName: string | null
): string {
  return parentName === null
    ? `${lastName} ${firstName}`
    : `${lastName} ${firstName} ${parentName}`;
}
