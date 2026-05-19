export interface Photograph {
  alt: string;
  description: string;
  id_image: number;
  image_url: string;
  title: string;
  date_insert: string;
}

export interface IRelatedWorkData {
  id: number;
  slug: string;
  title: string;
  description: string;
  author: string;
  date: string;
  image: IRelatedImageData | string;
}

export interface IRelatedImageData {
  id: number;
  url: string;
  id_work: number;
  big_image_for_slider: number;
  extra_folder: string;
  filename: string;
  big_width_px: number | null;
  big_height_px: number | null;
  width_big: number;
  width_box: number;
  width_list: number;
  width_thumb: number;
  height_big: number;
  height_box: number;
  height_list: number;
  height_thumb: number;
}


export interface IRelatedWorkDetails {
  id: number;
  slug: string;
  name: string;
  date: string;
  date_copy: string;
  author: Author;
  institution: Institution;
  works_images: IImageData[];
}

export interface Author {
  id: number;
  name: string;
  surnames: string;
  born_date: string;
  death_date: string | null;
}

export interface Institution {
  id: number;
  name: string;
}

export interface IImageData {
  id: number;
  url: string;
  id_work: number;
  big_image_for_slider: number;
  extra_folder: string;
  filename: string;
  big_width_px: number | null;
  big_height_px: number | null;
  width_big: number;
  width_box: number;
  width_list: number;
  width_thumb: number;
  height_big: number;
  height_box: number;
  height_list: number;
  height_thumb: number;
}
