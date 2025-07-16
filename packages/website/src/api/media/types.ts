type Concat<T extends string, U extends string> = T | `${T}${U}`;
type ImageWithSize = Concat<`${string}/${number}`, '.png'>;

type MediaPathMap = {
  events: ImageWithSize;
  gallery: ImageWithSize;
  'rich-text-image': ImageWithSize;
  user: string;
  'bot-flow': ['node-positions.json', { 'tg-sticker': string }];
};

export type MediaSubPathWithImageSize = {
  [K in keyof MediaPathMap]: MediaPathMap[K] extends ImageWithSize
    ? `${K}/${string}`
    : never;
}[keyof MediaPathMap];

type MediaFilePathBuilder<T> = T extends string
  ? T
  : T extends unknown[]
    ? { [K in keyof T]: MediaFilePathBuilder<T[K]> }[number]
    : T extends object
      ? {
          [K in keyof T & string]: `${K}/${MediaFilePathBuilder<T[K]>}`;
        }[keyof T & string]
      : never;

export type MediaFilePath = MediaFilePathBuilder<MediaPathMap>;
