export function measureTextWidth(text: string, font: string) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (context === null) {
    return 0;
  }

  context.font = font;

  const { width } = context.measureText(text);

  return width;
}
