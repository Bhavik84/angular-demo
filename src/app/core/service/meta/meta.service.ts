import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, mergeMap, Subject, takeUntil } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ROUTE_PATHS } from '../../enums/routes.enum';
import { CommonService } from '../common/common.service';

@Injectable({
  providedIn: 'root',
})
export class MetaService {
  private unsubscribe$: Subject<void> = new Subject<void>();
  private baseUrl = environment.BASE_PATH.substring(
    0,
    environment.API_END_POINT.length - 1,
  );
  private renderer: Renderer2;
  private titleSubject = new Subject<string>();
  public title$ = this.titleSubject.asObservable();
  ROUTE_PATHS = ROUTE_PATHS;
  constructor(
    private meta: Meta,
    private title: Title,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    @Inject(DOCUMENT) private document: Document,
    private common: CommonService,
    private rendererFactory: RendererFactory2,
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  init(): void {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map((route) => {
          while (route.firstChild) route = route.firstChild;
          return route;
        }),
        mergeMap((route) => route.data),
        takeUntil(this.unsubscribe$),
      )
      .subscribe((data) => {
        if (data['seo']) {
          this.updateSeoTags(data['seo']);
        } else if (data['photoDetails'] && data['photoDetails'].data) {
          const photographDetail = data['photoDetails'].data;

          this.updateSeoTags({
            title: photographDetail.name ? photographDetail.name : '',
            description: photographDetail.name ? photographDetail.name : '',
            keywords: photographDetail.name ? photographDetail.name : '',
            image:
            photographDetail.imagesData &&
            photographDetail.imagesData.length > 0 &&
            photographDetail.imagesData[0].filename
            ? environment.IMAGE_URL +
            environment.WORKS +
            photographDetail.imagesData[0].extra_folder + '/' + this.common.constantsData.IMAGE_SIZES.LIST + '/' + photographDetail.imagesData[0].filename + this.common.constantsData.IMAGE_PARAM
            : '',
          });
        } else if (
          data['photographerDetails'] &&
          data['photographerDetails'].data
        ) {
          const photographerDetail = data['photographerDetails'].data;
          const name =
            (photographerDetail.name ? photographerDetail.name : '') +
            ' ' +
            (photographerDetail.surnames ? photographerDetail.surnames : '');
          this.updateSeoTags({
            title: name,
            description: name,
            keywords: name,
            image:
              photographerDetail.authors_images &&
              photographerDetail.authors_images.length > 0 &&
              photographerDetail.authors_images[0].url
                ? environment.IMAGE_URL +
                  environment.AUTHORS +
                  photographerDetail.authors_images[0].url + this.common.constantsData.IMAGE_PARAM
                : '',
          });
        } else if (data['artworkDetails'] && data['artworkDetails'].data) {
          const artworkDetails = data['artworkDetails'].data;
          const collectionTitle =
            artworkDetails.collections_languages &&
            artworkDetails.collections_languages.length > 0 &&
            artworkDetails.collections_languages[0].title_short;
          this.updateSeoTags({
            title: collectionTitle ? collectionTitle : '',
            description: collectionTitle ? collectionTitle : '',
            keywords: collectionTitle ? collectionTitle : '',
            image:
              artworkDetails.collections_images &&
              artworkDetails.collections_images.length > 0 &&
              artworkDetails.collections_images[0].url
                ? environment.IMAGE_URL +
                  environment.COLLECTIONS +
                  artworkDetails.collections_images[0].url + this.common.constantsData.IMAGE_PARAM
                : '',
          });
        } else if (data['instituteDetails'] && data['instituteDetails'].data) {
          const instituteDetails = data['instituteDetails'].data;
          this.updateSeoTags({
            title: instituteDetails.name ? instituteDetails.name : '',
            description: instituteDetails.name ? instituteDetails.name : '',
            keywords: instituteDetails.name ? instituteDetails.name : '',
            image:
              instituteDetails.institutions_images &&
              instituteDetails.institutions_images.length > 0 &&
              instituteDetails.institutions_images[0].url
                ? environment.IMAGE_URL +
                  environment.INSTITUTIONS +
                  instituteDetails.institutions_images[0].url + this.common.constantsData.IMAGE_PARAM
                : '',
          });
        } else if (data['activityDetails'] && data['activityDetails'].data) {
          const activityDetails = data['activityDetails'].data;
          const activityTitle =
            activityDetails.activities_languages &&
            activityDetails.activities_languages.length > 0 &&
            activityDetails.activities_languages[0].name
              ? activityDetails.activities_languages[0].name
              : '';
          this.updateSeoTags({
            title: activityTitle,
            description: activityTitle,
            keywords: activityTitle,
            image:
              activityDetails.activities_images &&
              activityDetails.activities_images.length > 0 &&
              activityDetails.activities_images[0].url
                ? environment.IMAGE_URL +
                  environment.ACTIVITIES +
                  activityDetails.activities_images[0].url + this.common.constantsData.IMAGE_PARAM
                : '',
          });
        } else if (data['articleDetails'] && data['articleDetails'].data) {
          const articleDetails = data['articleDetails'].data;
          const articlerTitle =
            articleDetails.articles_languages &&
            articleDetails.articles_languages.length > 0 &&
            articleDetails.articles_languages[0].title
              ? articleDetails.articles_languages[0].title
              : '';
          this.updateSeoTags({
            title: articlerTitle,
            description: articlerTitle,
            keywords: articlerTitle,
            image:
              articleDetails.articles_images &&
              articleDetails.articles_images.length > 0 &&
              articleDetails.articles_images[0].url
                ? environment.IMAGE_URL +
                  environment.ARTICLES +
                  articleDetails.articles_images[0].url + this.common.constantsData.IMAGE_PARAM
                : '',
          });
        }
        // if(environment.production)
        if (data['pathKey']) {
          this.setAllLinkData(data['pathKey'], data['seo']);
        }
        // }
      });
  }

