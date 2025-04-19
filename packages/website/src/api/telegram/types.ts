// https://core.telegram.org/bots/api

export type File = {
  file_id: string;
  file_unique_id: string;
  file_size: number;
  file_path?: string;
};

export type ChatFullInfo = {
  id: number;
  title: string;
  photo: ChatPhoto;
};

export type ChatPhoto = {
  big_file_id: string;
};

export type Sticker = {
  file_id: string;
  file_unique_id: string;
  type: 'regular' | 'mask' | 'custom_emoji';
  width: number;
  height: number;
  is_animated: boolean;
  is_video: boolean;
  thumbnail: File;
  custom_emoji_id?: string;
};
