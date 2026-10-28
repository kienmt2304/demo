export type Image = {
  albumId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
};

export type FetchImage = {
  images: Image[];
  next: number | null;
};
