export type GalleryImageWithEvent = {
  id: number;
  date: string;
  event: {
    id: number;
    title: string;
  } | null;
};

export type GalleryImageWithSizes = {
  id: number;
  sizes: { width: number; height: number }[];
};
