export class ObjectUrlManager {
  private map: Record<string, File> = {};

  register(file: File): string {
    const result = URL.createObjectURL(file);

    this.map[result] = file;

    return result;
  }

  get filesMap(): Readonly<Record<string, File>> {
    return this.map;
  }
}
