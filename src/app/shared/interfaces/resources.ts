export interface resources {
  id: number;
  code: string;
  title: string;
  url: string;
  creator_name: string;
  order_date: string;
  year: string;
  pages: string;
  flag: string;
  tag: string;
  slug: string;
  id_type: number;
  id_format: number;
  date_insert: string;
  date_update: string;
  active: boolean;
  resource_language_images?: ILanguageImages[];
  resources_type?: {
    id: number;
    name: string;
    colour: string;
    resources_types_languages: {
      id_resource_type: number;
      id_language: number;
      name: string;
    }[];
  };
  resources_format: {
    id: number;
    name: string;
    resources_formats_languages: {
      id_language: number;
      name: string;
    }[];
  };
  resources_images?: {
    id: number;
    url: string;
    id_resource: number;
    resources_images_languages: IImageLanguages[];
  }[];
}
export interface ResourceType {
  id: number;
  resourcesTypeCount: number;
  resources_types_languages: {
    name: string;
  }[];
}
export interface ResourceFormat {
  id: number;
  resourcesFormatCount: number;
  resources_formats_languages: {
    name: string;
  }[];
}
export interface IImageLanguages {
  alt: string;
  description: string;
  id_image: number;
  id_language: number;
  titl: number;
}
export interface ILanguageImages {
  id: number;
  url: string;
  id_resource: number;
  resources_images_languages: IImageLanguages[];
}
