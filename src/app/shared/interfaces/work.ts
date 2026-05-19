export interface IPhotoDetails {
  data : Work;
  is_errror : boolean;
  message : string;
}

export interface Work {
  id: number;
  name: string;
  date: string;
  dimensions: string;
  inventory_number: string;
  adquisition: string;
  actual_ubication: string;
  rights: string;
  id_author: number;
  id_collection: number;
  id_technique: number;
  id_institution: number;
  date_insert: string;
  date_update: string;
  active: boolean;
  counter_views: number;
  link: string;
  slug: string;
  id_rights: number;
  date_copy: string;
  decades: string;
  attributes_technique_description: string;
  works_tags: authorTag[];
  works_images: {
    id: number;
    url: string;
  }[];
  techniqueData: { id_technique: number; id_work: number }[];
  tagsData: { id_tag: number; id_work: number }[];
  author: {
    id: number;
    name: string;
    surnames: string;
    slug: string;
    selected: boolean;
    born_date?: string;
    death_date?: string;
  };
  institution: {
    id: number;
    name: string;
    selected: boolean;
  };
  worksTechniques: {
    id: number;
    name: string;
  };
  works_decades: {
    id_decades: number;
    id_work: number;
    works_decade: {
      decade: string;
      id: number;
    };
  }[];
  works_right: {
    id: number;
    name: string;
    works_rights_languages: {
      id_language: number;
      id_rights: number;
      name: string;
    }[];
  };
  works_techniques: workTechnique[];
  collection: {
    id: number;
    slug: string;
    tag: string;
    owner: string;
    id_type: number;
    date_insert: string;
    date_update: string;
    active: boolean;
    collections_languages: {
      id_collection: number;
      id_language: number;
      title_short: string;
      title_long: string;
      summary: string | null;
      about: string | null;
    }[];
  };
  imagesData: [
    {
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
      languagesData: [
        {
          id_image: number;
          id_language: number;
          title: string;
          description: string;
          alt: string;
        },
      ];
      languageData: [
        {
          id_image: number;
          id_language: number;
          title: string;
          description: string;
          alt: string;
        },
      ];
      workLanguagesData: [
        {
          id_image: number;
          id_language: number;
          title: string;
          description: string;
          summary: string;
          alt: string;
        },
      ];
    },
  ];
  languageData: {
    technique: string;
    id_language: number;
    id_work: number;
    summary: string;
    title_long: string;
    title_short: string;
  }[];
}

export interface authorTag {
  id_tag: number;
  id_author: number;
  tag: {
    id: number;
    name: string;
    id_type: number;
    tags_languages: {
      id_tag: number;
      id_language: number;
      name: string;
    }[];
  };
}

export interface MostViewed {
  id: number;
  id_work: number;
  url: string;
}

export interface workTechnique {
  id_technique: number;
  id_work: number;
  worksTechniques: {
    id: number;
    name: string;
    glossary: boolean;
    works_techniques_languages: {
      id_language: number;
      id_technique: number;
      name: string;
      description: string;
    }[];
  };
}

export interface DropDownFilter {
  id: number;
  name: string;
}

export interface DropDownFilterCount extends DropDownFilter {
  count: number;
}

export interface IHomeBannerImage {
  id: number;
  slug: string;
  image: IBannerImageData;
  title: string;
  description: string;
  thumbnail: IBannerImageData;
  date: string;
}

export interface IBannerImageData {
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