  private updateSeoTags(seo: {
    title: string;
    description: string;
    keywords: string;
    image: string;
  }): void {
    this.title.setTitle(seo.title);
    this.titleSubject.next(seo.title);
    this.meta.updateTag({ name: 'description', content: seo.description });
    this.meta.updateTag({ name: 'keywords', content: seo.keywords });
    this.meta.updateTag({ property: 'og:title', content: seo.title });
    this.meta.updateTag({
      property: 'og:description',
      content: seo.description,
    });
    this.meta.updateTag({ property: 'og:image', content: seo.image });
  }

  private setAllLinkData(
    pathKey: string[],
    seo: {
      title: string;
      description: string;
      keywords: string;
      image: string;
    },
  ) {
    const baseUrl = `${this.baseUrl}`;
    const languagePaths = this.generateLanguagePaths(baseUrl, pathKey[0]);

    // Set Canonical Tag
    this.setCanonical(baseUrl);

    this.setHreflang(languagePaths);

    this.updateSchemeaOrg(seo, languagePaths);
  }

  private setCanonical(url: string) {
    const currentPath = this.document.location.pathname;
    const canonicalUrl = new URL(currentPath, url).toString();
    const existingLinks = this.document.querySelectorAll(
      'link[rel="canonical"]',
    );
    existingLinks.forEach((link) => link.remove());
    const link: HTMLLinkElement = this.document.createElement('link');
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', canonicalUrl);
    this.document.head.appendChild(link);
  }

  private setHreflang(languagesPath: {
    ca: string;
    es: string;
    en: string;
    fr: string;
  }) {
    const existingLinks = this.document.querySelectorAll(
      'link[rel="alternate"]',
    );
    existingLinks.forEach((link) => link.remove());

    const hreflangs = [
      { lang: 'ca', href: languagesPath.ca },
      { lang: 'es', href: languagesPath.es },
      { lang: 'en', href: languagesPath.en },
      { lang: 'fr', href: languagesPath.fr },
      { lang: 'x-default', href: this.baseUrl },
    ];

    hreflangs.forEach(({ lang, href }) => {
      const link: HTMLLinkElement = this.document.createElement('link');
      link.setAttribute('rel', 'alternate');
      link.setAttribute('hreflang', lang);
      link.setAttribute('href', href);
      this.document.head.appendChild(link);
    });
  }

  generateLanguagePaths(baseUrl: string, pathKey: string) {
    const paths: any = {};
    const languages: string[] = ['ca', 'es', 'en', 'fr'];
    languages.forEach((lang: string) => {
      paths[lang] = pathKey
        ? `${baseUrl}${lang}/${ROUTE_PATHS[lang][pathKey]}`
        : `${baseUrl}${lang}`;
    });
    return paths;
  }

  updateSchemeaOrg(
    seo: {
      title: string;
      description: string;
      keywords: string;
      image: string;
    },
    languagesPath: { [key: string]: string },
  ) {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      headline: seo.title,
      description: seo.description,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': languagesPath[this.common.activeLanguage]
          ? languagesPath[this.common.activeLanguage]
          : languagesPath['es'],
      },
    };

    const script = this.renderer.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(jsonLd);
    this.renderer.appendChild(this.document.head, script);
  }

  unsubscribeRoutes() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
