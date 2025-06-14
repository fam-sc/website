export type GalleryImageWithEvent = {
  id: string;
  date: string;
  event: {
    id: string;
    title: string;
  } | null;
};

export type GalleryImageWithSize = {
  id: string;
  width?: number;
  height?: number;
};
