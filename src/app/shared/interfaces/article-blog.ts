interface ArticleImgData {
  alt: string;
  description: string;
  id: number;
  id_article: number;
  id_image: number;
  id_language: number;
  title: string;
  url: string;
}

interface ArticleLangData {
  articleImage: ArticleImgData[];
  content: string;
  id_article: number;
  id_language: number;
  summary: string;
  title?: string;
  subtitle: string;
}

interface Author {
  active: boolean;
  alias: string;
  alias_facet: string;
  born_date: string;
  date_insert: string;
  date_update: string | null;
  death_date: string;
  id: number;
  intern_code: string;
  name: string;
  surnames: string;
}

interface NextArticleData {
  active: boolean;
  articles_family: { id: number; name: string }[];
  articles_published: { id: number; name: string }[];
  articles_status: { id: number; name: string }[];
  author: Author;
  category: string;
  content: string;
  date: string;
  date_insert: string;
  date_update: string | null;
  editors: string;
  id: number;
  id_article: number;
  id_family: number;
  id_language: number;
  id_published: number;
  id_status: number;
  slug: string;
  summary: string;
  title: string;
}

export interface IArticleData {
  data : ArticleDetails;
  is_error : boolean;
  message : string
}

export interface ArticleDetails {
  content: string;
  active: boolean;
  articles_languages: ArticleLangData[];
  articles_images: ILanguageImage[];
  articles_family: { id: number; name: string };
  articles_published: { id: number; name: string };
  articles_status: { id: number; name: string };
  articles_author: {
    active: boolean;
    extra_info: string;
    id: number;
    name: string;
    surnames: string;
    url: string;
  };
  author: Author;
  category: string;
  date: string;
  date_insert: string;
  date_update: string | null;
  editors: string;
  id: number;
  id_family: number;
  id_published: number;
  id_status: number;
  nextArticleData: NextArticleData;
  slug: string;
  articles_comments: {
    id: number;
    title: string;
    comment: string;
    user: string;
    id_article: number;
    date: string;
  }[];
  article_language_images: ILanguageImage[];
}

export interface NextArticleDetails {
  content: string;
  active: boolean;
  language: ArticleLangData[];
  articles_family: { id: number; name: string };
  articles_published: { id: number; name: string };
  articles_status: { id: number; name: string };
  author: Author;
  category: string;
  date: string;
  date_insert: string;
  date_update: string | null;
  editors: string;
  id: number;
  id_family: number;
  id_published: number;
  id_status: number;
  slug: string;
  images: ArticleImgData[];
}

export interface ArticleDetailRes {
  data: ArticleDetails;
  is_error: boolean;
  message: string;
}

export interface RandomArticleRes {
  data: NextArticleDetails;
  is_error: boolean;
  message: string;
}

export interface HomePageBlog {
  articles_languages: ArticleLangData[];
  articles_images: ArticleImgData[];
  articles_family: { id: number; name: string };
  articles_published: { id: number; name: string };
  articles_status: { id: number; name: string };
  articles_author: IArticleAuthors;
  category: string;
  date: string;
  date_insert: string;
  date_update: string | null;
  editors: string;
  id: number;
  id_family: number;
  published: number;
  id_status: number;
  slug: string;
}

export interface IArticleAuthors {
  id: number;
  name: string;
  surnames: string | null;
  extra_info: string | null;
  url: string | null;
  active: boolean;
}
export interface HomePageActivity {
  activities_languages: ActivityLanguages[];
  activities_images?: ({ url?: string })[];
  activities_type: ActivityType;
  organizer: string;
  initial_date: string;
  final_date: string;
  address: string;
  id_type:number
}
export interface ActivityLanguages {
  description: string;
  name: string;
}
export interface ActivityType {
  activities_types_languages: {
    name: string;
  }[];
}

export interface IBlogPayload {
  blogActivePage: number;
  pageSize: number;
}

export interface ILanguageImage {
  id: number;
  url: string;
  id_article: number;
  articles_images_languages: IImageLanguages[]
}

export interface IImageLanguages {
  alt: string;
  description: string;
  id_image: number;
  id_language: number;
  title: string;
  source:string
}


export interface IArticleData {

}

export interface INeighbourArticle {
  data: IArticleTypes;
  is_error: boolean;
  message: string;
}

export interface IArticleTypes {
  previousArticle: IArticle;
  nextArticle: IArticle;
}

export interface IArticle {
  id: number;
  id_family: number;
  id_status: number;
  published: boolean;
  editors: string;
  date: string;
  category: string;
  slug: string;
  date_insert: string;
  date_update: string | null;
  id_author: number;
  id_ini: number | null;
  active: boolean;
  articles_languages: ArticleLanguage[];
  articles_images: ArticleImage[];
}

export interface ArticleLanguage {
  id_article: number;
  id_language: number;
  title: string | null;
  subtitle: string | null;
  summary: string | null;
  content: string | null;
  id_article_ini: number | null;
}

export interface ArticleImage {
  id: number;
  url: string;
  id_article: number;
  id_article_ini: number | null;
  articles_images_languages: ArticleImageLanguage[];
}

export interface ArticleImageLanguage {
  id_image: number;
  id_language: number;
  title: string;
  description: string;
  alt: string;
  source: string;
}
