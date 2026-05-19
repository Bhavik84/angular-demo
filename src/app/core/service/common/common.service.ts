import {
  DOCUMENT,
  formatDate,
  isPlatformBrowser,
  Location,
} from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, Routes } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, map, Observable, Subject } from 'rxjs';
import CaTranslations from '../../../../assets/i18n/ca.json';
import EnTranslations from '../../../../assets/i18n/en.json';
import EsTranslations from '../../../../assets/i18n/es.json';
import FrTranslations from '../../../../assets/i18n/fr.json';
import CaSeoData from '../../../../assets/i18n/seo-ca.json';
import EnSeoData from '../../../../assets/i18n/seo-en.json';
import EsSeoData from '../../../../assets/i18n/seo-es.json';
import FrSeoData from '../../../../assets/i18n/seo-fr.json';
import { ImageViewerComponent } from '../../../shared/component/custom-image-dialog/image-dialog/custom-image-viewer.component';
import { MatToastrComponent } from '../../../shared/component/mat-toastr/mat-toastr.component';
import { ISocialShare, IStaticLinks } from '../../../shared/interfaces/common';
import { IWorkImage } from '../../../shared/interfaces/image';
import { SeoMetadata } from '../../../shared/interfaces/seo.interface';
import { SocialShareComponent } from '../../../shared/social-share/social-share.component';
import { constants } from '../../enums/constants';
import { ROUTE_PATHS } from '../../enums/routes.enum';
import { ESvgIcon } from '../../enums/svg-icon.enum';
import { activityDetailResolver } from '../../resolver/activity-detail/activity-detail.resolver';
import { articleDetailResolver } from '../../resolver/article-detail/article-detail.resolver';
import { artworkDetailResolver } from '../../resolver/artwork-detail/artwork-detail.resolver';
import { instituteDetailResolver } from '../../resolver/institute-detail/institute-detail.resolver';
import { photographDetailResolver } from '../../resolver/photograph-detail/photograph-detail.resolver';
import { photographerDetailResolver } from '../../resolver/photographer-detail/photographer-detail.resolver';
import { DataStoreService } from '../DataStore/data-store.service';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { environment } from './../../../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class CommonService {
  // language: string = constants.DEFAULT_LANGUAGE;
  languagesList: { id_language: number; alias: string; name: string }[] = [
    {
      id_language: 1,
      alias: 'ES',
      name: 'Español',
    },
    {
      id_language: 2,
      alias: 'CA',
      name: 'Català',
    },
    {
      id_language: 3,
      alias: 'EN',
      name: 'English',
    },
    {
      id_language: 4,
      alias: 'FR',
      name: 'Français',
    },
  ];
  language: number = constants.DEFAULT_LANGUAGE;
  languageAlias = constants.DEFAULT_LANGUGE_ALIAS;
  localStaticLinks = constants.LOCAL_STATIC_LINKS;
  environment = environment;
  icons = ESvgIcon;
  languageChange = new BehaviorSubject(this.language);
  activeLanguage = 'ca';
  previousActiveLanguage = 'ca';
  switchLanguage = new BehaviorSubject(false);
  public langSubject: Subject<string> = new Subject();
  staticLinks: IStaticLinks = {
    NO_DATA: '',
    NO_DATA_DARK: '',
    SLIDER: '',
    ALABERN: '',
    COOKIES_FIREFOX: '',
    CHROME_COOKIES: '',
    INTERNET_EXPLORER_COOKIES: '',
    SAFARI_COOKIES: '',
    OPERA_COOKIES: '',
    COOKIE_ICON: '',
    ART_MUSEUM: '',
    NAMASTECH: '',
    PHOTOGRAPHY_PLAN: '',
    INSTAGRAM_PAGE_LINK: '',
    FACEBOOK_PAGE_LINK: '',
    TWITTER_PAGE_LINK: '',
    VIRTUAL_EXHIBITION_URL: '',
  };
  seoMetaData: { [key: string]: SeoMetadata } = {};

  seoCaMetadata: { [key: string]: SeoMetadata } = CaSeoData;
  seoEsMetadata: { [key: string]: SeoMetadata } = EsSeoData;
  seoEnMetadata: { [key: string]: SeoMetadata } = EnSeoData;
  seoFrMetadata: { [key: string]: SeoMetadata } = FrSeoData;

  constantsData = constants;
  previousUrl: string | undefined;
  public previousPageUrl: BehaviorSubject<string> = new BehaviorSubject('');
  public previousPageUrl$: Observable<string> =
    this.previousPageUrl.asObservable();
  constructor(
    private dialog: MatDialog,
    private readonly snackBar: MatSnackBar,
    private translate: TranslateService,
    private localStorage: LocalStorageService,
    private router: Router,
    private location: Location,
    private dataStore: DataStoreService,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: object,
    @Inject(DOCUMENT) private document: Document,
  ) {}

  normalizeName(name: string) {
    const encodingFixMap: Record<string, string> = {
      Á: 'A',
      À: 'A',
      Â: 'A',
      Ä: 'A',
      Ã: 'A',
      Å: 'A',
      á: 'a',
      à: 'a',
      â: 'a',
      ä: 'a',
      ã: 'a',
      å: 'a',
      É: 'E',
      È: 'E',
      Ê: 'E',
      Ë: 'E',
      é: 'e',
      è: 'e',
      ê: 'e',
      ë: 'e',
      Í: 'I',
      Ì: 'I',
      Î: 'I',
      Ï: 'I',
      í: 'i',
      ì: 'i',
      î: 'i',
      ï: 'i',
      Ó: 'O',
      Ò: 'O',
      Ô: 'O',
      Ö: 'O',
      Õ: 'O',
      ó: 'o',
      ò: 'o',
      ô: 'o',
      ö: 'o',
      õ: 'o',
      Ú: 'U',
      Ù: 'U',
      Û: 'U',
      Ü: 'U',
      ú: 'u',
      ù: 'u',
      û: 'u',
      ü: 'u',
      // 'Ñ': 'N', 'ñ': 'n',
      // 'Ç': 'C', 'ç': 'c',
    };

    return name
      .split('')
      .map((char) => encodingFixMap[char] || char)
      .join('');
  }
  switchLanguages(language: number) {
    this.switchLanguage.next(true);
    this.onLanguageChange(language);
    this.onChangeLanguage();
  }

  setDefaultLangData() {
    this.translate.setTranslation(constants.LANGUAGE_LIST.CA, CaTranslations);
    this.translate.setTranslation(constants.LANGUAGE_LIST.ES, EsTranslations);
    this.translate.setTranslation(constants.LANGUAGE_LIST.EN, EnTranslations);
    this.translate.setTranslation(constants.LANGUAGE_LIST.FR, FrTranslations);
  }

  initializeLanguage() {
    const savedLanguage = JSON.parse(
      this.localStorage.getItem('language') || '2',
    );
    const defaultLanguage = constants.DEFAULT_LANGUAGE;
    const language = savedLanguage || defaultLanguage;
    this.onLanguageChange(language);
  }

  configureRoutes() {
    this.router.resetConfig(this.defineRoutes());
  }

  onChangeLanguage() {
    const currentPath = this.location.path();
    const newPath = this.convertPathToNewLanguage(currentPath);
    this.router.navigateByUrl(newPath);
    this.preventBackNavigation(this.activeLanguage);
  }

  preventBackNavigation(newLanguage: string) {
    if (isPlatformBrowser(this.platformId)) {
      history.pushState({ language: newLanguage }, '', location.href);
      window.onpopstate = (event) => {
        if (event.state?.language === newLanguage) {
          history.go(1);
        }
      };
    }
  }

  convertPathToNewLanguage(currentPath: string): string {
    const pathSegments = currentPath.split('/').filter((segment) => segment);
    const newPathSegments = pathSegments.map((segment) => {
      const routeKey = Object.keys(
        ROUTE_PATHS[this.previousActiveLanguage] || {},
      ).find(
        (key) => ROUTE_PATHS[this.previousActiveLanguage][key] === segment,
      );
      return routeKey ? ROUTE_PATHS[this.activeLanguage][routeKey] : segment;
    });
    return `/${newPathSegments.join('/')}`;
  }

  defineRoutes() {
    const routes: Routes = [
      {
        path: ':lang',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('../../../components/home/home.component').then(
                (m) => m.HomeComponent,
              ),
            data: {
              seo: this.getSinglePageMeta('home'),
              pathKey: [],
            },
          },
          {
            path: this.getPath('PROJECT'),
            loadComponent: () =>
              import(
                '../../../components/project/alabern-portal/alabern-portal.component'
              ).then((m) => m.AlabernPortalComponent),
            data: {
              seo: this.getSinglePageMeta('project'),
              pathKey: ['PROJECT'],
            },
          },
          {
            path: this.getPath('NEW_ACQUISITIONS'),
            loadComponent: () =>
              import(
                '../../../components/project/new-acquisitions/new-acquisitions.component'
              ).then((m) => m.NewAcquisitionsComponent),
            data: {
              seo: this.getSinglePageMeta('acquisitions'),
              pathKey: ['NEW_ACQUISITIONS'],
            },
          },
          {
            path: this.getPath('PHOTOGRAPHY_PLAN'),
            loadComponent: () =>
              import(
                '../../../components/project/photography-plan/photography-plan.component'
              ).then((m) => m.photographyPlanComponent),
            data: {
              seo: this.getSinglePageMeta('photography-plan'),
              pathKey: ['PHOTOGRAPHY_PLAN'],
            },
          },
          {
            path: this.getPath('PHOTOGRAPHER_LIST'),
            loadComponent: () =>
              import(
                '../../../components/project/photographers-list/photographers-list.component'
              ).then((m) => m.PhotographersListComponent),
            data: {
              seo: this.getSinglePageMeta('photographers-list'),
              pathKey: ['PHOTOGRAPHER_LIST'],
            },
          },
          {
            path: this.getPath('PHOTO_SEARCHER'),
            loadComponent: () =>
              import(
                '../../../components/collection/photograph-search/photograph-search.component'
              ).then((m) => m.PhotographSearchComponent),
            data: {
              seo: this.getSinglePageMeta('photographies'),
              pathKey: ['PHOTO_SEARCHER'],
            },
          },
          {
            path: this.getPath('PHOTOGRAPHER_SEARCHER'),
            loadComponent: () =>
              import(
                '../../../components/collection/photographers/photographers.component'
              ).then((m) => m.PhotographersComponent),
            data: {
              seo: this.getSinglePageMeta('photographers'),
              pathKey: ['PHOTOGRAPHER_SEARCHER'],
            },
          },
          {
            path: this.getPath('BACKGROUND_SEARCHER'),
            loadComponent: () =>
              import(
                '../../../components/collection/background-search/background-search.component'
              ).then((m) => m.BackgroundSearchComponent),
            data: {
              seo: this.getSinglePageMeta('artworks-funds'),
              pathKey: ['BACKGROUND_SEARCHER'],
            },
          },
          {
            path: this.getPath('INSTITUTION_SEARCHER'),
            loadComponent: () =>
              import(
                '../../../components/collection/institute-search/institute-search.component'
              ).then((m) => m.InstituteSearchComponent),
            data: {
              seo: this.getSinglePageMeta('institutions'),
              pathKey: ['INSTITUTION_SEARCHER'],
            },
          },
          {
            path: this.getPath('INSTITUTE_DETAIL'),
            loadComponent: () =>
              import(
                '../../../components/collection/institute-file/institute-file.component'
              ).then((m) => m.InstituteFileComponent),
            resolve: {
              instituteDetails: instituteDetailResolver,
            },
          },
          {
            path: this.getPath('PHOTO_DETAIL'),
            loadComponent: () =>
              import(
                '../../../components/collection/photograph-file/photograph-file.component'
              ).then((m) => m.PhotographFileComponent),
            resolve: {
              photoDetails: photographDetailResolver,
            },
          },
          {
            path: this.getPath('PHOTOGRAPHER_DETAILS'),
            loadComponent: () =>
              import(
                '../../../components/collection/photographer-details/photographer-details.component'
              ).then((m) => m.PhotographerDetailsComponent),
            resolve: {
              photographerDetails: photographerDetailResolver,
            },
          },
          {
            path: this.getPath('BACKGROUND_SEARCHER_SLUG'),
            loadComponent: () =>
              import(
                '../../../components/collection/background-file/background-file.component'
              ).then((m) => m.BackgroundFileComponent),
            resolve: {
              artworkDetails: artworkDetailResolver,
            },
          },
          {
            path: this.getPath('RESEARCH'),
            loadComponent: () =>
              import(
                '../../../components/research/resource-search/resource-search.component'
              ).then((m) => m.ResourceSearchComponent),
            data: {
              seo: this.getSinglePageMeta('research'),
              pathKey: ['RESEARCH'],
            },
          },
          {
            path: this.getPath('GLOSSARI'),
            loadComponent: () =>
              import(
                '../../../components/research/glossari/glossari.component'
              ).then((m) => m.GlossariComponent),
            data: {
              seo: this.getSinglePageMeta('glossari'),
              pathKey: ['GLOSSARI'],
            },
          },
          {
            path: this.getPath('CALENDAR_SEARCH_ENGINE'),
            loadComponent: () =>
              import(
                '../../../components/news/calendar-search-agenda/calendar-search-agenda.component'
              ).then((m) => m.CalendarSearchAgendaComponent),
            data: {
              seo: this.getSinglePageMeta('calendar'),
              pathKey: ['CALENDAR_SEARCH_ENGINE'],
            },
          },
          {
            path: this.getPath('BLOG'),
            loadComponent: () =>
              import('../../../components/news/blog/blog.component').then(
                (m) => m.BlogComponent,
              ),
            data: {
              seo: this.getSinglePageMeta('blog'),
              pathKey: ['BLOG'],
            },
          },
          {
            path: this.getPath('EXHIBITION_SHEET_AGENDA'),
            loadComponent: () =>
              import(
                '../../../components/news/exhibition-agenda/exhibition-agenda.component'
              ).then((m) => m.ExhibitionAgendaComponent),
            resolve: {
              activityDetails: activityDetailResolver,
            },
          },
          {
            path: this.getPath('ARTICLE_BLOG'),
            loadComponent: () =>
              import(
                '../../../components/news/article-blog/article-blog.component'
              ).then((m) => m.ArticleBlogComponent),
            resolve: {
              articleDetails: articleDetailResolver,
            },
          },
          // {
          //   path: this.getPath('BEHIND_THE_CAMERA'),
          //   loadComponent: () =>
          //     import(
          //       '../../../components/research/behind-camera/behind-camera.component'
          //     ).then((m) => m.BehindCameraComponent),
          //   data: {
          //     seo: this.getSinglePageMeta('behind-the-camera'),
          //     pathKey: ['BEHIND_THE_CAMERA'],
          //   },
          // },
          {
            path: this.getPath('VIRTUAL_EXHIBITION'),
            loadComponent: () =>
              import(
                '../../../components/exhibition/virtual-exhibition/virtual-exhibition.component'
              ).then((m) => m.VirtualExhibitionComponent),
            data: {
              seo: this.getSinglePageMeta('virtual-exhibition'),
              pathKey: ['VIRTUAL_EXHIBITION'],
            },
          },
          {
            path: this.getPath('COOKIES_POLIICY'),
            loadComponent: () =>
              import(
                '../../../components/cookies-policy/cookies-policy.component'
              ).then((m) => m.CookiesPolicyComponent),
            data: {
              seo: this.getSinglePageMeta('cookies-policy'),
              pathKey: ['COOKIES_POLIICY'],
            },
          },
          {
            path: this.getPath('WHO_WE_ARE'),
            loadComponent: () =>
              import(
                '../../../components/who-we-are/who-we-are.component'
              ).then((m) => m.WhoWeAreComponent),
            data: {
              seo: this.getSinglePageMeta('who-we-are'),
              pathKey: ['WHO_WE_ARE'],
            },
          },
          {
            path: this.getPath('LEGAL_NOTICE'),
            loadComponent: () =>
              import(
                '../../../components/legal-notice/legal-notice.component'
              ).then((m) => m.LegalNoticeComponent),
            data: {
              seo: this.getSinglePageMeta('legal-notice'),
              pathKey: ['LEGAL_NOTICE'],
            },
          },
          {
            path: this.getPath('ACCESSIBILITY'),
            loadComponent: () =>
              import(
                '../../../components/accessibility/accessibility.component'
              ).then((m) => m.AccessibilityComponent),
            data: {
              seo: this.getSinglePageMeta('accessibility'),
              pathKey: ['ACCESSIBILITY'],
            },
          },
          ...(!environment.production
          ? [
              {
                path: this.getPath('BEHIND_THE_CAMERA'),
                loadComponent: () =>
                  import(
                    '../../../components/research/behind-camera/behind-camera.component'
                  ).then((m) => m.BehindCameraComponent),
                data: {
                  seo: this.getSinglePageMeta('behind-the-camera'),
                  pathKey: ['BEHIND_THE_CAMERA'],
                },
              },
              // {
              //   path: this.getPath('VIRTUAL_EXHIBITION'),
              //   loadComponent: () =>
              //     import(
              //       '../../../components/exhibition/virtual-exhibition/virtual-exhibition.component'
              //     ).then((m) => m.VirtualExhibitionComponent),
              //   data: {
              //     seo: this.getSinglePageMeta('virtual-exhibition'),
              //     pathKey: ['VIRTUAL_EXHIBITION'],
              //   },
              // },
            ]
          : []),
          { path: '**', redirectTo: '', pathMatch: 'full' },
        ],
      },
      { path: '**', redirectTo: this.getPath('LANGUAGE'), pathMatch: 'full' },
    ];
    return routes;
  }

  getPath(routeKey: string) {
    return ROUTE_PATHS[this.activeLanguage][routeKey];
  }

  getRoute(routeKey: string): string {
    return (
      ROUTE_PATHS[this.activeLanguage]['LANGUAGE'] +
      '/' +
      ROUTE_PATHS[this.activeLanguage][routeKey]
    );
  }

  getSinglePageMeta(pageName: string) {
    if (this.activeLanguage == 'es') {
      return this.seoEsMetadata[pageName];
    } else if (this.activeLanguage == 'fr') {
      return this.seoFrMetadata[pageName];
    } else if (this.activeLanguage == 'en') {
      return this.seoEnMetadata[pageName];
    } else {
      return this.seoCaMetadata[pageName];
    }
  }

  getLanguageWiseMetaData() {
    if (isPlatformBrowser(this.platformId)) {
      this.http.get(constants.SEO_PATH['SEO_CA']).subscribe({
        next: (res: any) => {
          if (res) {
            this.seoCaMetadata = res;
          }
        },
        error: (err) => {
          console.error(err);
        },
      });

      this.http.get(constants.SEO_PATH['SEO_ES']).subscribe({
        next: (res: any) => {
          if (res) {
            this.seoEsMetadata = res;
          }
        },
        error: (err) => {
          console.error(err);
        },
      });

      this.http.get(constants.SEO_PATH['SEO_EN']).subscribe({
        next: (res: any) => {
          if (res) {
            this.seoEnMetadata = res;
          }
        },
        error: (err) => {
          console.error(err);
        },
      });

      this.http.get(constants.SEO_PATH['SEO_FR']).subscribe({
        next: (res: any) => {
          if (res) {
            this.seoFrMetadata = res;
          }
        },
        error: (err) => {
          console.error(err);
        },
      });
    }
  }

  getLanguageWiseStaticLink() {
    if(isPlatformBrowser(this.platformId)) {
      const languagePathKey: string =
        'STATIC_LINK_' + this.activeLanguage.toUpperCase();
      const languagePath: string = constants.ASSETS_PATH[languagePathKey];

      this.http.get(languagePath).subscribe({
        next: (res: any) => {
          if (res && res.STATIC_LINKS) {
            this.staticLinks = res.STATIC_LINKS;
          }
        },
        error: (err) => {
          console.error(err);
        },
      });
    }
  }

  formatDateTo(date: any, divideBySlash: boolean = false): string {
    const language = this.localStorage.getItem('language');
    if (
      !date ||
      date == '0000-00-00' ||
      date === '' ||
      date === null ||
      date === undefined
    ) {
      return ' ';
    } else {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      let dateFormat = divideBySlash ? 'dd/MM/yyyy' : 'dd-MM-yyyy';
      if (language === '3') {
        dateFormat = divideBySlash ? 'MM/dd/yyyy' : 'MM-dd-yyyy';
      }

      if (dateObj != 'Invalid Date') {
        return formatDate(dateObj, dateFormat, 'en-US', 'UTC');
      } else {
        return '';
      }
    }
  }
  extractYear(date: string): string {
    if (
      date === null ||
      date == undefined ||
      date == '' ||
      date == '0000-00-00'
    ) {
      return '';
    }

    if (/^\d{4}$/.test(date)) {
      return date;
    }

    if (/^\d{2}-\d{2}-\d{4}$/.test(date)) {
      const [year] = date.split('-');
      return year;
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      const [year] = date.split('-');
      return year;
    }

    const processDate = new Date(date);
    processDate.setHours(21, 0, 0, 0);
    const year = processDate.getFullYear();
    return isNaN(year) ? date : year.toString();
  }

  onLanguageChange(language: number) {
    this.language = language;
    this.languageChange.next(language);
    this.previousActiveLanguage = this.activeLanguage;
    if (this.languagesList && this.languagesList.length > 0) {
      const translateLang = this.languagesList.find(
        (item: { id_language: number; name: string; alias: string }) =>
          item.id_language === language,
      );
      translateLang
        ? this.translate.use(translateLang['alias'].toLowerCase())
        : this.translate.use('ca');
      (this.activeLanguage = translateLang
        ? translateLang['alias'].toLowerCase()
        : 'ca'),
        (this.document.documentElement.lang = 'en');
      this.getLanguageWiseStaticLink();
      this.clearStoreData();
      this.configureRoutes();
    }
    // }
    this.localStorage.setItem('language', JSON.stringify(this.language));
  }

  scrollTop() {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
    }
  }

  clearStoreData() {
    this.dataStore.resetPhotographPageData();
    this.dataStore.resetArtWorkFundPageData();
    this.dataStore.resetPhotographersPageData();
    this.dataStore.resetInstitutePageData();
    this.dataStore.resetResearchPageData();
    this.dataStore.resetBehindCameraPageData();
    this.dataStore.resetBlogPageData();
    this.dataStore.resetCalendarPageData();
    this.dataStore.resetGlossaryPageData();
  }

  sortItems(allImageItem: IWorkImage[], orderBy: string) {
    if (orderBy === constants.SORT_BY.ASC) {
      allImageItem.sort((a, b) => {
        const titleA = a.title || '';
        const titleB = b.title || '';
        return titleA.localeCompare(titleB);
      });
    } else if (orderBy === constants.SORT_BY.DESC) {
      allImageItem.sort((a, b) => {
        const titleA = a.title || '';
        const titleB = b.title || '';
        return titleB.localeCompare(titleA);
      });
    }
    return allImageItem;
  }

  getLocalStorage(key: string) {
    const value = this.localStorage.getItem(key);
    if (value) {
      return value;
    }
    return '';
  }

  setLocalStorageValue(key: string, value: string) {
    this.localStorage.setItem(key, value);
    if (key === 'language') {
      this.langSubject.next(value);
    }
  }

  private _openSnackBar(
    message: string,
    className: string,
    isError = false,
    duration = 7000,
  ) {
    this.snackBar.openFromComponent(MatToastrComponent, {
      data: { icon: isError ? 'error' : 'notifications', message },
      duration,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [className],
    });
  }

  public success(message: string, duration = 7000) {
    this._openSnackBar(message, 'success-snackbar-user', false, duration);
  }

  public error(error: string, duration = 7000) {
    this._openSnackBar(error, 'error-snackbar', true, duration);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any

  openImageViewer(
    items: {
      title?: string;
      src: string;
      description?: string;
      date?: string;
      author?: string;
    }[],
  ) {
    const dialogRef = this.dialog.open(ImageViewerComponent, {
      width: '80%',
      data: items,
      autoFocus: false,
      panelClass: 'custom-dialog-container',
    });

    dialogRef.afterClosed().subscribe(() => {
      if (isPlatformBrowser(this.platformId)) {
        const documentEle: any = document;
        if (
          !(
            !documentEle.fullscreenElement &&
            !documentEle.webkitFullscreenElement &&
            !documentEle.mozFullScreenElement &&
            !documentEle.msFullscreenElement
          )
        ) {
          this.toggleFullScreen();
        }
      }
    });
  }

  toggleFullScreen() {
    if (isPlatformBrowser(this.platformId)) {
      const documentEle: any = document;
      const elem: any = documentEle.documentElement; // Use document.documentElement for full document fullscreen
      if (
        !documentEle.fullscreenElement &&
        !documentEle.webkitFullscreenElement &&
        !documentEle.mozFullScreenElement &&
        !documentEle.msFullscreenElement
      ) {
        // If no element is in full-screen mode, enter full-screen
        if (elem.requestFullscreen) {
          elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
          elem.webkitRequestFullscreen();
        } else if (elem['mozRequestFullScreen']) {
          elem['mozRequestFullScreen']();
        } else if (elem['msRequestFullscreen']) {
          elem['msRequestFullscreen']();
        }
      } else {
        // Exit full-screen mode
        if (documentEle.exitFullscreen) {
          documentEle.exitFullscreen();
        } else if (documentEle.webkitExitFullscreen) {
          documentEle.webkitExitFullscreen();
        } else if (documentEle['mozCancelFullScreen']) {
          documentEle['mozCancelFullScreen']();
        } else if (documentEle['msExitFullscreen']) {
          documentEle['msExitFullscreen']();
        }
      }
    }
  }

  convertLinkURL(URL: string | undefined) {
    if (
      URL &&
      (URL.toLowerCase().includes('http://') ||
        URL.toLowerCase().includes('https://'))
    ) {
      return URL;
    } else {
      return '//' + URL;
    }
  }

  checkWorkDate(date: string | null | undefined) {
    if (
      !date ||
      date.toLowerCase() === this.constantsData.NO_DATE_LABEN.toLowerCase()
    ) {
      return this.translate.instant('COMMON.NO_DATE_TEXT');
    }
    return date;
  }

  checkAuthorName(author: { name?: string | null; surnames?: string | null } | null | undefined) : string {
    if (
      !author ||
      (!author.name?.trim() && !author.surnames?.trim())
    ) {
      return this.translate.instant('COMMON.NO_AUTHOR_TEXT');
    }

    const name = author.name?.trim() || '';
    if(name.toLowerCase() === constants.NO_AUTHOR.toLowerCase()){
      return this.translate.instant('COMMON.NO_AUTHOR_TEXT');
    }
    const surnames = author.surnames?.trim() || '';
    return `${name} ${surnames}`.trim();
  }



  openShareModal(data: ISocialShare) {
    this.dialog.open(SocialShareComponent, {
      data: data,
      height: '250px',
      width: '400px',
      panelClass: ['share-icon-modal'],
    });
  }

  sorAsendingFilterData(data: any[]) {
    return data.sort((a: { name: string }, b: { name: string }) =>
      {
        if (!a?.name) return 1;
        if (!b?.name) return -1;
        return a.name.localeCompare(b.name);
      }
    );
  }
  sortLanguages(
    languages: { id_language: number; alias: string; name: string }[],
  ): any[] {
    if (!languages || languages.length === 0) {
      return [];
    }
    const catalanLang = languages.find((lang) => lang.id_language === 2);
    const otherLanguages = languages.filter((lang) => lang.id_language !== 2);
    return [catalanLang, ...otherLanguages];
  }

  isComingFromDetailsPage(detailsPageUrl: string): Observable<boolean> {
    return this.previousPageUrl$.pipe(
      map((previousUrl: string) => {
        return previousUrl.includes(detailsPageUrl);
      }),
    );
  }

  sortRangeDecade(data: { id: string; name: string; count: number }[]) {
    return data.sort((a: { id: string }, b: { id: string }) => {
      const startYearA = parseInt(a.id.split('-')[0]);
      const startYearB = parseInt(b.id.split('-')[0]);
      return startYearB - startYearA;
    });
  }

  copyUrlToClipboard(): void {
    if (isPlatformBrowser(this.platformId)) {
      const currentUrl = window.location.href;
      if (navigator.clipboard) {
        navigator.clipboard
          .writeText(currentUrl)
          .then(() => {
            this.success('URL copied to clipboard');
          })
          .catch(() => {
            this.error('Could not copy URL');
            this.fallbackCopyTextToClipboard(currentUrl);
          });
      } else {
        this.fallbackCopyTextToClipboard(currentUrl);
      }
    }
  }

  fallbackCopyTextToClipboard(text: string): void {
    if (isPlatformBrowser(this.platformId)) {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.top = '0';
      textArea.style.left = '0';
      textArea.style.position = 'fixed';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        this.success('Fallback: URL copied to clipboard');
      } catch (err) {
        this.error('Fallback: Could not copy text');
      }
      document.body.removeChild(textArea);
    }
  }

  scrollToElementById(targetId: string): void {
    if (isPlatformBrowser(this.platformId) && targetId) {
      setTimeout(() => {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          const topOffset = 100;
          const yPosition =
            targetElement.getBoundingClientRect().top +
            window.scrollY -
            topOffset;
          window.scrollTo({
            top: yPosition,
            behavior: 'smooth',
          });
        }
      }, 1000);
    }
  }
  addRecaptchaScript() {
    if (isPlatformBrowser(this.platformId)) {
      const recaptchaScrit = document.createElement('script');
      recaptchaScrit.src = `https://www.google.com/recaptcha/api.js?render=${environment.RECAPTCHA_V3_KEY}`;
      document.head.appendChild(recaptchaScrit);

      const badge = document.getElementsByClassName('grecaptcha-badge')[0];
      if (badge && badge instanceof HTMLElement) {
        badge.style.visibility = 'visible';
      }
    }
  }

  removeRecaptchScript() {
    if (isPlatformBrowser(this.platformId)) {
      const scriptV3 = document.querySelector(
        `script[src="https://www.google.com/recaptcha/api.js?render=${environment.RECAPTCHA_V3_KEY}"]`,
      );
      if (scriptV3) {
        scriptV3.remove();
      }

      const badge = document.getElementsByClassName('grecaptcha-badge')[0];
      if (badge && badge instanceof HTMLElement) {
        badge.style.visibility = 'hidden';
      }
    }
  }

  preloadImage(url: string): void {
    if (isPlatformBrowser(this.platformId)) {
      const linkEl = this.document.createElement('link');
      linkEl.setAttribute('rel', 'preload');
      linkEl.setAttribute('as', 'image');
      linkEl.setAttribute('href', url);
      linkEl.setAttribute('fetchpriority', 'high');
      this.document.head.appendChild(linkEl);
    }
  }

  getImageUrl(path: string, imageName: string): string {
    const baseUrl = environment.IMAGE_URL + path;
    return `${baseUrl}${imageName}`;
  }
}
