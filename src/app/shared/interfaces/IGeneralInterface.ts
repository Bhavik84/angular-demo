export interface ITagLanguage {
  id_tag: number;
  id_language: number;
  name: string;
  description: string | null;
  alt: string | null;
}

export interface ITags {
  id: number;
  name: string;
  id_type: number;
  for_authors: boolean;
  for_works: boolean;
  worksTagCount: number;
  authorTagCount: number;
  articlesTagCount: number;
  tags_languages: ITagLanguage[];
}

export interface SortableData {
  id: number;
  name: string;
  count: number;
}
