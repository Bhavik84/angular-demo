export interface IDisplayResource {
  url: string | undefined;
  resources_images?: { url: string }[];
  resources_type?: {
    colour?: string;
    name?: string;
    resources_types_languages?: { name?: string }[];
  };
  title?: string;
  creator_name?: string;
  year?: string;
  pages?: number;
}
