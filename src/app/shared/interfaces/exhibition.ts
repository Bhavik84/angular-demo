export interface exhibition {
  slug: string;
  id: number;
  name: string;
  images: images[];
  initial_date?: string;
  final_date?: string;
  organitzation: string;
  exhibitions_languages?: ExhibitionLanguages[];
}
export interface ExhibitionLanguages {
  description?: string;
}
export interface images {
  id?: number;
  url_imagen: string;
}
export interface HomeVirtualExhibition {
  resources_images: ResourceImages[];
  title: string;
  creator_name: string;
  resources_type: ResourceType;
  order_date: string;
  place: string;
  resources_languages: ResourceLanguages[];
}
export interface ResourceImages {
  url: string;
}
export interface ResourceType {
  resources_types_languages: {
    name: string;
  }[];
}
export interface ResourceLanguages {
  theme: string;
}
