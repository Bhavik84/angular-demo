export interface Image {
  id?: number;
  image: string;
  title: string;
  description?: string;
  thumbnail?: string;
  date?: string;
  author?: string;
  slug?: string;
  born_date?: string;
  death_date?: string;
  date_copy?: string;
  organitzation?: string;
  initial_date?: string;
  final_date?: string;
  extra_folder?: string;
  exhibitions_languages?: ExhibitionLanguages[];
  id_technique?: {
    id_technique: number;
    worksTechniquesLanguages: {
      name: string;
    };
  };
}
export interface IWorkImage {
  id?: number;
  image: IImageData;
  title: string;
  description?: string;
  thumbnail?: string;
  date?: string;
  author?: string;
  slug?: string;
  born_date?: string;
  death_date?: string;
  date_copy?: string;
  organitzation?: string;
  initial_date?: string;
  final_date?: string;
  extra_folder?: string;
  exhibitions_languages?: ExhibitionLanguages[];
  id_technique?: {
    id_technique: number;
    worksTechniquesLanguages: {
      name: string;
    };
  };
}
export interface IWorkImageData {
  id?: number;
  image: IImageData;
  title: string;
  description?: string;
  thumbnail?: string;
  date?: string;
  author?: { name: string; surnames: string };
  slug?: string;
  born_date?: string;
  death_date?: string;
  date_copy?: string;
  organitzation?: string;
  initial_date?: string;
  final_date?: string;
  extra_folder?: string;
  exhibitions_languages?: ExhibitionLanguages[];
  id_technique?: {
    id_technique: number;
    worksTechniquesLanguages: {
      name: string;
    };
  };
}

export interface IImageData {
  id?: number;
  url?: string;
  filename?: string;
  extra_folder?: string;
  id_work?: number;
  width_big?: number;
  width_box?: number;
  width_list?: number;
  width_thumb?: number;
  height_big?: number;
  height_box?: number;
  height_list?: number;
  height_thumb?: number;
}

export interface ExhibitionLanguages {
  description?: string;
}

// slide.interface.ts
export interface Slide {
  img: string;
}
export interface BannerImage {
  actual_ubication: string;
  adquisition: string;
  attributes_technique_description: string;
  author: AuthorData;
  collection: CollectionData[];
  counter_views: number;
  date: string;
  date_copy: string;
  date_insert: string;
  date_update: string;
  dimensions: string;
  id: number;
  id_author: number;
  id_collection: number;
  id_institution: number;
  id_rights: number;
  imagesData: ImagesData;
  institution: [];
  inventory_number: string;
  link: string;
  mainSlider: MainSLiderData;
  name: string;
  new_adquisition: number;
  rights: string;
  show_in_home_slider: number;
  slide: boolean;
  slug: string;
  thumbnailSlider: ThumbnailSlider;
  works_images: [];
  works_right: [];
  works_techniques: [];
  year_adquisition: number;
}
export interface AuthorData {
  alias: string;
  alias_facet: string;
  born_date: string;
  born_place: string;
  date_insert: string;
  date_update: string;
  death_date: string;
  death_place: string;
  id: number;
  intern_code: string;
  name: string;
  slug: string;
  surnames: string;
}
export interface CollectionData {
  date_insert: string;
  date_update: string;
  id: number;
  id_type: number;
  owner: string;
  slug: string;
  tag: string;
}
export interface ImageData {
  big_image_for_slider: number;
  id: number;
  id_work: number;
  url: string;
}
export interface MainSLiderData {
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
export interface ThumbnailSlider {
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
export interface ImagesData {
  url: string;
  filename: string;
  extra_folder: string;
}

export interface PhotographerDetails {
  id: string;
  name: string;
  bio?: string;
  profileImage?: string;
  portfolio?: string[];
}

export interface TagLanguage {
  id_tag: number;
  id_language: number;
  name: string;
  description?: string | null;
  alt?: string | null;
}

export interface Tag {
  id: number;
  name: string;
  id_type: number;
  for_authors: boolean;
  for_works: boolean;
  tags_languages: TagLanguage[];
}

export interface ITagData {
  id_tag: number;
  id_author?: number;
  tag?: Tag;
}

export interface ImageItem {
  src: string;
  title?: string;
  description?: string;
  date?: string;
  author?: string;
}

export interface ILocalPayload {
  authorActivePage: number;
  pageSize: number;
}
