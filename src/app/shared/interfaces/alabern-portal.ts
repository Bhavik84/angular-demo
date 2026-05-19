export interface AlabernPortal {
  data: AlabernPortalData[];
  is_error: boolean;
}

export interface AlabernPortalData {
  id: number;
  url: string;
  id_author: number;
  bigImageForSlider?: number;
  idWork?: number;
}

export interface filter {
  id: number;
  name: string;
  count?: number;
  decade?: string;
  surnames?: string;
}

export interface authorDecade {
  id: string;
  name: string;
  count: number;
}

export interface ITagAndForamt {
  id: number;
  name: string;
  count: number;
}
