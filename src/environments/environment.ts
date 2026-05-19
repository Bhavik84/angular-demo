export const environment = {
  production: true,
  // Production
  BASE_PATH: 'https://fotografiacatalunya.namastech.com/',
  API_END_POINT: 'https://app.fotografiacatalunya.namastech.com/',
  IMAGE_URL: 'https://app.fotografiacatalunya.namastech.com/',
  IMAGE_URL_PROXY: 'https://app.fotografiacatalunya.namastech.com/proxy?url=',
  VIRTUAL_EXHIBITION_URL:
    'https://virtualexhibition.fotografiacatalunya.namastech.com',
  DEFAULT_IMAGE_PATH: 'assets/images/No-Image-Placeholder.png',
  RECAPTCHA_KEY: '6LdmY20rAAAAACbgHTigeKznQ8qVA7n9Ga9HIRDl',
  RECAPTCHA_V3_KEY: '6LdmY20rAAAAACbgHTigeKznQ8qVA7n9Ga9HIRDl',
  ALLOWED_HOSTS: ['localhost', 'fotografiacatalunya.namastech.com'],

  // Author Routes
  GET_ALL_AUTHOR: 'api/author/getAllAuthorList',
  GET_ALL_AUTHORS_IMAGE: 'api/author/getAllAuthorsImg',
  GET_ALL_AUTHORS: 'api/author/getAllAuthors',
  GET_RANDOM_AUTHOR: 'api/author/getRandomAuthors',
  RELATED_AUTHOR: 'api/author/reletedAuthors',
  PHOTOGRAPHER_DATA: 'api/author/getAuthorDetails',
  GET_ACQUISITION: 'api/author/getAuthorAquations',
  GET_ALL_AUTHOR_LISTING: 'api/author/getWorkAuthorAquations',
  GET_AUTHOR_DECADES: 'api/author/getAuthorDecade',
  AUTHORS: 'authors/',

  // works Module.
  GET_ALL_WORK_IMAGE: 'api/works/getAllWorks',
  GET_RELATED_WORK: 'api/works/reletedWorks',
  GET_WORK_DETAIL: 'api/works/getWorksDetail',
  GET_WORK_BY_ID: 'api/works/getAllWorkByModel/',
  GET_RANDOM_WORK: 'api/works/getRandomWorkImages',
  GET_WORK_RIGHTS: 'api/works/getAllRights',
  GET_MOST_VIEWED_WORK: 'api/works/getMostViewedWorks',
  GET_WORK_TAGS: 'api/tags/getAllTags',
  GET_WORK_DECADES: 'api/works/getAllDecade',
  GET_BANNER_IMAGE: 'api/works/sliderWorks',
  WORKS: 'work/',
  GET_ALL_WORK_AUTHOR_DATA: 'api/author/getAllWorkAuthors',
  GET_ALL_WORKS: 'api/works/getWorks',

  // Institute Module.
  GET_ALLINSTITUTE: 'api/institute/getAllInstitutions',
  GET_INSTITUTE: 'api/institute/getInstitutionDetail',
  INSTITUTIONS: 'institutions/',

  // Article Module.
  GET_RANDOM_BLOG: 'api/articles/getArticleRandom',
  GET_ALL_ARTICLE: 'api/articles/getAllArticles',
  GET_RECENT_ARTICLE: 'api/articles/getRecentArticles',
  GET_ALL_ARTICE_FAMILY: 'api/articles/getFamilyListAdmin',
  GET_ALL_ARTICLE_PUBLISHED: 'api/articles/getPublishedListAdmin',
  GET_ARTICAL: 'api/articles/getArticleDetails',
  ARTICLES: 'articles/',
  SEND_FEEDBACK: 'api/articles/createArticleComment',
  // collections
  GET_ALL_COLLECTION: 'api/collections/getAllCollection',
  GET_COLLECTION_TYPES: 'api/collections/getAllCollectionType',
  GET_COLLECTION_DETAIL: 'api/collections/getCollectionDetail',
  COLLECTIONS: 'collections/',
  DOWNLOAD_PHOTODETAIL_PDF: 'api/collections/photoDetailsPdf',
  DOWNLOAD_PHOTOGRAPHERFETAIL_PDF: 'api/collections/photoGrapherDetailsPdf',
  DOWNLOAD_BACKGROUNFDETAIL_PDF: 'api/collections/backgroundDetailsPdf',
  DOWNLOAD_INSTITUTE_PDF: 'api/collections/instituteDetailsPdf',
  DOWNLOAD_EXHIBITIONS: 'api/activities/activityDetailsPdf',
  PDF: 'pdf/',

  // Blogs
  GET_ALL_BLOG: '/blog/getAllBlog',
  GET_NEIGHBOUR_ARTICLE: 'api/articles/getNeighborArticle/',
  // Glossaries
  GLOSSARY_LIST: 'api/glossary/getAllGlossaryDetails',
  GET_ALL_GLOSSARY: 'api/glossary/getAllGlossary',
  GET_ALL_GLOSSARY_LIST: 'api/glossary/getWorkReletedTechnique',
  GET_SINGLE_GLOSSARY_DETAIL: 'api/glossary/getGlossaryDetail/',
  GET_ALL_GLOSSARY_DECADE: 'api/glossary/getAllGlossaryDecade',
  GET_ALL_TECHNIQUES: 'api/glossary/getWorkTechnique',

  // Activity
  GET_ALL_ACTIVITY: 'api/activities/getAllActivities',
  GET_ACTIVITY_DETAILS: 'api/activities/getActivityDetail',
  GET_ACTIVITY_TYPES: 'api/activities/getAllActivitiesTypes',
  GET_ACTIVITY_SEGMENTS: 'api/activities/getAllActivitiesSegments',
  ACTIVITIES: 'activities/',

  // resources
  GET_RESOURCES: 'api/resources/getAllResources',
  GET_RESOURCES_TYPE: 'api/resources/getAllResourceType',
  GET_RESOURCE_FORMAT: 'api/resources/getAllResourceFormat',
  RESOURCES: 'resource/',

  // virtual-exhibition
  GET_ALL_EXHIBITION: 'api/exhibitions/getAllExhibition',
  EXHIBITION: 'exhibition/',

  // parameters..
  SORTBY: 'sortBy',
  LIMIT: 'limit',
  OFFSET: 'offset',
  SEARCH: 'search',

  // common
  GET_ALL_CONTENT: '/content/getAllContent',
  GET_ALL_LANGUAGES: 'api/common/languages',

  GET_ALL_AUTHOR_NAME_LIST: 'api/author/getAllAuthorsName',
};
