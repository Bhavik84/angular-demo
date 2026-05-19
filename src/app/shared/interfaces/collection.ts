export interface ICollectionData {
  data : Collection;
  is_error : boolean;
  message : string;
}

export interface Collection {
  id: number;
  slug: string;
  tag: string;
  owner: string;
  id_type: number;
  date: string;
  date_insert: string;
  date_update: string;
  active: boolean;
  worksCount: number;
  collections_tags: authorTag[];
  collections_languages: [
    {
      id_collection: number;
      id_language: number;
      title_short: string;
      title_long: string;
      summary: string;
      about: string;
    },
  ];
  collections_images: [
    {
      id: number;
      url: string;
      id_collection: number;
    },
  ];
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

export interface ICollectionPayload {
  collectionActivePage: number;
  pageSize: number;
}
