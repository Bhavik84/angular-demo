import { filter } from './alabern-portal';
import { Tag } from './image';

export interface Photographer {
  id: number;
  born_date: string;
  death_date: string;
  name: string;
  dones_fotografes?: number;
  surnames: string;
  alias: string;
  alias_facet: string;
  intern_code: string;
  date_insert: string;
  date_update: string;
  image_url: string;
  active: boolean;
  description?: string;
  about?: string;
  exhibitions?: string;
  bibliography?: string;
  slug: string;
  worksCount: number;
  authors_images: Image[];
  authorTags: authorTag[];
  authors_tags: authorTag[];
}
export interface Institute {
  id: number;
  born_date: string;
  death_date: string;
  name: string;
  surnames: string;
  alias: string;
  alias_facet: string;
  intern_code: string;
  date_insert: string;
  date_update: string;
  image_url: string;
  active: boolean;
  description?: string;
  about?: string;
  exhibitions?: string;
  bibliography?: string;
  slug: string;
  authors_images: Image[];
  institutions_images: Image[];
  collections_images: Image[];
  works_images: Image[];
  authors_tags: authorTag[];
  born_place?: string;
  death_place?: string;
  photographerDetail: string;
  url: string;
  authors_languages: {
    about: string;
    bibliography: string;
    exhibitions: string;
    id_author: number;
    id_language: number;
  }[];
}
export interface Image {
  id: number;
  url: string;
  id_author: number;
}

export interface rights {
  is_error: boolean;
  data: { totalCount: number; rights: rightRes[] };
}

export interface rightRes {
  id: number;
  worksRightsCount: number;
  works_rights_languages: WorkRightLanguage[];
}

export interface WorkRightLanguage {
  name: string;
}

export interface workTechnique {
  worksTechniqueCount: number;
  works_techniques_languages: technique[];
}

export interface technique {
  id_tecnique: number;
  id_technique: number;
  name: string;
}
export interface authorTag {
  id_tag: number;
  id_author: number;
  tag: Tag;
}
export interface PhotographerData {
  id: number;
  slug: string;
  name: string;
  imagesData: ImageData[];
  date: string;
  author: {
    name: string;
    surnames: string;
  };
  institution: {
    name: string;
    id: number;
  };
}
export interface ImageData {
  big_image_for_slider: number;
  id: number;
  url: string;
  filename: string;
  extra_folder: string;
  id_work: number;
  width_big: number;
  width_box: number;
  width_list: number;
  width_thumb: number;
  height_big: number;
  height_box: number;
  height_list: number;
  height_thumb: number;
  languageData: LanguageData[];
}
export interface LanguageData {
  id: number;
  name: string;
  description: string;
}

export interface PhotographerFilter {
  selectedYears: filter[];
  type1SelectedTags: filter[];
  type3SelectedTags: number[];
  isLivingAuthor: boolean;
  isWomenPhotographer: boolean;
}

export interface PhotographersPageData {
  searchData: string;
  sortingOrder: string;
  limit: number;
  offset: number;
  totalCount: number;
  imageList: Image[];
  authorData: Photographer[];
  filter: PhotographerFilter;
  photographerPageScrollId: string;
  photographerDetailPageScrollId: string;
  searchDataDetails?: string;
  photographersPageView: string;
  photographerDetailPageView: string;
  photographerDetailPageData:PhotographerData[];
  photographerDetailPageId:string;
  photographerDetailPageActivePage:number;
}

export interface IAllTags {
  id: number;
  name: string;
  id_type: number;
  for_authors: boolean;
  for_works: boolean;
  worksTagCount: number;
  authorTagCount: number;
  articlesTagCount: number;
  tags_languages: TagsLanguage[];
}

export interface TagsLanguage {
  id_tag: number;
  id_language: number;
  name: string;
  description: string;
  alt: string;
}
export interface IDecades {
  decade: string;
  authorCount: number;
}
