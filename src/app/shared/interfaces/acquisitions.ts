export interface Acquisitions {
  id: number;
  name: string;
  title_short?: string;
  date: string;
  dimensions: string;
  inventory_number: string;
  adquisition: string;
  actual_ubication: string;
  rights: number;
  id_author: number;
  id_collection: number;
  id_technique: number;
  id_institution: number;
  date_insert: string;
  date_update: string;
  slug: string;
  active: boolean;
  counter_views: number;
  imagesData: images[];
  works_images: WorkImage[];
  author: { id: number; name: string; surnames: string };
  institution: { id: number; name: string; acronym?: string };
}

interface WorkImage {
  url: string;
  filename: string;
  extra_folder: string;
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

export interface images {
  id: number;
  url: string;
}
export interface AcquisitionsResponse {
  data: Acquisitions[];
  is_error: boolean;
  message: string;
}
