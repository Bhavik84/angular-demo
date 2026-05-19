import { filter } from './alabern-portal';
import { blogData } from './blog';
import { IGlossary } from './glossary';
import { Image, ITagData } from './image';
import { resources } from './resources';
import { DropDownFilter, Work } from './work';

export interface Common {}

export interface ApiResponse {
  data: [];
  is_error: boolean;
  message: string;
}

export interface dropDownPayload {
  limit: number;
  offset: number;
  search: string;
  for_authors?: boolean;
  for_works?: boolean;
  types?: number[];
  status?: string;
}

export interface LANG_ARRAY {
  alias: string;
  id_language: string;
  name: string;
}

export interface TAG {
  id: number;
  name: string;
  id_type: number;
  worksTagCount: number;
  authorTagCount: number;
  articlesTagCount: number;
  tags_languages: {
    id_tag: number;
    id_language: number;
    name: string;
  }[];
}

export interface ISocialShare {
  title: string;
  text: string;
  url: string;
}

export interface IWorkData {
  name: string;
  date: string;
  id_author?: number;
  author?: string;
  id_institution?: number;
  institution?: string;
  id_rights?: number;
  techniqueData?: ITechnique[];
  decades?: string;
  tagsData?: ITagData[];
}

export interface ITechnique {
  id_technique: number;
}

export interface IFilterItem {
  id: number;
  name?: string;
}

export interface IDecade {
  name: string;
}
export interface ILanguages {
  id_language: number;
  name: string;
  alias: string;
}

export interface IPhotographPageData {
  searchData: string;
  sortingOrder: string;
  limit: number;
  offset: number;
  totalCount: number;
  allWorksData: Work[];
  imageList: Image[];
  photographPageView: string;
  filter: {
    selectedAuthors: DropDownFilter[];
    selectedDecades: DropDownFilter[];
    selectedTechnique: DropDownFilter[];
    selectedInstitutions: DropDownFilter[];
    selectedRights: any[];
    selectedTags: DropDownFilter[];
    selectedCollections: DropDownFilter[];
    searchDate: string;
    type1SelectedTags: DropDownFilter[];
    type2SelectedTags: DropDownFilter[];
    type3SelectedTags: DropDownFilter[];
  };
  photographPageScrollId: string;
  activePage: number;
}
export interface IStaticLinks {
  NO_DATA: string;
  NO_DATA_DARK: string;
  SLIDER: string;
  ALABERN: string;
  COOKIES_FIREFOX: string;
  CHROME_COOKIES: string;
  INTERNET_EXPLORER_COOKIES: string;
  SAFARI_COOKIES: string;
  OPERA_COOKIES: string;
  COOKIE_ICON: string;
  ART_MUSEUM: string;
  NAMASTECH: string;
  PHOTOGRAPHY_PLAN: string;
  INSTAGRAM_PAGE_LINK: string;
  FACEBOOK_PAGE_LINK: string;
  TWITTER_PAGE_LINK: string;
  VIRTUAL_EXHIBITION_URL: string;
}

export interface IAcquisitionsPageData {
  selectedYear: string;
  selectedAuthors: string[];
  auquisitionsPageScrollId: string;
}

export interface IResearchPageData {
  searchData: string;
  selectedResourceType: { id: number; name: string }[];
  selectedFormats: { id: number; name: string }[];
  resourceData: resources[];
  researchPageScrollId: string;
}

export interface IGlossaryPageData {
  selectedGlossary: number;
  selectedTechnique: number;
  isDecadeSearch: boolean;
  decadesData: any[];
  techniquesData: any[];
  worksData: IGlossary[];
  glossaryPageScrollId: string;
  activePage: number;
}

export interface IBlogPageData {
  searchData: string;
  searchDate: string;
  selectedTags: filter[];
  selectedAuthors: filter[];
  selectedCategories: filter[];
  limit: number;
  offset: number;
  totalCount: number;
  blogData: blogData[];
  blogList: blogData[];
  blogPageScrollId: string;
}
export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  multimedia: boolean;
}
