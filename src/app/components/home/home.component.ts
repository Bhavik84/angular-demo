import { CommonModule } from '@angular/common';
import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { environment } from '../../../environments/environment';
import { constants } from '../../core/enums/constants';
import { ESvgIcon } from '../../core/enums/svg-icon.enum';
import { ApiService } from '../../core/service/api/api.service';
import { CommonService } from '../../core/service/common/common.service';
import { DataStoreService } from '../../core/service/DataStore/data-store.service';
import { CommonSwiperSlider } from "../../shared/component/common-swiper-slider/common-swiper-slider";
import { SwiperSlider } from "../../shared/component/swiper-slider/swiper-slider";
import { ImageErrorDirective } from '../../shared/directives/imge-error/image-error.directive';
import { HomePageActivity, HomePageBlog } from '../../shared/interfaces/article-blog';
import { HomeVirtualExhibition } from '../../shared/interfaces/exhibition';
import { BannerImage, IImageData, Image } from '../../shared/interfaces/image';
import { Photographer } from '../../shared/interfaces/photographer';
import { IHomeBannerImage } from '../../shared/interfaces/work';
import { SanitizeHtmlPipe } from '../../shared/pipes/sanitizeHtml/sanitize-html.pipe';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterModule,
    TranslateModule,
    CommonModule,
    MatIconModule,
    ImageErrorDirective,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatSelectModule,
    CommonModule,
    FormsModule,
    MatDialogModule,
    SanitizeHtmlPipe,
    SwiperSlider,
    CommonSwiperSlider
],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  icons = ESvgIcon;
  @ViewChild('cookies') cookies!: TemplateRef<unknown>;
  selectedFilter: { value: string; labelKey: string } | '' = '';
  filterOption = [
    {
      value: constants.HOME_SEARCH_OPTION.PHOTOGRAPH,
      labelKey: 'HOME.SECTION_2_FILTER_LABLE_PHOTOGRAPHS',
    },
    {
      value: constants.HOME_SEARCH_OPTION.PHOTOGRAPHER,
      labelKey: 'HOME.SECTION_2_FILTER_LABLE_PHOTOGRAPHERS',
    },
    {
      value: constants.HOME_SEARCH_OPTION.COLLECTION,
      labelKey: 'HOME.SECTION_2_FILTER_LABLE_FUNDS',
    },
    {
      value: constants.HOME_SEARCH_OPTION.INSTITUTION,
      labelKey: 'HOME.SECTION_2_FILTER_LABLE_INSTITUTION',
    },
  ];

  searchResult: string = '';
  isLoading: boolean = true;

  // Banner Config
  bannerImage: IHomeBannerImage[] = [];
  blogData!: HomePageBlog;
  virtualExhibition!: HomeVirtualExhibition[];

  activityData:  HomePageActivity | null = null;
  activityDataType2: HomePageActivity | null = null;
  activityDataType3:  HomePageActivity | null = null;
  mostViewsList: BannerImage[] = [];
  currentSelectedImage!: IImageData;
  bannerLoading = false
  searchText = '';
  photographerImage: Image[] = [];
  isCookie!: boolean;
  private unSubscribe$ = new Subject<void>();
  @ViewChild(ImageErrorDirective) directive!: ImageErrorDirective;

  constructor(
    private router: Router,
    private apiService: ApiService,
    public common: CommonService,
    private dialog: MatDialog,
    private dataStore: DataStoreService,
  ) {}

  ngOnInit() {
    this.onReloadPage();
    this.common.scrollTop();
    const cookie = this.common.getLocalStorage('cookie');
    this.isCookie = cookie
      ? JSON.parse(this.common.getLocalStorage('cookie'))
      : false;
  }

  searchinput(event: KeyboardEvent) {
    if (event.key == 'Enter') {
      this.search();
    }
  }

  onReloadPage() {
    this.getAllAuthorsImage();
    this.getBlog();
    this.getActivityType3();
    this.getActivities();
    this.getActivitiesOfType2();
    this.mostViewedWork();
    this.getBannerImage();
  }

  getBannerImage() {
    this.bannerImage = [];
    this.bannerLoading = true;
    this.apiService
      .get(`${environment.GET_BANNER_IMAGE}`)
      .pipe(takeUntil(this.unSubscribe$))
      .subscribe({
        next: (response) => {
          this.bannerLoading = false;
          if (response.data && !response.is_error) {
            response.data.forEach((element: BannerImage, index: number) => {
              let description = '';
              description = this.common.checkAuthorName(element.author)
              this.bannerImage.push({
                id: element.id,
                slug: element.slug,
                image: element.mainSlider,
                title: element.name,
                description: description,
                thumbnail: element.thumbnailSlider,
                date: this.common.checkWorkDate(element.date),
              });
              element.imagesData;
              if (
                index === 0 &&
                element.mainSlider &&
                element.mainSlider.filename?.length > 0
              ) {
                const preloadUrl = this.getImageUrl(
                  element.mainSlider,
                  this.common.constantsData.IMAGE_SIZES.BIG,
                );
                this.common.preloadImage(preloadUrl);
              }
            });
          } else {
            this.common.error(response.message);
          }
        },
      });
  }

  getActivities() {
    const payload = {
      limit: 1,
      offset: 0,
      search: '',
      types: [1, 4, 6, 7, 8, 9],
    };
    this.apiService
      .post(`${environment.GET_ALL_ACTIVITY}`, payload)
      .pipe(takeUntil(this.unSubscribe$))
      .subscribe({
        next: (response) => {
          if (response.data && !response.is_error) {
            this.activityData = this.getRandomActivity(response.data);
          } else {
            this.common.error(response.message);
          }
        },
      });
  }

  getImageUrl(img:IImageData, size: string): string {
    if(!img){
      return environment.DEFAULT_IMAGE_PATH
    }
    const baseUrl = environment.IMAGE_URL + environment.WORKS;
    const folderPath =
      img?.extra_folder && img.extra_folder.length > 0
        ? `${img.extra_folder}/${size}/`
        : `${size}/`;

    return `${baseUrl}${folderPath}${img.filename}`;
  }

  getSizes(img: IImageData): string {
    if (!img) return '';
    return `
      (min-width: 1400px) ${img?.width_big}px,
      (min-width: 1200px) ${img?.width_box}px,
      (min-width: 900px) ${img?.width_list}px,
      ${img?.width_thumb}px
    `.trim();
  }

  getSrcSet(img: IImageData): string {
    if (!img) return '';
    return `
      ${this.getImageUrl(img, this.common.constantsData.IMAGE_SIZES.BIG)} ${img?.width_big}w,
      ${this.getImageUrl(img, this.common.constantsData.IMAGE_SIZES.BOX)} ${img?.width_box}w,
      ${this.getImageUrl(img, this.common.constantsData.IMAGE_SIZES.LIST)} ${img?.width_list}w,
      ${this.getImageUrl(img, this.common.constantsData.IMAGE_SIZES.THUMB)} ${img?.width_thumb}w
    `.trim();
  }

  getActivitiesOfType2() {
    const payload = {
      limit: 1,
      offset: 0,
      search: '',
      types: [2,5],
      sortBy: this.common.constantsData.SORT_BY.DESC,
    };
    this.apiService
      .post(`${environment.GET_ALL_ACTIVITY}`, payload)
      .pipe(takeUntil(this.unSubscribe$))
      .subscribe({
        next: (response) => {
          if (response.data && !response.is_error) {
            this.activityDataType2 = this.getRandomActivity(response.data);
          } else {
            this.common.error(response.message);
          }
        },
      });
  }

  getActivityType3() {
    this.isLoading = true;
    const payload = {
      limit: 1,
      offset: 0,
      types: [3],
      sortBy: 'DESC',
    };
    this.apiService
      .post(`${environment.GET_ALL_ACTIVITY}`, payload)
      .pipe(takeUntil(this.unSubscribe$))
      .subscribe({
        next: (response) => {
          if (response.data && !response.is_error) {
            this.activityDataType3 = this.getRandomActivity(response.data);
            this.isLoading = false;
          } else {
            this.isLoading = false;
            this.common.error(response.message);
          }
        },
      });
  }

  search() {
    if (this.searchText != '' && this.selectedFilter) {
      if (
        this.selectedFilter.value == constants.HOME_SEARCH_OPTION.PHOTOGRAPHER
      ) {
        this.router.navigate([this.common.getRoute('PHOTOGRAPHER_SEARCHER')]);
        this.dataStore.photographersPageData.searchData = this.searchText;
      } else if (
        this.selectedFilter.value == constants.HOME_SEARCH_OPTION.COLLECTION
      ) {
        this.router.navigate([this.common.getRoute('BACKGROUND_SEARCHER')]);
        this.dataStore.artWorkFundPageData.searchData = this.searchText;
      } else if (
        this.selectedFilter.value == constants.HOME_SEARCH_OPTION.INSTITUTION
      ) {
        this.router.navigate([this.common.getRoute('INSTITUTION_SEARCHER')]);
        this.dataStore.institutePageData.searchData = this.searchText;
      } else if (
        this.selectedFilter.value == constants.HOME_SEARCH_OPTION.PHOTOGRAPH
      ) {
        this.router.navigate([this.common.getRoute('PHOTO_SEARCHER')]);
        this.dataStore.photographPageData.searchData = this.searchText;
      }
    }
  }

  mostViewedWork() {
    this.apiService
      .get(environment.GET_MOST_VIEWED_WORK)
      .pipe(takeUntil(this.unSubscribe$))
      .subscribe({
        next: (res) => {
          if (res.data && !res.is_error) {
            this.mostViewsList = res.data;
            this.currentSelectedImage = res.data[0].imagesData;
          }
        },
        error: () => {},
      });
  }

  getAllAuthorsImage() {
    this.isLoading = true;
    this.apiService
      .get(`${environment.GET_RANDOM_AUTHOR}`)
      .pipe(takeUntil(this.unSubscribe$))
      .subscribe({
        next: (response) => {
          if (response.data && !response.is_error) {
            if (response.data.length === 0) {
              this.isLoading = false;
            }
            response.data.forEach((element: Photographer) => {
              this.photographerImage.push({
                id: element.id,
                title: this.common.checkAuthorName(element),
                slug: element.slug,
                image:
                  element.authors_images && element.authors_images.length > 0
                    ? environment.IMAGE_URL +
                      environment.AUTHORS +
                      element.authors_images[0].url
                    : environment.DEFAULT_IMAGE_PATH,
                date: this.common.formatDateTo(element.date_insert),
              });
            });
            this.isLoading = false;
          } else {
            this.common.error(response.message);
          }
        },
      });
  }

  redirectToDetailPage(item: string) {
    this.router.navigate([
      `${this.common.getRoute('PHOTOGRAPHER_SEARCHER')}/${item}`,
    ]);
  }

  getBlog() {
    const payload = {
      search: '',
    };
    this.apiService
      .post(`${environment.GET_ALL_ARTICLE}`, payload)
      .pipe(takeUntil(this.unSubscribe$))
      .subscribe({
        next: (response) => {
          if (response.data && !response.is_error) {
            this.blogData = this.getRandomArticle(response.data.articles);
          } else {
            this.common.error(response.message);
          }
        },
      });
  }

  setCurrentImage(imageData: IImageData) {
    this.currentSelectedImage = imageData;
  }

  openDetail(id: string | undefined) {
    this.router.navigate([`${this.common.getRoute('PHOTO_SEARCHER')}/${id}`]);
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;

    const picture = img.parentElement as HTMLPictureElement;
    if (picture) {
      const sources = picture.getElementsByTagName('source');
      for (let i = 0; i < sources.length; i++) {
        sources[i].srcset = environment.DEFAULT_IMAGE_PATH;
      }
    }

    img.src = environment.DEFAULT_IMAGE_PATH;
    img.srcset = environment.DEFAULT_IMAGE_PATH;
  }


  getRandomActivity(data: HomePageActivity[]): any {
    if (!data || data.length === 0) return null;

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    let filtered = data.filter((item) => {
      const start = item?.initial_date ? new Date(item.initial_date) : null;
      const end = item?.final_date ? new Date(item.final_date) : null;
      if (!start) return false;

      const monthStart = new Date(currentYear, currentMonth, 1);
      const monthEnd = new Date(currentYear, currentMonth + 1, 0);

      const rangeStart = start;
      const rangeEnd = end || start;

      return rangeStart <= monthEnd && rangeEnd >= monthStart;
    });

    if (filtered.length === 0) {
      const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
      const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;

      filtered = data.filter((item) => {
        const start = item?.initial_date ? new Date(item.initial_date) : null;
        const end = item?.final_date ? new Date(item.final_date) : null;
        if (!start) return false;

        const monthStart = new Date(nextYear, nextMonth, 1);
        const monthEnd = new Date(nextYear, nextMonth + 1, 0);

        const rangeStart = start;
        const rangeEnd = end || start;
        return rangeStart <= monthEnd && rangeEnd >= monthStart;
      });
    }

    if (filtered.length === 0) {
      const sorted = data
        .filter((item) => item?.initial_date)
        .sort((a, b) => new Date(b.initial_date).getTime() - new Date(a.initial_date).getTime());

      if (sorted.length > 0) {
        return sorted[0];
      }
      return null;
    }
    const randomIndex = Math.floor(Math.random() * filtered.length);
    return filtered[randomIndex];
  }

  getRandomArticle(articles: any[]): any {
    if (!articles || articles.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * articles.length);
    return articles[randomIndex];
  }


  ngOnDestroy(): void {
    this.unSubscribe$.next();
    this.unSubscribe$.complete();
    this.common.switchLanguage.next(false);
  }
}
