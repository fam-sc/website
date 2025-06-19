export function isValidImageUrlForBrowser(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = document.createElement('img');
    img.src = url;

    img.addEventListener('load', () => {
      resolve(true);
    });

    img.addEventListener('error', () => {
      resolve(false);
    });
  });
}
