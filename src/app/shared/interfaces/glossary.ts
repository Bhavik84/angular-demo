export interface GlossaryDetailListRes {
  data: {
    totalCount: number;
    works: IGlossary[];
    decades?: { id: number; decade: number };
    technique: Glossary[];
  };
  is_error: boolean;
  message: string;
}
export interface Glossary {
  id_work?: number;
  id_technique: number;
  worksTechniquesLanguages: {
    name: string;
    description: string;
  };
}

export interface workTechnique {
  active: boolean;
  actual_ubication: string;
  adquisition: string;
  counter_views: number;
  date: string;
  date_insert: string;
  date_update: string;
  dimensions: string;
  id: number;
  id_author?: number;
  id_collection?: number;
  id_institution?: number;
  id_technique: number;
  inventory_number: string;
  language: workLang[];
  name: string;
  rights: string;
  worksTechniques?: technique[];
  slug: string;
  works_images?: WorkImage[];
  works_languages?: workLang[];
  works_techniques: {
    id_technique: number;
    worksTechniquesLanguages: { name: string };
  };
}

export interface technique {
  id: number;
  name: string;
}

export interface IGlossaryList {
  description: string;
  id_technique: number;
  isEnable: boolean;
  name: string;
}

export interface WorkImage {
  url: string;
}

export interface workLang {
  id_language: number;
  id_work: number;
  summary: string;
  title_long: string;
  title_short?: string;
  workImage: workImage[];
}

export interface workImage {
  alt: string;
  description: string;
  id: number;
  id_image: number;
  id_language: number;
  id_work: number;
  title: string;
  url: string;
}

export interface IGlossary {
  author: IAuthor;
  date: string;
  decades: string;
  id: number;
  institution: {
    id: number;
    name: string;
    slug: string;
  };
  name: string;
  slug: string;
  works_images: IWorkImages[];
  works_languages: IWorkLanguages[];
  works_techniques: IWorkTechniques[];
}
export interface IAuthor {
  id: number;
  name: string;
  surnames: string;
  born_date: string;
  date_insert: string;
  death_date: string;
}
export interface IWorkImages {
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
}
export interface IWorkLanguages {
  id_language: number;
  id_work: number;
  summary: string;
  technique: string;
  title_long: string;
  title_short: string;
}
export interface IWorkTechniques {
  id_technique: number;
  id_work: number;
  worksTechniquesLanguages: {
    description: string;
    id_language: number;
    id_technique: number;
    name: string;
  };
}
export interface IImageList {
  id: number;
  slug: string;
  image: string;
  extra_folder: string;
  title: string;
  author: string;
  description: string;
  date: string;
}

export interface IDecadeList {
  data: IDecades;
  is_error: boolean;
}
export interface IDecades {
  decades: {
    decade: string;
    decade_to_show: string;
  }[];
}
