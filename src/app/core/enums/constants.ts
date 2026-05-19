export const constants: any = {
  SHOW_SPLASH_SCREEN: 'showSplashScreen',
  SPLASH_SCREEN_EXPIRY: 'splashScreenExpiry',
  DEFAULT_LANGUAGE: 2,
  DEFAULT_LANGUGE_ALIAS: 'ca',
  MESONARY_IMAGE_LIMIT: 24,
  VIEWS: {
    GRID: 'grid',
    LIST: 'list',
    SLIDE: 'slide',
  },
  BLOG_ROUTE: '/news/blog/',
  LOCAL_STATIC_LINKS: {
    NO_DATA: '/assets/images/no-data.png',
    NO_DATA_DARK: '/assets/images/no-data-dark.png',
    VIRTUAL_EXHIBITION_NO_DATA: 'assets/images/no-data-exhibition.png',
    SLIDER_ICON: '/assets/images/slider-icon.png',
    LOGO: '/assets/images/logo.jpg',
    COOKIE_ICON: '/assets/images/cookies-icon.png',
    TOP_LOGO: 'assets/images/logo.jpg',
    TOP_LOGO_SVG: 'assets/images/logo.svg',
    FOOTER_LOGO_1: '/assets/images/footer_logo_white.png',
    FOOTER_LOGO_2: '/assets/images/footer-logo.png',
    LEFT_ARROW: '/assets/images/left-arrow.png',
    RIGHT_ARROW: '/assets/images/right-arrow.png',
  },

  STATIC_LINKS: {
    NO_DATA: '/assets/images/no-data.png',
    NO_DATA_DARK: '/assets/images/no-data-dark.png',
    SLIDER: '/assets/images/slider-icon.png',
    ALABERN: 'http://alabern.sctestingsite.com/',
    COOKIES_FIREFOX: 'http://support.mozilla.org/es/products/firefox/cookies',
    CHROME_COOKIES:
      'http://support.google.com/chrome/bin/answer.py?hl=es&answer=95647',
    INTERNET_EXPLORER_COOKIES:
      'http://windows.microsoft.com/es-es/windows7/how-to-manage-cookies-in-internet-explorer-9',
    SAFARI_COOKIES: 'http://support.apple.com/kb/ph5042',
    OPERA_COOKIES: 'http://www.opera.com/help/tutorials/security/privacy/',
    COOKIE_ICON: '/assets/images/cookies-icon.png',
    ART_MUSEUM: 'https://museunacional.cat',
    NAMASTECH: 'https://namastech.com',
    PHOTOGRAPHY_PLAN:
      'https://cultura.gencat.cat/ca/departament/plans-i-programes/ambit-sectorial/pla-nacional-fotografia/',
  },

  ASSETS_PATH: {
    STATIC_LINK_CA: './assets/i18n/static-link-ca.json',
    STATIC_LINK_ES: './assets/i18n/static-link-es.json',
    STATIC_LINK_EN: './assets/i18n/static-link-en.json',
    STATIC_LINK_FR: './assets/i18n/static-link-fr.json',
  },

  SEO_PATH: {
    SEO_CA: './assets/i18n/seo-ca.json',
    SEO_ES: './assets/i18n/seo-es.json',
    SEO_EN: './assets/i18n/seo-en.json',
    SEO_FR: './assets/i18n/seo-fr.json',
  },

  LANGUAGE_LIST: {
    ES: 'es',
    CA: 'ca',
    EN: 'en',
    FR: 'fr',
    es: 1,
    ca: 2,
    en: 3,
    fr: 4,
  },
  NO_DATE_LABEN: 'No datat',
  SIZE_OF_WEB: [
    { key: 12, value: 15 },
    { key: 14, value: 17 },
    { key: 16, value: 19 },
    { key: 18, value: 21 },
    { key: 20, value: 23 },
    { key: 24, value: 27 },
    { key: 30, value: 33 },
    { key: 36, value: 39 },
    { key: 40, value: 43 },
    { key: 45, value: 48 },
    { key: 55, value: 58 },
    { key: 65, value: 68 },
    { key: 70, value: 73 },
    { key: 72, value: 75 },
    { key: 80, value: 83 },
    { key: 90, value: 93 },
  ],
  SIZE_OF_MOBILE: [
    { key: 12, value: 12 },
    { key: 14, value: 14 },
    { key: 16, value: 16 },
    { key: 18, value: 16 },
    { key: 20, value: 18 },
    { key: 24, value: 24 },
    { key: 30, value: 28 },
    { key: 36, value: 32 },
    { key: 40, value: 36 },
    { key: 45, value: 40 },
    { key: 55, value: 50 },
    { key: 65, value: 60 },
    { key: 70, value: 64 },
    { key: 72, value: 66 },
    { key: 80, value: 75 },
    { key: 90, value: 80 },
  ],
  LIMIT: {
    TEN: 10,
    ZERO: 0,
    SIX: 6,
    TWENTY_FOUR: 24,
  },

  WORK_DECADE_VALUE: {
    START: 1800,
    END: 2030,
    INCREAMENT: 10,
  },

  WORK_FILTER_TYPE: {
    AUTHORS: 'authors',
    INSTITUTION: 'institutions',
    TECHNIQUES: 'techniques',
    RIGHTS: 'rights',
    TYPE_1_TAG: 'Type1Tag',
    TYPE_2_TAG: 'Type2Tag',
    TYPE_3_TAG: 'Type3Tag',
    DECADE: 'decade',
  },

  PRIVATE_INSTITUTION_ID: 5,
  EXPOSISION_ARTICLE: 3,
  IMAGE_PARAM:"?isPdf=true",
  API_PARAM:"&isValid=true",

  AUTHOR_FILTER_TYPE: {
    TYPE_1_TAG: 'Type1Tag',
    DECADE: 'decade',
  },

  HOME_SEARCH_OPTION: {
    PHOTOGRAPHER: 'photographers',
    COLLECTION: 'collections',
    INSTITUTION: 'institutions',
    PHOTOGRAPH: 'photograph',
  },

  BLOG_FILTER_TYPE: {
    TAGS: 'tags',
    AUTHORS: 'editors',
    CATEGORIES: 'categories',
  },

  CALENDAR_FILTER_TYPE: {
    TYPE: 'type',
    SEGMENT: 'segment',
  },

  ACTIVITY_TYPE: {
    PAST: 'PAST',
    ONGOING: 'ONGOING',
  },

  RESOURCE_FILTER_TYPE: {
    RESOURCES: 'resources',
    FORMATS: 'formats',
  },

  PAGE_KEYS: {
    FUNDS: 'BACKGROUND_SEARCHER',
    PHOTO_SEARCHER: 'PHOTO_SEARCHER',
    PHOTOGRAPHER: 'PHOTOGRAPHER_SEARCHER',
    INSTITUTION: 'INSTITUTION_SEARCHER',
    BEHIND_THE_CAMERA: 'BEHIND_THE_CAMERA',
    BLOG: 'BLOG',
    GLOSSARY: 'GLOSSARI',
    AGENDA: 'CALENDAR_SEARCH_ENGINE',
    COLLECTIONS: 'PHOTO_SEARCHER',
    NEWS: 'CALENDAR_SEARCH_ENGINE',
    NEW_ACQUISITIONS: 'NEW_ACQUISITIONS',
    RESEARCH:'RESEARCH'
  },

  WORK_DETAIL_FILTER_TYPES: {
    TAG: 'tag',
    TECHINIQUE: 'technique',
    LICENSE: 'license',
  },

  IMAGE_SIZES: {
    BIG: 'big',
    LIST: 'list',
    BOX: 'box',
    THUMB: 'thumb',
  },

  WEB_MODE: {
    DARK: 'dark',
    LIGHT: 'light',
  },

  SORT_BY: {
    ASC: 'ASC',
    DESC: 'DESC',
  },
  NO_AUTHOR: 'Autor desconegut',
  RESOURCE_TYPE_LIBRE_ID:2,
  RESOURCE_TYPE_COLOR:"#FFD406"
};
