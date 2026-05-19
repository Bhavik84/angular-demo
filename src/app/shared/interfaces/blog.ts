import { Image } from './image';

export interface Blog {
  id: number;
  image: string;
  description: string;
  authorId?: number;
  title: string;
  subTitle: string;
  year?: number;
  category?: string;
  instituteId?: number;
  author?: number;
}

export interface BlogData {
  id: number;
  id_family: number;
  id_status: number;
  id_published: number;
  editors: number;
  date: Date;
  category: string;
  slug: string;
  date_insert: string;
  date_update: string;
  active: boolean;
  articles_published: string;
  articles_family: string;
  articles_status: string;
  authorData: {
    id: number;
    born_date: string;
    death_date: string;
    name: string;
    surnames: string;
    alias: string;
    alias_facet: string;
    intern_code: string;
    date_insert: string;
    date_update: string;
    active: boolean;
  }[];
  images: [
    {
      id: number;
      url: string;
      id_article: number;
    } | null,
  ];
  language: [
    {
      id: number;
      title: string;
      summary: string;
      content: string;
    } | null,
  ];
}

export interface blogData {
  id: number;
  id_family: number;
  id_status: number;
  published: boolean;
  editors: string;
  date: string;
  category: string;
  slug: string;
  date_insert: string;
  date_update: string;
  active: boolean;
  articles_family: {
    id: number;
    name: string;
  };
  articles_status: {
    id: number;
    name: string;
  };
  articles_images: ILanguageImage[];
  articles_tags: IArticleTags[];
  articles_languages: [
    {
      id_article: number;
      id_language: number;
      title: string;
      subtitle: string;
      summary: string;
      content: string;
    },
  ];
  articles_author: IArticleAuthors;
  articles_articles_categories: IArticleCategories[];
  article_language_images: ILanguageImage[];
}
export interface ArticlesCategoriesLanguage {
  id_article_category: number;
  id_language: number;
  name: string;
}

export interface ArticlesCategory {
  id: number;
  name: string;
  articles_categories_languages: ArticlesCategoriesLanguage[];
}

export interface IArticleAuthors {
  id: number;
  name: string;
  surnames: string | null;
  extra_info: string | null;
  url: string | null;
  active: boolean;
}

export interface IArticleCategories {
  id_article: number;
  id_article_category: number;
  articles_category: ArticlesCategory;
}
export interface ArticleApiResponse {
  data: BlogData[];
  is_error: boolean;
  message: string;
}

export interface IArticleTags {
  id_tag: number;
  id_article: number;
  tag: {
    id: number;
    name: string;
    tags_languages: {
      name: string;
      id_tag: number;
      description: string;
    }[];
  };
}

export interface calender {
  id: number;
  activitiyTypeCount: number;
  activities_types_languages: languages[];
}

export interface languages {
  name: string;
  id: number;
}

export interface IBehindCameraPageData {
  searchData: string;
  blogsData: blogData[];
  imageList: Image[];
  behindTheCameraScrollId: string;
  activePage: number;
}
export interface ILanguageImage {
  id: number;
  url: string;
  id_article: number;
  articles_images_languages: IImageLanguages[];
}

export interface IImageLanguages {
  alt: string;
  description: string;
  id_image: number;
  id_language: number;
  title: string;
}
