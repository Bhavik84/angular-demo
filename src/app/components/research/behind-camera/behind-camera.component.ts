import { DatePipe, isPlatformBrowser } from '@angular/common';
import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { constants } from '../../../core/enums/constants';
import { ApiService } from '../../../core/service/api/api.service';
import { CommonService } from '../../../core/service/common/common.service';
import { DataStoreService } from '../../../core/service/DataStore/data-store.service';
import { CustomMasonryLayoutComponent } from '../../../shared/component/custom-masonry-layout/custom-masonry-layout/custom-masonry-layout.component';
import { CustomSearchComponent } from '../../../shared/component/custom-search/custom-search.component';
import { IBlogPayload } from '../../../shared/interfaces/article-blog';
import { blogData, ILanguageImage } from '../../../shared/interfaces/blog';
import { Image } from '../../../shared/interfaces/image';
import { SanitizeHtmlPipe } from '../../../shared/pipes/sanitizeHtml/sanitize-html.pipe';

@Component({
  selector: 'app-behind-camera',
  standalone: true,
  imports: [
    TranslateModule,
    MatIconModule,
    CustomSearchComponent,
    MatProgressSpinnerModule,
    SanitizeHtmlPipe,
    CustomMasonryLayoutComponent,
  ],
  templateUrl: './behind-camera.component.html',
  styleUrl: './behind-camera.component.scss',
  providers: [DatePipe],
})
export class BehindCameraComponent implements OnInit, OnDestroy {
  totalCount: number = 0;
  private unsubscribe$ = new Subject<void>();
  isLoading: boolean = true;
  imageList: Image[] = [];
  searchResult: string = '';
  localPayload: IBlogPayload = {
    blogActivePage: 1,
    pageSize: constants.LIMIT.TEN,
  };
  constructor(
    private apiService: ApiService,
    private router: Router,
    public commonService: CommonService,
    private dataStore: DataStoreService,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {}

  ngOnInit(): void {
    if (this.dataStore.behindCameraPageData) {
      if (this.dataStore.behindCameraPageData.searchData) {
        this.searchResult = this.dataStore.behindCameraPageData.searchData;
      }
      if (
        this.dataStore.behindCameraPageData.behindTheCameraScrollId &&
        this.dataStore.behindCameraPageData.behindTheCameraScrollId.length > 0
      ) {
        const targetId =
          this.dataStore.behindCameraPageData.behindTheCameraScrollId;
        this.commonService.scrollToElementById(targetId);
        this.dataStore.behindCameraPageData.behindTheCameraScrollId = '';
      } else {
        this.commonService.scrollTop();
      }

      if (
        this.dataStore.behindCameraPageData.activePage &&
        this.dataStore.behindCameraPageData.activePage > 1
      ) {
        this.localPayload.blogActivePage =
          this.dataStore.behindCameraPageData.activePage;
      }
    }

    this.onReloadPage();
  }

  private onReloadPage() {
    if (
      this.dataStore.behindCameraPageData.blogsData &&
      this.dataStore.behindCameraPageData.blogsData.length > 0
    ) {
      this.imageList = [];
      setTimeout(() => {
        this.isLoading = false;
        this.checkFilterData();
      }, 200);
    } else {
      this.getAllBlog();
    }
  }

  search(data: string) {
    if (data.trim() !== this.dataStore.behindCameraPageData.searchData) {
      this.searchResult = data;
      this.dataStore.behindCameraPageData.searchData = data.trim();
      this.imageList = [];
      this.localPayload.blogActivePage = 1;
      this.checkFilterData();
    }
  }

  async getAllBlog() {
    this.isLoading = true;
    const payload = {
      search: '',
      family: [1],
    };
    this.apiService
      .post(`${environment.GET_ALL_ARTICLE}`, payload)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response) => {
          if (response.data && !response.is_error) {
            this.isLoading = false;
            this.dataStore.behindCameraPageData.blogsData = [
              ...response.data.articles,
            ];
            this.checkFilterData();
          } else {
            this.isLoading = false;
            this.commonService.error(response.message);
          }
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  checkFilterData() {
    const filteredBlogData = this.returnFilterData();
    const splitBlogData = filteredBlogData.slice(
      0,
      this.localPayload.blogActivePage * this.localPayload.pageSize,
    );
    this.returnFilterData()?.forEach((element: blogData) => {
      element.article_language_images = this.checkImageData(element);
    });
    this.imageList = [];
    splitBlogData.forEach((element: blogData) => {
      this.imageList.push({
        id: element.id,
        slug: element.slug,
        image:
          element.article_language_images &&
          element.article_language_images.length > 0 &&
          element.article_language_images[0].url
            ? element.article_language_images[0].url
            : '',
        title: element.articles_languages[0]?.title,
        description: element.articles_languages[0]?.summary,
        date: element.date,
      });
    });

    this.totalCount = filteredBlogData.length;
  }

  returnFilterData() {
    return this.dataStore.behindCameraPageData.blogsData.filter(
      (data: blogData) => {
        // Search filter
        const isSearchMatched =
          this.searchResult && this.searchResult.length > 0
            ? (() => {
                if (
                  data.articles_languages &&
                  data.articles_languages.length > 0
                ) {
                  const title = data.articles_languages[0].title
                    ? this.commonService.normalizeName(
                        data?.articles_languages[0]?.title,
                      )
                    : '';
                  const subTitle = data.articles_languages[0].subtitle
                    ? this.commonService.normalizeName(
                        data?.articles_languages[0]?.subtitle,
                      )
                    : '';

                  return (
                    title
                      ?.toLowerCase()
                      .includes(
                        this.commonService
                          .normalizeName(this.searchResult.trim())
                          .toLowerCase(),
                      ) ||
                    subTitle
                      ?.toLowerCase()
                      .includes(
                        this.commonService
                          .normalizeName(this.searchResult.trim())
                          .toLowerCase(),
                      )
                  );
                }
                return false;
              })()
            : true;

        return isSearchMatched;
      },
    );
  }
  checkImageData(element: blogData) {
    const filteredImages: ILanguageImage[] = [];
    if (element.articles_images && element.articles_images.length > 0) {
      const imagesWithLanguages = element.articles_images?.some(
        (img: ILanguageImage) =>
          img.articles_images_languages &&
          img.articles_images_languages.length > 0,
      );
      if (imagesWithLanguages) {
        const filteredElement = element?.articles_images?.filter(
          (img: ILanguageImage) =>
            img.articles_images_languages?.some(
              (lang) => lang.id_language === this.commonService.language,
            ),
        );
        if (filteredElement && filteredElement.length > 0) {
          filteredImages.push(filteredElement[0]);
        }
      } else {
        filteredImages.push(element.articles_images[0]);
      }
    }
    return filteredImages;
  }

  scrollTop() {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
    }
  }

  showMore() {
    this.localPayload.blogActivePage++;
    this.dataStore.behindCameraPageData.activePage =
      this.localPayload.blogActivePage;
    this.checkFilterData();
  }

  redirectToDetailPage(item: string) {
    this.dataStore.behindCameraPageData.behindTheCameraScrollId = item;
    this.router.navigate([`${this.commonService.getRoute('BLOG')}/${item}`]);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.commonService.switchLanguage.next(false);
  }
}
