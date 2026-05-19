export interface IRedirectOptionData {
  tag?: {
    id: number;
    id_type: number;
    tags_languages: { name: string }[];
  };
  worksTechniques?: {
    id: number;
    works_techniques_languages: { name: string }[];
  };
  works_rights_languages?: { name: string }[];
  id?: number;
}
