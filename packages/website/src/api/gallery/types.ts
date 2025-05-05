export type GalleryImageWithEvent = {
  id: string;
  date: string;
  event: {
    id: string;
    title: string;
  } | null;
};
