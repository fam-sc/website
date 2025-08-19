export function getFileName(path: string): string {
  const slashIndex = path.lastIndexOf('/');

  if (slashIndex === -1) {
    return path;
  }

  return path.slice(slashIndex + 1);
}
