import { Collection } from './collection';
import { Image } from './image';
import { Work } from './work';

export interface institute {
  id: number;
  slug: string;
  name: string;
  description: string;
  institutions_images: { id: number; id_institution: number; url: string }[];
  author: { name: string; surnames: string };
  imagesData: images[];
  date_insert: string;
  date: string;
  institution: { name: string; id: number };
}

export interface images {
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
}

export interface IInstitute {
  searchData: string;
  sortingOrder: string;
  institutionData: institute[];
  imageList: Image[];
  institutionPageScrollId: string;
  activePage: number;
  institutionPageView: string;
  institutionDetailPageTabIndex: number;
  institutionDetailSearchTerm: string;
  institutionDetailScrollId: string;
  institutionDetailView: string;
  institutionDetailWorkData : institute[];
  institutionDetailId:string;
  institutionDetailActivePage:number;
}

export interface IArtWorkFundPageData {
  searchData: string;
  sortingOrder: string;
  collectionData: Collection[];
  imageList: Image[];
  fundsScrollId: string;
  fundsView: string;
  fundsDetailScrollId: string;
  activePage: number;
  detailPagelimit: number;
  detailPageoffset: number;
  detailPageSearchTerm: string;
  fundsDetailView: string;
  detailPageWorkData:Work[];
  detailPageCollectionId:string;
  detailPageWorkActivepage:number;
}

export interface IInstitutionPayload {
  instituteActivePage: number;
  pageSize: number;
}
