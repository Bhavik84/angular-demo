export interface Authors {
  id: number;
  born_date: string;
  death_date: string;
  name: string;
  surnames: string;
  alias: string;
  slug: string;
  alias_facet: string;
  intern_code: string;
  date_insert: string;
  date_update: string;
  active: boolean;
  selected?: boolean;
}

export interface authorAcquisitionList {
  data: {
    totalCount: number;
    authors: AuthorName[];
  };
  is_error: boolean;
  message: string;
}

export interface AuthorName {
  id: number;
  name: string;
  surnames?: string;
  selected: boolean;
}

export interface AuthorData {
  [key: string]: Authors[];
}
