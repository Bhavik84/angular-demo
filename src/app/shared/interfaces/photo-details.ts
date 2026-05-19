export interface IInstitutionDetailData {
  data : PhotoDetails;
  is_error : boolean;
  message : string;
}

export interface PhotoDetails {
  id: number;
  url: string;
  id_author: number;
  name: string;
  description: string;
  alt?: string;
  date_insert?: string;
  id_technique?: string;
  dimensions?: string;
  collection?: string;
  inventory_number?: string;
  adquisition?: string;
  actual_ubication?: string;
  rights?: string;
  title?: string;
  author_name?: string;
  address?: string;
  institutions_images: images[];
  institutions_tags: authorTag[];
  telephone?: string;
  institutions_languages: LanguageData[];
  about?: string;
  acronym: string;
}

export interface LanguageData {
  id?: number;
  about?: string;
}

export interface images {
  url: string;
  id: number;
  id_work: number;
}

export interface authorTag {
  id_tag: number;
  id_author: number;
  tag: {
    id: number;
    name: string;
    tags_languages: {
      id_tag: number;
      id_language: number;
      name: string;
    }[];
  };
}
