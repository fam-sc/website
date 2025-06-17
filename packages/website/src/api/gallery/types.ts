export type GalleryImageWithEvent = {
  id: string;
  date: string;
  event: {
    id: string;
    title: string;
  } | null;
};

export type GalleryImageWithSizes = {
  id: string;
  sizes: { width: number; height: number }[];
};
