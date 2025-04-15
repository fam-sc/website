// Reads local file to converts it to base64 format.
// This needs to be able to run in the browser.
export async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.addEventListener('load', () => {
      const { result } = reader;

      if (typeof result === 'string') {
        resolve(result);
      } else {
        reject(new Error('Expected result to be string'));
      }
    });
    reader.addEventListener('error', reject);
  });
}
